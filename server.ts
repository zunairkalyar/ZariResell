import express from 'express';
import * as path from 'path';
import { createServer as createViteServer } from 'vite';
import { loadDatabase, saveDatabase, getDatabase } from './src/server-db.js';
import { Order, OrderItem, Product, StoreSettings } from './src/types.js';

// Load our persistent JSON database at boot
loadDatabase();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Helper to authenticate admin token
const ADMIN_SECRET = 'zariresell123'; // Super easy default matching admin token
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['x-admin-token'];
  if (authHeader === ADMIN_SECRET) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Invalid admin secret.' });
  }
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS
// ----------------------------------------------------

// Get store info needed by catalog
app.get('/api/store-data', (req, res) => {
  const db = getDatabase();
  res.json({
    brands: db.brands.filter(b => !b.hidden),
    categories: db.categories,
    products: db.products.filter(p => !p.hidden),
    settings: {
      ...db.settings,
      // Hide any potential sensitive password/account rules if they exist
    }
  });
});

// Calculate cart on the server (independently, secure)
app.post('/api/cart/calculate', (req, res) => {
  try {
    const { items } = req.body as { items: { productId: string; size: string; color: string; quantity: number }[] };
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ error: 'Invalid cart payload' });
      return;
    }

    const db = getDatabase();
    const verifiedItems: OrderItem[] = [];
    let totalPieces = 0;

    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId && !p.hidden);
      if (!product) continue;

      const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
      if (!variant) continue;

      // Limit quantity to available stock
      const purchaseQty = Math.max(1, Math.min(item.quantity, variant.stock));
      if (purchaseQty <= 0) continue;

      verifiedItems.push({
        productId: product.id,
        productName: product.title,
        brandName: product.brandName,
        code: product.code,
        size: item.size,
        color: item.color,
        quantity: purchaseQty,
        price: 2000, // Temporary placeholder, updated below based on tier
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : undefined
      });

      totalPieces += purchaseQty;
    }

    // Determine pricing rate per piece according to settings tiers
    let ratePerPiece = 2000; // Default fallback
    const settings = db.settings;
    
    // Process matching tier
    for (const tier of settings.tiers) {
      if (totalPieces >= tier.minQty) {
        if (tier.maxQty === null || totalPieces <= tier.maxQty) {
          ratePerPiece = tier.rate;
        }
      }
    }

    // Re-assess pricing with standard logic requested explicitly by prompt:
    // 1-4 items: Rs. 2,000, 5-9: Rs. 1,900, 10+: Rs. 1,800 unless modified by admin
    // If settings has tiers, we use them.
    
    // Apply final price to all items
    verifiedItems.forEach(item => {
      item.price = ratePerPiece;
    });

    const subtotal = totalPieces * ratePerPiece;

    // Apply shipping rules
    let shippingCost = settings.flatShippingFee;
    if (subtotal >= settings.freeShippingThreshold || totalPieces === 0) {
      shippingCost = 0;
    }

    const finalTotal = subtotal + shippingCost;
    const standardPiecesTotal = totalPieces * 2000;
    const savings = Math.max(0, standardPiecesTotal - subtotal);

    // Dynamic warning or success progress levels
    let nextTierMessage = '';
    let hasUnlockedBest = false;

    // Build progress indicator
    if (totalPieces > 0) {
      const nextTiers = [...settings.tiers].sort((a,b) => a.minQty - b.minQty);
      const activeTierIdx = nextTiers.findIndex(t => 
        totalPieces >= t.minQty && (t.maxQty === null || totalPieces <= t.maxQty)
      );

      if (activeTierIdx !== -1) {
        const nextTier = nextTiers[activeTierIdx + 1];
        if (nextTier) {
          const needed = nextTier.minQty - totalPieces;
          nextTierMessage = `Add ${needed} more piece${needed > 1 ? 's' : ''} to unlock Rs. ${nextTier.rate.toLocaleString()} per piece.`;
        } else {
          nextTierMessage = `Best wholesale price unlocked: Rs. ${ratePerPiece.toLocaleString()} per piece.`;
          hasUnlockedBest = true;
        }
      } else {
        // Fallback progress message based on standard tiers
        if (totalPieces < 5) {
          nextTierMessage = `Add ${5 - totalPieces} more pieces to unlock Rs. 1,900 per piece.`;
        } else if (totalPieces < 10) {
          nextTierMessage = `Add ${10 - totalPieces} more pieces to unlock the best price of Rs. 1,800 per piece.`;
        } else {
          nextTierMessage = 'Best wholesale price unlocked: Rs. 1,800 per piece.';
          hasUnlockedBest = true;
        }
      }
    }

    res.json({
      items: verifiedItems,
      totalPieces,
      ratePerPiece,
      subtotal,
      shippingCost,
      finalTotal,
      savings,
      nextTierMessage,
      hasUnlockedBest
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Securely place an order
app.post('/api/orders/place', (req, res) => {
  try {
    const {
      customerName,
      customerMobile,
      customerWhatsApp,
      customerEmail,
      province,
      city,
      address,
      landmark,
      notes,
      items,
      paymentMethod,
      paymentScreenshot
    } = req.body;

    if (!customerName || !customerMobile || !customerWhatsApp || !province || !city || !address || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Missing customer details or cart items.' });
      return;
    }

    const db = getDatabase();

    // 1. Re-calculate entire pricing independently on the server (Anti-Tempering/Anti-Manipulating)
    const verifiedItems: OrderItem[] = [];
    let totalPieces = 0;

    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId && !p.hidden);
      if (!product) {
        res.status(400).json({ error: `Product not found or hidden: ${item.productName}` });
        return;
      }

      const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
      if (!variant) {
        res.status(400).json({ error: `Variant size custom combo ${item.size} / ${item.color} not found for product ${product.title}` });
        return;
      }

      // Check stock
      if (variant.stock < item.quantity) {
        res.status(400).json({ error: `Insufficient stock for ${product.title} - Size ${item.size} in color ${item.color}. Only ${variant.stock} left.` });
        return;
      }

      verifiedItems.push({
        productId: product.id,
        productName: product.title,
        brandName: product.brandName,
        code: product.code,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: 2000, // Will update below
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : undefined
      });

      totalPieces += item.quantity;
    }

    // Rate calculations
    let ratePerPiece = 2000;
    const settings = db.settings;
    for (const tier of settings.tiers) {
      if (totalPieces >= tier.minQty) {
        if (tier.maxQty === null || totalPieces <= tier.maxQty) {
          ratePerPiece = tier.rate;
        }
      }
    }

    verifiedItems.forEach(item => {
      item.price = ratePerPiece;
    });

    const subtotal = totalPieces * ratePerPiece;
    let shippingCost = settings.flatShippingFee;
    if (subtotal >= settings.freeShippingThreshold) {
      shippingCost = 0;
    }
    const finalTotal = subtotal + shippingCost;

    // 2. Reduce variant inventory stocks automatically
    for (const item of verifiedItems) {
      const product = db.products.find(p => p.id === item.productId);
      if (product) {
        const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
        if (variant) {
          variant.stock -= item.quantity;
        }
      }
    }

    // 3. Generate unique order ID
    const nextCounter = db.orders.length + 10001;
    const orderId = `ZARI-${nextCounter}`;

    const newOrder: Order = {
      id: orderId,
      orderDate: new Date().toISOString(),
      customerName,
      customerMobile,
      customerWhatsApp,
      customerEmail: customerEmail || '',
      province,
      city,
      address,
      landmark: landmark || '',
      notes: notes || '',
      items: verifiedItems,
      totalItems: totalPieces,
      ratePerPiece,
      subtotal,
      shippingCost,
      finalTotal,
      paymentMethod,
      paymentScreenshot: paymentScreenshot || undefined,
      status: paymentMethod === 'COD' ? 'Confirmed' : 'Payment Pending'
    };

    db.orders.unshift(newOrder); // Add to head
    saveDatabase();

    res.json({ success: true, order: newOrder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check order status securely (anonymous tracking / guest lookup)
app.get('/api/orders/track/:id', (req, res) => {
  const db = getDatabase();
  const order = db.orders.find(o => o.id === req.params.id);
  
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
  } else {
    // Return tracking information
    res.json({
      id: order.id,
      orderDate: order.orderDate,
      customerName: order.customerName,
      items: order.items,
      totalItems: order.totalItems,
      ratePerPiece: order.ratePerPiece,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      finalTotal: order.finalTotal,
      paymentMethod: order.paymentMethod,
      status: order.status
    });
  }
});


// ----------------------------------------------------
// SECURE ADMIN CONTROL ENDPOINTS
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_SECRET) {
    res.json({ success: true, token: ADMIN_SECRET });
  } else {
    res.status(401).json({ error: 'Invalid password credential' });
  }
});

// Admin view entire database
app.get('/api/admin/db', authenticateAdmin, (req, res) => {
  res.json(getDatabase());
});

// Admin brands endpoints
app.post('/api/admin/brands', authenticateAdmin, (req, res) => {
  const { name, description, logoUrl } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Brand name required' });
    return;
  }
  const db = getDatabase();
  const rawId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const id = `b-${rawId}-${Date.now().toString().slice(-4)}`;

  const newBrand = { id, name, description: description || '', logoUrl, hidden: false };
  db.brands.push(newBrand);
  saveDatabase();
  res.json({ success: true, brand: newBrand });
});

app.put('/api/admin/brands/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const brand = db.brands.find(b => b.id === req.params.id);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const { name, description, logoUrl, hidden } = req.body;
  
  if (name !== undefined) brand.name = name;
  if (description !== undefined) brand.description = description;
  if (logoUrl !== undefined) brand.logoUrl = logoUrl;
  if (hidden !== undefined) brand.hidden = !!hidden;

  saveDatabase();
  res.json({ success: true, brand });
});

app.delete('/api/admin/brands/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const brandIdx = db.brands.findIndex(b => b.id === req.params.id);
  if (brandIdx === -1) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  // Soft toggle or complete delete? Let's soft delete (hide) to avoid catalog breaking
  db.brands[brandIdx].hidden = true;
  saveDatabase();
  res.json({ success: true, message: 'Brand hidden successfully' });
});

// Categories Endpoints
app.post('/api/admin/categories', authenticateAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Category name required' });
    return;
  }
  const db = getDatabase();
  const id = `c-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
  const newCat = { id, name };
  db.categories.push(newCat);
  saveDatabase();
  res.json({ success: true, category: newCat });
});

app.put('/api/admin/categories/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const cat = db.categories.find(c => c.id === req.params.id);
  if (!cat) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  const { name } = req.body;
  if (name !== undefined) cat.name = name;
  saveDatabase();
  res.json({ success: true, category: cat });
});

app.delete('/api/admin/categories/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  db.categories.splice(idx, 1);
  saveDatabase();
  res.json({ success: true, message: 'Category removed' });
});

// Products Admin Endpoints
app.post('/api/admin/products', authenticateAdmin, (req, res) => {
  const {
    brandId,
    categoryId,
    title,
    code,
    fabric,
    pieces,
    description,
    careInstructions,
    images,
    featured,
    newArrival,
    variants
  } = req.body;

  if (!brandId || !categoryId || !title || !code || !variants || !Array.isArray(variants)) {
    res.status(400).json({ error: 'Missing required product parameters' });
    return;
  }

  const db = getDatabase();
  const brand = db.brands.find(b => b.id === brandId);
  const brandName = brand ? brand.name : 'Unknown Brand';

  const newProduct: Product = {
    id: `p-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
    brandId,
    brandName,
    categoryId,
    title,
    code,
    fabric: fabric || 'Premium Cotton',
    pieces: pieces || '3-Piece',
    description: description || '',
    careInstructions: careInstructions || '',
    images: images || ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
    featured: !!featured,
    newArrival: !!newArrival,
    hidden: false,
    variants: variants.map(v => ({
      size: v.size || 'Medium',
      color: v.color || 'Standard',
      stock: Number(v.stock) || 0
    }))
  };

  db.products.push(newProduct);
  saveDatabase();
  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const {
    brandId,
    categoryId,
    title,
    code,
    fabric,
    pieces,
    description,
    careInstructions,
    images,
    featured,
    newArrival,
    hidden,
    variants
  } = req.body;

  if (brandId !== undefined) {
    product.brandId = brandId;
    const b = db.brands.find(x => x.id === brandId);
    if (b) product.brandName = b.name;
  }
  if (categoryId !== undefined) product.categoryId = categoryId;
  if (title !== undefined) product.title = title;
  if (code !== undefined) product.code = code;
  if (fabric !== undefined) product.fabric = fabric;
  if (pieces !== undefined) product.pieces = pieces;
  if (description !== undefined) product.description = description;
  if (careInstructions !== undefined) product.careInstructions = careInstructions;
  if (images !== undefined) product.images = images;
  if (featured !== undefined) product.featured = !!featured;
  if (newArrival !== undefined) product.newArrival = !!newArrival;
  if (hidden !== undefined) product.hidden = !!hidden;
  if (variants !== undefined && Array.isArray(variants)) {
    product.variants = variants.map(v => ({
      size: v.size || 'Medium',
      color: v.color || 'Standard',
      stock: Number(v.stock) || 0
    }));
  }

  saveDatabase();
  res.json({ success: true, product });
});

app.delete('/api/admin/products/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  // Soft delete (hide) to avoid order history crashes
  db.products[idx].hidden = true;
  saveDatabase();
  res.json({ success: true, message: 'Product hidden/archived successfully' });
});

// Update global store settings, tiers, accounts, flat fees
app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const { whatsappNumber, instagramUrl, facebookUrl, flatShippingFee, freeShippingThreshold, shippingTimeEstimate, codAvailable, paymentAccounts, tiers, pages } = req.body;

  if (whatsappNumber !== undefined) db.settings.whatsappNumber = whatsappNumber;
  if (instagramUrl !== undefined) db.settings.instagramUrl = instagramUrl;
  if (facebookUrl !== undefined) db.settings.facebookUrl = facebookUrl;
  if (flatShippingFee !== undefined) db.settings.flatShippingFee = Number(flatShippingFee);
  if (freeShippingThreshold !== undefined) db.settings.freeShippingThreshold = Number(freeShippingThreshold);
  if (shippingTimeEstimate !== undefined) db.settings.shippingTimeEstimate = shippingTimeEstimate;
  if (codAvailable !== undefined) db.settings.codAvailable = !!codAvailable;
  if (paymentAccounts !== undefined && Array.isArray(paymentAccounts)) db.settings.paymentAccounts = paymentAccounts;
  if (tiers !== undefined && Array.isArray(tiers)) {
    db.settings.tiers = tiers.map(t => ({
      id: t.id || `t-${Math.random().toString(36).slice(2, 6)}`,
      name: t.name || 'Tier',
      minQty: Number(t.minQty),
      maxQty: t.maxQty !== null && t.maxQty !== undefined && t.maxQty !== '' ? Number(t.maxQty) : null,
      rate: Number(t.rate)
    }));
  }
  if (pages !== undefined) {
    db.settings.pages = {
      ...db.settings.pages,
      ...pages
    };
  }

  saveDatabase();
  res.json({ success: true, settings: db.settings });
});

// Update order status or details
app.put('/api/admin/orders/:id', authenticateAdmin, (req, res) => {
  const db = getDatabase();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const { status, refundStock } = req.body;
  if (status !== undefined) {
    const priorStatus = order.status;
    order.status = status;

    // Refund Stock if cancelled / returned and not already marked as stock refunded
    if (refundStock && (status === 'Cancelled' || status === 'Returned') && priorStatus !== 'Cancelled' && priorStatus !== 'Returned') {
      for (const item of order.items) {
        const prod = db.products.find(p => p.id === item.productId);
        if (prod) {
          const variant = prod.variants.find(v => v.size === item.size && v.color === item.color);
          if (variant) {
            variant.stock += item.quantity;
          }
        }
      }
    }
  }

  saveDatabase();
  res.json({ success: true, order });
});


// ----------------------------------------------------
// BOOTSTRAP VITE & CLIENT ROUTING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server executing successfully on port ${PORT}`);
  });
}

startServer();
