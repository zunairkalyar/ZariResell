import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  HelpCircle, 
  PhoneCall, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  MessageCircle, 
  Clock, 
  Truck, 
  CreditCard, 
  Filter, 
  Heart, 
  Share2, 
  ArrowLeft,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AdminPanel from './components/AdminPanel';
import { Brand, Category, Product, Order, StoreSettings, OrderItem } from './types';
import { sortAndFilterProducts, recordProductView, getViewHistory, ProductViewInfo } from './utils/personalization';
import { DEFAULT_BRANDS, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from './utils/clientDb';

export default function App() {
  // Global Database State
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Personalization view history state
  const [viewHistory, setViewHistory] = useState<ProductViewInfo[]>([]);

  // Navigation & User views
  const [currentView, setView] = useState<string>('home'); // 'home' | 'shop' | 'brand-catalog' | 'product-detail' | 'checkout' | 'order-confirmation' | 'admin' | 'policy'
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activePolicyKey, setActivePolicyKey] = useState<string>('shipPolicy');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('');
  const [selectedPieceFilter, setSelectedPieceFilter] = useState<string>(''); // '3-Piece', '2-Piece', 'Kurti'
  const [onlyInStockFilter, setOnlyInStockFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest'); // 'newest' | 'brand' | 'popular' | 'instock' | 'lowstock'

  // Shopping Cart client State
  const [cart, setCart] = useState<{ productId: string; size: string; color: string; quantity: number }[]>([]);
  
  // Quick Add sheet state
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickAddSize, setQuickAddSize] = useState<string>('');
  const [quickAddColor, setQuickAddColor] = useState<string>('');
  const [quickAddQty, setQuickAddQty] = useState<number>(1);
  const [quickAddError, setQuickAddError] = useState<string>('');
  
  // Server-computed cart details (Secure pricing source)
  const [serverCartDetails, setServerCartDetails] = useState<{
    items: OrderItem[];
    totalPieces: number;
    ratePerPiece: number;
    subtotal: number;
    shippingCost: number;
    finalTotal: number;
    savings: number;
    nextTierMessage: string;
    hasUnlockedBest: boolean;
  }>({
    items: [],
    totalPieces: 0,
    ratePerPiece: 2000,
    subtotal: 0,
    shippingCost: 0,
    finalTotal: 0,
    savings: 0,
    nextTierMessage: '',
    hasUnlockedBest: false
  });

  // Sidebar controls
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  
  // Bookmark Favourites
  const [favourites, setFavourites] = useState<string[]>([]);
  
  // Interactive Product Gallery
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [detailSelectedSize, setDetailSelectedSize] = useState<string>('');
  const [detailSelectedColor, setDetailSelectedColor] = useState<string>('');
  const [detailQty, setDetailQty] = useState<number>(1);
  const [detailError, setDetailError] = useState<string>('');

  // Checkout inputs state
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custWhatsApp, setCustWhatsApp] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custProvince, setCustProvince] = useState('Punjab');
  const [custCity, setCustCity] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custLandmark, setCustLandmark] = useState('');
  const [custNotes, setCustNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [paymentScreenshotFile, setPaymentScreenshotFile] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState('');
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Administrative Workspace credentials token
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Fetch complete dataset from the relative backend server routing API
  const refreshStoreData = () => {
    fetch('/api/store-data')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBrands(data.brands || DEFAULT_BRANDS);
        setCategories(data.categories || DEFAULT_CATEGORIES);
        setProducts(data.products || DEFAULT_PRODUCTS);
        setSettings(data.settings || DEFAULT_SETTINGS);
        
        // Load secure admin-only view if already logged in prior
        if (adminToken) {
          fetch('/api/admin/db', { headers: { 'x-admin-token': adminToken } })
            .then(res => res.json())
            .then(adminData => {
              setOrders(adminData.orders || []);
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        console.warn('Backend server not responding, using fully-functional client-side fallback database (perfect for static/Vercel environments): ', err);
        setBrands(DEFAULT_BRANDS);
        setCategories(DEFAULT_CATEGORIES);
        setProducts(DEFAULT_PRODUCTS);
        setSettings(DEFAULT_SETTINGS);
      });
  };

  // Run initial boot fetch
  useEffect(() => {
    refreshStoreData();
    // Load local storage favourites and cards
    try {
      const savedFavs = localStorage.getItem('zari_favs');
      if (savedFavs) setFavourites(JSON.parse(savedFavs));
      const savedCart = localStorage.getItem('zari_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedHistory = getViewHistory();
      setViewHistory(savedHistory);
    } catch (_) {}
  }, []);

  // Sync admin database if login toggled or done
  useEffect(() => {
    if (adminToken) {
      fetch('/api/admin/db', { headers: { 'x-admin-token': adminToken } })
        .then(res => res.json())
        .then(adminData => {
          setOrders(adminData.orders);
        });
    }
  }, [adminToken]);

  // Default sorting selection based on personalization configuration
  useEffect(() => {
    if (settings?.personalizationEnabled) {
      setSortBy('recommended');
    } else {
      setSortBy('newest');
    }
  }, [settings]);

  // Recalculating Cart dynamically from our secure backend (Anti-Manipulate rates)
  useEffect(() => {
    // Write local storage backup
    localStorage.setItem('zari_cart', JSON.stringify(cart));

    if (cart.length === 0) {
      setServerCartDetails({
        items: [],
        totalPieces: 0,
        ratePerPiece: 2000,
        subtotal: 0,
        shippingCost: 0,
        finalTotal: 0,
        savings: 0,
        nextTierMessage: 'Mix Any Items to unlock better prices!',
        hasUnlockedBest: false
      });
      return;
    }

    fetch('/api/cart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          console.error('Server calculation error: ', data.error);
        } else {
          setServerCartDetails(data);
        }
      })
      .catch(err => {
        console.warn('Backend server not responding, calculating prices client-side (perfect for static/Vercel environments): ', err);
        const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
        let ratePerPiece = 2000;
        let nextTierMessage = '';
        let hasUnlockedBest = false;
        if (totalPieces >= 10) {
          ratePerPiece = 1800;
          nextTierMessage = 'Best wholesale price unlocked!';
          hasUnlockedBest = true;
        } else if (totalPieces >= 5) {
          ratePerPiece = 1900;
          nextTierMessage = `Add ${10 - totalPieces} more pieces to unlock the best price of Rs. 1,800/ea!`;
        } else {
          ratePerPiece = 2000;
          nextTierMessage = `Add ${5 - totalPieces} more pieces to unlock Rs. 1,900/ea!`;
        }

        const itemsDetails = cart.map(item => {
          const matchedProd = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            productName: matchedProd?.title || 'Clothing Article',
            brandName: matchedProd?.brandName || 'Multi-Brand',
            code: matchedProd?.code || 'SKU',
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: ratePerPiece,
            imageUrl: matchedProd?.images[0] || ''
          };
        });

        const subtotal = totalPieces * ratePerPiece;
        const flatFee = settings?.flatShippingFee ?? 250;
        const threshold = settings?.freeShippingThreshold ?? 5000;
        const shippingCost = (subtotal >= threshold || totalPieces === 0) ? 0 : flatFee;
        const finalTotal = subtotal + shippingCost;
        const savings = totalPieces * (2000 - ratePerPiece);

        setServerCartDetails({
          items: itemsDetails,
          totalPieces,
          ratePerPiece,
          subtotal,
          shippingCost,
          finalTotal,
          savings,
          nextTierMessage,
          hasUnlockedBest
        });
      });
  }, [cart]);

  // General navigation selector wrapper
  const handleSetView = (view: string, id?: string) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'brand-catalog' && id) {
      setSelectedBrandId(id);
    }
    if (view === 'policy' && id) {
      setActivePolicyKey(id);
    }
  };

  // Cart Management functions
  const handleAddToCart = (productId: string, size: string, color: string, quantity: number) => {
    const existingIdx = cart.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    );

    if (existingIdx !== -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { productId, size, color, quantity }]);
    }
    setCartOpen(true);
  };

  const handleUpdateQty = (productId: string, size: string, color: string, delta: number) => {
    const existingIdx = cart.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    );
    if (existingIdx === -1) return;

    const updated = [...cart];
    const nextQty = updated[existingIdx].quantity + delta;

    if (nextQty <= 0) {
      updated.splice(existingIdx, 1);
    } else {
      updated[existingIdx].quantity = nextQty;
    }
    setCart(updated);
  };

  const handleRemoveItem = (productId: string, size: string, color: string) => {
    setCart(cart.filter(item => !(item.productId === productId && item.size === size && item.color === color)));
  };

  // Toggle Bookmark Favourite items
  const handleToggleFav = (prodId: string) => {
    let updated: string[] = [];
    if (favourites.includes(prodId)) {
      updated = favourites.filter(id => id !== prodId);
    } else {
      updated = [...favourites, prodId];
    }
    setFavourites(updated);
    localStorage.setItem('zari_favs', JSON.stringify(updated));
  };

  // Client order checkout triggers
  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custMobile || !custWhatsApp || !custCity || !custAddress) {
      setCheckoutError('Please provide all mandatory shipping contact fields!');
      return;
    }

    setOrderProcessing(true);
    setCheckoutError('');

    const itemsPayload = cart.map(item => ({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity
    }));

    fetch('/api/orders/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: custName,
        customerMobile: custMobile,
        customerWhatsApp: custWhatsApp,
        customerEmail: custEmail,
        province: custProvince,
        city: custCity,
        address: custAddress,
        landmark: custLandmark,
        notes: custNotes,
        items: itemsPayload,
        paymentMethod: selectedPayment,
        paymentScreenshot: paymentScreenshotFile || undefined
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setOrderProcessing(false);
        if (data.error) {
          setCheckoutError(data.error);
        } else {
          // Success checkout
          setLastPlacedOrder(data.order);
          setCart([]); // Clear cart
          setView('order-confirmation');
          refreshStoreData(); // Refresh warehouse stock variables
          
          // Clear inputs
          setCustName('');
          setCustMobile('');
          setCustWhatsApp('');
          setCustEmail('');
          setCustNotes('');
          setCustAddress('');
          setCustCity('');
          setCustLandmark('');
          setPaymentScreenshotFile('');
        }
      })
      .catch(err => {
        console.warn('Backend server not responding, completing order in sandbox-demo mode client-side: ', err);
        
        // Generate high fidelity client virtual order
        const virtualOrderId = `ZARI-${Math.floor(10000 + Math.random() * 90000)}`;
        const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
        const ratePerPiece = totalPieces >= 10 ? 1800 : (totalPieces >= 5 ? 1900 : 2000);
        const subtotal = totalPieces * ratePerPiece;
        const threshold = settings?.freeShippingThreshold ?? 5000;
        const shippingCost = subtotal >= threshold ? 0 : (settings?.flatShippingFee ?? 250);
        const finalTotal = subtotal + shippingCost;

        const virtualOrderItems = cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            productName: product?.title || 'Clothing Article',
            brandName: product?.brandName || 'Multi-Brand',
            code: product?.code || 'SKU',
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: ratePerPiece,
            imageUrl: product?.images[0] || ''
          };
        });

        const virtualOrder = {
          id: virtualOrderId,
          orderDate: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
          customerName: custName,
          customerMobile: custMobile,
          customerWhatsApp: custWhatsApp,
          customerEmail: custEmail || undefined,
          province: custProvince,
          city: custCity,
          address: custAddress,
          landmark: custLandmark || undefined,
          notes: custNotes || undefined,
          items: virtualOrderItems,
          totalItems: totalPieces,
          ratePerPiece: ratePerPiece,
          subtotal: subtotal,
          shippingCost: shippingCost,
          finalTotal: finalTotal,
          paymentMethod: selectedPayment,
          paymentScreenshot: paymentScreenshotFile || undefined,
          status: 'Pending' as const
        };

        setLastPlacedOrder(virtualOrder);
        setCart([]); // Clear cart
        setView('order-confirmation');
        
        // Clear inputs
        setCustName('');
        setCustMobile('');
        setCustWhatsApp('');
        setCustEmail('');
        setCustNotes('');
        setCustAddress('');
        setCustCity('');
        setCustLandmark('');
        setPaymentScreenshotFile('');
        setOrderProcessing(false);
      });
  };

  // Admin handlers proxying to API endpoints
  const handleSettingsUpdate = (newSettingsFields: Partial<StoreSettings>) => {
    if (!adminToken) return;
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify(newSettingsFields)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshStoreData();
        } else {
          alert('Failed to update config: ' + data.error);
        }
      });
  };

  const handleBrandCreated = (name: string, description: string) => {
    if (!adminToken) return;
    fetch('/api/admin/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ name, description })
    })
      .then(res => res.json())
      .then(() => refreshStoreData());
  };

  const handleCategoryCreated = (name: string) => {
    if (!adminToken) return;
    fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(() => refreshStoreData());
  };

  const handleProductCreated = (productData: any) => {
    if (!adminToken) return;
    fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify(productData)
    })
      .then(res => res.json())
      .then(() => refreshStoreData());
  };

  const handleProductUpdated = (productId: string, updatedFields: any) => {
    if (!adminToken) return;
    fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify(updatedFields)
    })
      .then(res => res.json())
      .then(() => refreshStoreData());
  };

  const handleOrderStatusUpdated = (orderId: string, newStatus: string, refundStock: boolean) => {
    if (!adminToken) return;
    fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ status: newStatus, refundStock })
    })
      .then(res => res.json())
      .then(() => refreshStoreData());
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentScreenshotFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Inspect detailed item page and prepare fresh selection parameters
  const handleInspectProductDetail = (p: Product) => {
    setSelectedProduct(p);
    setActiveImgIdx(0);
    setDetailSelectedSize(p.variants[0]?.size || '');
    setDetailSelectedColor(p.variants[0]?.color || '');
    setDetailQty(1);
    setDetailError('');
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Record product view for personalization
    const updatedHistory = recordProductView(p.id, settings?.maxViewHistorySize || 20);
    setViewHistory(updatedHistory);
  };

  // Filters catalog logic
  const filteredProducts = products.filter(p => {
    // 1. Search Query mapping
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(sq);
      const matchBrand = p.brandName.toLowerCase().includes(sq);
      const matchCode = p.code.toLowerCase().includes(sq);
      const matchFabric = p.fabric.toLowerCase().includes(sq);
      
      const matchVariant = p.variants.some(
        v => v.size.toLowerCase().includes(sq) || v.color.toLowerCase().includes(sq)
      );

      if (!matchTitle && !matchBrand && !matchCode && !matchFabric && !matchVariant) {
        return false;
      }
    }

    // 2. Tab limits
    if (currentView === 'brand-catalog' && p.brandId !== selectedBrandId) {
      return false;
    }

    // 3. Category Filter
    if (selectedCategoryFilter && p.categoryId !== selectedCategoryFilter) {
      return false;
    }

    // 4. Side Brand filter (if not in brand-catalog tab already)
    if (currentView !== 'brand-catalog' && selectedBrandFilter && p.brandId !== selectedBrandFilter) {
      return false;
    }

    // 5. Size Filter
    if (selectedSizeFilter && !p.variants.some(v => v.size === selectedSizeFilter && v.stock > 0)) {
      return false;
    }

    // 6. Pieces filter
    if (selectedPieceFilter && p.pieces !== selectedPieceFilter) {
      return false;
    }

    // 7. Stock availability toggle
    if (onlyInStockFilter) {
      const totalStock = p.variants.reduce((a, b) => a + b.stock, 0);
      if (totalStock <= 0) return false;
    }

    return true;
  });

  // Sorting & Personalization logics
  const sortedProducts = sortAndFilterProducts(
    filteredProducts,
    viewHistory,
    {
      personalizationEnabled: settings?.personalizationEnabled ?? true,
      viewHistoryDays: settings?.viewHistoryDays ?? 30,
      outOfStockDisplay: settings?.outOfStockDisplay ?? 'bottom',
      cartProductIds: cart.map(c => c.productId),
      wishlistProductIds: [] // No separate wishlist array, can feed standard lists
    },
    sortBy
  );

  // Safe checks
  if (!settings) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] font-sans">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#800020] border-t-transparent mx-auto" />
          <h2 className="text-lg font-bold text-stone-800">Booting Zari Resell Cloud Node...</h2>
          <p className="text-xs text-stone-400">Verifying pricing schemas & catalog packages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1F1F] flex flex-col font-sans selection:bg-[#800020]/25 selection:text-stone-900">
      
      {/* Dynamic Navbar */}
      <Navbar
        brands={brands}
        categories={categories}
        cartCount={serverCartDetails.totalPieces}
        cartRate={serverCartDetails.ratePerPiece}
        currentView={currentView}
        setView={handleSetView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCartClick={() => setCartOpen(true)}
        products={products}
        onInspectProduct={handleInspectProductDetail}
      />

      {/* Cart Drawer */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={serverCartDetails.items}
        totalPieces={serverCartDetails.totalPieces}
        ratePerPiece={serverCartDetails.ratePerPiece}
        subtotal={serverCartDetails.subtotal}
        shippingCost={serverCartDetails.shippingCost}
        finalTotal={serverCartDetails.finalTotal}
        savings={serverCartDetails.savings}
        nextTierMessage={serverCartDetails.nextTierMessage}
        hasUnlockedBest={serverCartDetails.hasUnlockedBest}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={() => { setCartOpen(false); handleSetView('checkout'); }}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* VIEW CONDITIONAL LOGIC */}
      <main className="flex-grow">
        
        {/* ===================== HOMEPAGE VIEW ===================== */}
        {currentView === 'home' && (
          <div className="space-y-16 pb-16 animate-fade-in">
            {/* Elegant Hero billboard */}
            <Hero
              tiers={settings.tiers}
              onShopClick={() => handleSetView('shop')}
              onBrandsClick={() => {
                const el = document.getElementById('shop-by-brand-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onHowItWorksClick={() => handleSetView('policy', 'aboutUs')}
            />

            {/* Shop by Brand Section */}
            <section id="shop-by-brand-grid" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-10">
                <h2 className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">Shop By Premium Designer Brand</h2>
                <p className="max-w-xl mx-auto text-sm text-stone-500 font-sans">
                  We collect, inspect & warehouse genuine designer sets from leading Pakistani labels. Select, mix & checkout in standard cartons.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {brands.map(brand => (
                  <div
                    key={brand.id}
                    onClick={() => handleSetView('brand-catalog', brand.id)}
                    className="group border border-stone-200 rounded-xl bg-white p-5 text-center flex flex-col items-center justify-between shadow-xs hover:shadow-md hover:border-[#800020]/25 transition-all cursor-pointer"
                  >
                    <div className="rounded-full bg-stone-100 flex items-center justify-center p-3 text-stone-700 font-serif font-extrabold text-lg group-hover:bg-[#800020] group-hover:text-white transition-all w-14 h-14 select-none mb-3">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-stone-900 group-hover:text-[#800020] transition-colors">{brand.name}</h3>
                      <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">{brand.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How Pricing Works Interactive Section */}
            <section className="bg-stone-900 text-[#FAF9F6] py-16 scroll-mt-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-2 mb-12">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#800020]/25 bg-white/10 px-3 py-1 rounded font-extrabold leading-none">Automatic Carton Pricing</span>
                  <h2 className="font-serif text-3xl font-bold tracking-tight">How Mixing Saves Money</h2>
                  <p className="max-w-lg mx-auto text-xs text-stone-400">
                    Your final invoice rate is calculated based on total pieces count in your checkout order, and is decoupled from standard retail tags.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#800020] flex items-center justify-center text-lg font-bold font-serif shadow-lg">1</div>
                    <h3 className="font-serif text-lg font-bold">Choose Any Articles</h3>
                    <p className="text-sm text-stone-300">Mix products and unstitched suits from Sapphire, Khaadi, Limelight, or J. simultaneously.</p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#800020] flex items-center justify-center text-lg font-bold font-serif shadow-lg">2</div>
                    <h3 className="font-serif text-lg font-bold">Add More Pieces</h3>
                    <p className="text-sm text-stone-300">Your wholesale rate per piece declines of every individual item as the carton counts grow.</p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#800020] flex items-center justify-center text-lg font-bold font-serif shadow-lg">3</div>
                    <h3 className="font-serif text-lg font-bold">Save More On Invoice</h3>
                    <p className="text-sm text-stone-300">
                      1–4 items cost Rs. 2,000 each. <br/>
                      5–9 items unlock Rs. 1,900 each.<br/>
                      10+ items unlock Rs. 1,800 wholesale each.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured New Arrivals Section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900">Featured & New Arrivals</h2>
                  <p className="text-xs text-stone-400">Handpicked latest releases from this week's textile collections</p>
                </div>
                <button
                  onClick={() => handleSetView('shop')}
                  className="self-start text-[#800020] text-xs font-bold uppercase tracking-widest hover:underline hover:scale-105 transition-transform"
                >
                  See Full Catalogue →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                {products.slice(0, 4).map(product => (
                  <div key={product.id}>
                    <ProductCard
                      product={product}
                      onProductClick={handleInspectProductDetail}
                      onQuickAdd={(p, s, c) => handleAddToCart(p.id, s, c, 1)}
                      onOpenQuickAddSheet={(p) => {
                        setQuickAddProduct(p);
                        const productSizes = Array.from(new Set(p.variants.map(v => v.size)));
                        const productColors = Array.from(new Set(p.variants.map(v => v.color)));
                        setQuickAddSize(productSizes[0] || '');
                        setQuickAddColor(productColors[0] || '');
                        setQuickAddQty(1);
                        setQuickAddError('');
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Why Shop With Us Section (Genuine operational benefits only) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
              <div className="rounded-2xl border border-stone-250 bg-stone-50 p-8 md:p-12">
                <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
                  <h2 className="font-serif text-2xl font-bold text-stone-900">Reselling Redefined</h2>
                  <p className="text-sm text-stone-500 font-sans">
                    We deliver genuine designer fabrics without the hefty markup, using smart bulk catalog mixing rules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  <div className="space-y-2 font-sans text-xs">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#800020]" />
                      Nationwide Flat COD
                    </h4>
                    <p className="text-stone-500 leading-relaxed">Flat Rs. 250 shipping across Pakistan, or free delivery on checks exceeding Rs. 5,000 threshold.</p>
                  </div>
                  <div className="space-y-2 font-sans text-xs">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#800020]" />
                      Fresh Articles Regularly
                    </h4>
                    <p className="text-stone-500 leading-relaxed">Our reseller procurement network updates inventory directly as soon as brands launch catalogs.</p>
                  </div>
                  <div className="space-y-2 font-sans text-xs">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#800020]" />
                      Upfront & COD Supported
                    </h4>
                    <p className="text-stone-500 leading-relaxed">Settle natively upon delivery, or confirm instantly by providing transfer slips from bank accounts.</p>
                  </div>
                  <div className="space-y-2 font-sans text-xs">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#800020]" />
                      Direct WhatsApp Assistance
                    </h4>
                    <p className="text-stone-500 leading-relaxed">Skip automated bots. Chat directly with original staff guides to clarify unstitched prints details.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* WhatsApp Floating Promo Spot */}
            <section className="mx-auto max-w-4xl px-4 text-center">
              <div className="rounded-xl border-2 border-dashed border-emerald-300 p-6 bg-emerald-50/50">
                <p className="text-sm text-[#1F1F1F] font-medium">
                  Need help selecting articles, checking fabric thickness, or confirming live stocks?
                </p>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors uppercase tracking-wide cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
                  Chat With Active Human Representative On WhatsApp
                </a>
              </div>
            </section>
          </div>
        )}

        {/* ===================== SHOPPING CATALOG VIEW ===================== */}
        {(currentView === 'shop' || currentView === 'brand-catalog') && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            {/* Header info */}
            <div className="mb-8 border-b border-stone-200 pb-5">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-1.5 leading-none">
                <span className="hover:underline cursor-pointer" onClick={() => handleSetView('home')}>Home</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-stone-800">Catalogue</span>
              </div>
              
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-extrabold text-stone-900 leading-tight">
                    {currentView === 'brand-catalog' 
                      ? `${brands.find(b => b.id === selectedBrandId)?.name} Boutique`
                      : 'Reseller Catalog Index'
                    }
                  </h1>
                  <p className="text-xs text-stone-400 mt-1 max-w-xl">
                    {currentView === 'brand-catalog'
                      ? brands.find(b => b.id === selectedBrandId)?.description
                      : 'Showcasing unstitched lawns, luxury cambrics work and festive summer wear. All items leverage core bulk carton discounts simultaneously.'
                    }
                  </p>
                </div>

                {/* Pricing rules summary */}
                <span className="rounded-lg border border-stone-250 bg-stone-100 p-3 text-xs text-[#800020] font-bold">
                  🎯 MIX MIX Tier Pricing: 1-4 Pc Rs. 2,000 | 5-9 ea Rs. 1,900 | 10+ ea Rs. 1,800
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Product Filters bar (Desktop layout) */}
              <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-[#800020]" />
                      Narrow Searches
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCategoryFilter('');
                        setSelectedBrandFilter('');
                        setSelectedSizeFilter('');
                        setSelectedPieceFilter('');
                        setOnlyInStockFilter(false);
                        setSortBy('newest');
                      }}
                      className="text-[10px] uppercase font-mono tracking-wider text-[#800020] font-bold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Brand select if not in brand-catalog tab */}
                  {currentView !== 'brand-catalog' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Designer brand</label>
                      <select
                        value={selectedBrandFilter}
                        onChange={(e) => setSelectedBrandFilter(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020] bg-[#FAF9F6] text-stone-900 font-sans"
                      >
                        <option value="">All Brands combined</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Fabrics collections list */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Fabric Category</label>
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020] bg-[#FAF9F6] text-[#1F1F1F]"
                    >
                      <option value="">All Materials</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sizing filter buttons */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Size Required</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Small', 'Medium', 'Large', 'Standard/XL'].map(sz => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? '' : sz)}
                          className={`rounded px-3 py-1.5 text-xs font-medium font-sans border transition-all ${
                            selectedSizeFilter === sz
                              ? 'bg-[#800020] text-white border-[#800020]'
                              : 'bg-[#FAF9F6] text-stone-700 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pieces configuration */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Pieces Included</label>
                    <div className="flex flex-col gap-1 text-xs">
                      {[
                        { label: '3-Piece Sets', val: '3-Piece' },
                        { label: '2-Piece Sets', val: '2-Piece' },
                        { label: 'Kurtas/Shirts Only', val: 'Kurti' }
                      ].map(item => (
                        <label key={item.val} className="flex items-center gap-2 py-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPieceFilter === item.val}
                            onChange={() => setSelectedPieceFilter(selectedPieceFilter === item.val ? '' : item.val)}
                            className="rounded text-[#800020]"
                          />
                          <span className="text-stone-700 font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* In stock trigger */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Exclude Out of Stock</span>
                    <input
                      type="checkbox"
                      checked={onlyInStockFilter}
                      onChange={(e) => setOnlyInStockFilter(e.target.checked)}
                      className="rounded text-[#800020] focus:ring-[#800020]"
                    />
                  </div>
                </div>

                {/* Quick Info Block */}
                <div className="rounded-xl border border-stone-200 bg-amber-50 p-4 text-xs space-y-2 leading-relaxed text-[#1F1F1F]">
                  <p className="font-bold flex items-center gap-1.5">
                    💡 Reseller Mixing Rules
                  </p>
                  <p>
                    All clothes are identical in price. Add unstitched shirts from one brand, chiffon suites from another, and small kurtas from a third brand. Carton pricing calculates automatically during checkout!
                  </p>
                </div>
              </div>

              {/* Grid block right catalog */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Sorting options header bar */}
                <div className="flex justify-between items-center text-xs text-stone-500 font-sans">
                  <span>Showing <span className="font-bold text-stone-900">{sortedProducts.length}</span> verified articles found</span>
                  
                  <div className="flex items-center gap-2">
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded border border-stone-200 bg-white p-1.5 focus:outline-none"
                    >
                      {settings?.personalizationEnabled && (
                        <option value="recommended">★ Recommended for You</option>
                      )}
                      <option value="newest">New Arrivals</option>
                      <option value="brand">Brand A-Z</option>
                      <option value="popular">Popular Featured</option>
                      {settings?.personalizationEnabled && (
                        <option value="unviewed_first">Unviewed Items First</option>
                      )}
                      <option value="instock">High Stock First</option>
                      <option value="lowstock">Low Stock Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Blank list message */}
                {sortedProducts.length === 0 ? (
                  <div className="rounded-xl border border-stone-200 bg-white py-20 text-center font-sans space-y-4">
                    <ShieldAlert className="mx-auto h-12 w-12 text-stone-300 stroke-1" />
                    <h3 className="font-serif text-lg font-bold text-stone-800">No matching articles in inventory</h3>
                    <p className="text-sm text-stone-400 max-w-sm mx-auto">
                      Try clearing search parameters, removing size filters, or view other premium designer boutiques.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategoryFilter('');
                        setSelectedBrandFilter('');
                        setSelectedSizeFilter('');
                        setSelectedPieceFilter('');
                        setOnlyInStockFilter(false);
                      }}
                      className="rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold uppercase text-white"
                    >
                      Reset Filters Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedProducts.map(product => (
                      <div key={product.id}>
                        <ProductCard
                          product={product}
                          onProductClick={handleInspectProductDetail}
                          onQuickAdd={(p, s, c) => handleAddToCart(p.id, s, c, 1)}
                          onOpenQuickAddSheet={(p) => {
                            setQuickAddProduct(p);
                            const productSizes = Array.from(new Set(p.variants.map(v => v.size)));
                            const productColors = Array.from(new Set(p.variants.map(v => v.color)));
                            setQuickAddSize(productSizes[0] || '');
                            setQuickAddColor(productColors[0] || '');
                            setQuickAddQty(1);
                            setQuickAddError('');
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ===================== PRODUCT DETAIL VIEW ===================== */}
        {currentView === 'product-detail' && selectedProduct && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in font-sans">
            
            {/* Breadcrumb back */}
            <button
              onClick={() => handleSetView('shop')}
              className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-[#800020]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back To Catalog Search</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Product Media Zoom Gallery column */}
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={selectedProduct.images[activeImgIdx] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  {selectedProduct.newArrival && (
                    <span className="absolute top-4 left-4 rounded bg-[#800020] text-[#FAF9F6] text-xs font-bold tracking-wider px-3 py-1">
                      New Release
                    </span>
                  )}
                </div>

                {/* Thumbnail lists switcher */}
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-2">
                    {selectedProduct.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImgIdx(index)}
                        className={`w-16 h-20 rounded-md border-2 overflow-hidden ${
                          activeImgIdx === index ? 'border-[#800020]' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info column details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded bg-stone-900 text-white font-extrabold tracking-widest text-[10px] uppercase px-2.5 py-1">
                      {selectedProduct.brandName}
                    </span>
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider font-mono">
                      SKU: {selectedProduct.code}
                    </span>
                  </div>
                  
                  <h1 className="font-serif text-3xl font-extrabold text-[#1F1F1F] tracking-tight leading-snug">
                    {selectedProduct.title}
                  </h1>
                </div>

                {/* MANDATORY CONSTANT TIERS TABLE */}
                <div className="rounded-xl border border-stone-250 bg-stone-50 p-4 space-y-3">
                  <p className="text-sm font-bold text-[#800020]">
                    Price starts from Rs. 1,800 per piece
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold text-[#1F1F1F] leading-tight text-center">
                    <div className="bg-white rounded-lg p-2.5 border border-stone-200">
                      <span className="block text-[10px] text-stone-500 font-sans tracking-wide mb-1 uppercase font-semibold">1 Piece purchase</span>
                      <span className="text-base text-stone-900 font-extrabold">Rs. 2,000</span>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-stone-200">
                      <span className="block text-[10px] text-stone-500 font-sans tracking-wide mb-1 uppercase font-semibold">5+ mixing Carton</span>
                      <span className="text-base text-[#800020]">Rs. 1,900 ea</span>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-stone-200">
                      <span className="block text-[10px] text-stone-500 font-sans tracking-wide mb-1 uppercase font-semibold">10+ wholesale</span>
                      <span className="text-base text-emerald-800">Rs. 1,800 ea</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-500 italic mt-2 text-center text-stone-600">
                    💡 You can mix this article with any other articles or brands to unlock better dynamic quantity pricing!
                  </p>
                </div>

                {/* Fabric metadata details */}
                <div className="space-y-1.5 text-sm text-stone-700">
                  <p><span className="font-bold text-stone-500 uppercase tracking-widest text-[10px] font-mono mr-2">Fabric:</span> {selectedProduct.fabric}</p>
                  <p><span className="font-bold text-stone-500 uppercase tracking-widest text-[10px] font-mono mr-2">Status:</span> {selectedProduct.pieces} Suits pack</p>
                </div>

                {/* Size select panel */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Select Size:</span>
                  <div className="flex gap-2.5">
                    {Array.from(new Set(selectedProduct.variants.map(v => v.size))).map(size => {
                      const totalStock = selectedProduct.variants
                        .filter(v => v.size === size)
                        .reduce((sum, v) => sum + v.stock, 0);

                      const isSelected = detailSelectedSize === size;
                      
                      return (
                        <button
                          key={size}
                          disabled={totalStock <= 0}
                          onClick={() => { setDetailSelectedSize(size); setDetailError(''); }}
                          className={`rounded-lg px-4 py-2 text-xs font-semibold border font-sans transition-all ${
                            totalStock <= 0
                              ? 'border-dashed border-stone-200 text-stone-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-stone-950 text-white border-stone-950'
                              : 'bg-white text-stone-850 hover:border-[#800020]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color select panel */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Select Colour Variant:</span>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(selectedProduct.variants.map(v => v.color))).map(color => {
                      const isSelected = detailSelectedColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => { setDetailSelectedColor(color); setDetailError(''); }}
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-[#FAF9F6] text-stone-800'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Adjustment selector & stock checkers */}
                {detailSelectedSize && detailSelectedColor && (
                  <div className="flex items-center justify-get mb-1 text-xs font-bold">
                    {(() => {
                      const v = selectedProduct.variants.find(
                        x => x.size === detailSelectedSize && x.color === detailSelectedColor
                      );
                      if (!v || v.stock === 0) {
                        return <span className="text-red-600">❌ Out of Stock combo variant matches</span>;
                      }
                      if (v.stock <= 3) {
                        return <span className="text-amber-700">⚠️ Only {v.stock} pieces remaining in stack!</span>;
                      }
                      return <span className="text-emerald-700">✓ In stock ({v.stock} pieces allocated)</span>;
                    })()}
                  </div>
                )}

                {/* Main buttons triggers */}
                {detailError && (
                  <p className="text-xs font-bold text-red-600 font-sans">
                    {detailError}
                  </p>
                )}

                <div className="flex gap-4 pt-4 border-t border-stone-200">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-300 rounded bg-white font-mono">
                    <button
                      onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                      className="p-2 px-3 text-stone-600 hover:bg-stone-50"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-semibold text-stone-900">
                      {detailQty}
                    </span>
                    <button
                      onClick={() => setDetailQty(detailQty + 1)}
                      className="p-2 px-3 text-stone-600 hover:bg-stone-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={() => {
                      if (!detailSelectedSize) {
                        setDetailError('Please select size first!');
                        return;
                      }
                      const activeV = selectedProduct.variants.find(
                        x => x.size === detailSelectedSize && x.color === detailSelectedColor
                      );
                      if (!activeV || activeV.stock < detailQty) {
                        setDetailError(`Insufficient quantity available. Only ${activeV ? activeV.stock : 0} items in stock.`);
                        return;
                      }
                      handleAddToCart(selectedProduct.id, detailSelectedSize, detailSelectedColor, detailQty);
                      setDetailError('');
                    }}
                    className="flex-1 rounded-full bg-[#800020] py-3 text-xs font-bold uppercase tracking-wider text-[#FAF9F6] shadow-md hover:bg-[#600018] select-none cursor-pointer"
                  >
                    Add Mixed Cart pieces
                  </button>
                </div>

                {/* Instant inquiry WhatsApp button */}
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(
                    `Hello Zari Resell, I am looking for the availability of \nArticle: *${selectedProduct.title}* (${selectedProduct.code}) \nSize: *${detailSelectedSize}* \nColor: *${detailSelectedColor}* \n\nIs this in stock?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 fill-emerald-600 text-white" />
                  Ask Stock Availability on WhatsApp
                </a>

                {/* Product spec block foldout */}
                <div className="space-y-4 pt-6 border-t border-stone-200">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <h3 className="font-bold text-stone-900 font-sans uppercase tracking-widest text-[10px]">Product Details</h3>
                    <p className="leading-relaxed">{selectedProduct.description}</p>
                  </div>
                  {selectedProduct.careInstructions && (
                    <div className="space-y-1.5 text-xs text-stone-600">
                      <h3 className="font-bold text-stone-900 font-sans uppercase tracking-widest text-[10px]">Care Instructions</h3>
                      <p className="leading-relaxed italic">{selectedProduct.careInstructions}</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ===================== CHECKOUT FORM VIEW ===================== */}
        {currentView === 'checkout' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans animate-fade-in">
            <h1 className="font-serif text-3xl font-extrabold text-stone-900 mb-2">Complete Shipping Details</h1>
            <p className="text-xs text-stone-500 mb-8 max-w-lg leading-relaxed">
              Kindly submit correct dispatch details. There is no password required to buy. We will review mixed carton limits and coordinate parcel delivery nationwide.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Shipping Inputs Form box */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-xs self-start">
                <form onSubmit={handlePlaceOrderSubmit} className="space-y-4 text-xs font-semibold text-stone-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">Full Shipping Recipient Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Amber Mehmood"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">Mobile Number (Delivery) *</label>
                      <input
                        type="tel"
                        placeholder="e.g. 03001234567"
                        value={custMobile}
                        onChange={(e) => setCustMobile(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">WhatsApp Number (For Order Tracking) *</label>
                      <input
                        type="tel"
                        placeholder="e.g. 03001234567"
                        value={custWhatsApp}
                        onChange={(e) => setCustWhatsApp(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. customer@gmail.com"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">Province *</label>
                      <select
                        value={custProvince}
                        onChange={(e) => setCustProvince(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020] bg-[#FAF9F6]"
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad Capital">Islamabad Capital</option>
                      </select>
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">City Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Lahore, Karachi, Multan"
                        value={custCity}
                        onChange={(e) => setCustCity(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-600 mb-1">Full Delivery Street Address *</label>
                    <textarea
                      placeholder="e.g. House No 42-A, Block G, DHA Phase 5"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      rows={2.5}
                      className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">Nearby Landmark (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Opposite Meezan Bank"
                        value={custLandmark}
                        onChange={(e) => setCustLandmark(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-600 mb-1">Special Order Notes (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Delivery after 4 PM"
                        value={custNotes}
                        onChange={(e) => setCustNotes(e.target.value)}
                        className="w-full rounded border border-stone-200 p-2.5 text-xs focus:outline-[#800020]"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-4 border-t border-stone-100">
                    <span className="block uppercase tracking-wider text-stone-600 mb-2.5">Settle Payment Method</span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'COD', name: 'Cash on Delivery' },
                        { key: 'Bank Transfer', name: 'Direct Bank' },
                        { key: 'EasyPaisa', name: 'EasyPaisa' },
                        { key: 'JazzCash', name: 'JazzCash' }
                      ].map(method => (
                        <label
                          key={method.key}
                          className={`rounded-lg border p-3 flex flex-col justify-between h-20 transition-all cursor-pointer ${
                            selectedPayment === method.key
                              ? 'bg-stone-50 border-[#800020] text-[#800020]'
                              : 'border-stone-200 text-stone-700 bg-white hover:border-[#800020]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentRadios"
                            checked={selectedPayment === method.key}
                            onChange={() => { setSelectedPayment(method.key); setCheckoutError(''); }}
                            className="sr-only"
                          />
                          <span className="text-xs font-bold leading-tight block">{method.name}</span>
                          <span className="text-[9px] text-[#A3A3A3] font-mono uppercase tracking-wider font-semibold">Native</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bank upfront instructions files uploader */}
                  {selectedPayment !== 'COD' && (
                    <div className="bg-stone-50 p-4 border border-stone-200 rounded-lg space-y-4 animate-fade-in text-xs font-sans text-[#1F1F1F]">
                      <div className="border-l-4 border-[#800020] pl-3">
                        <p className="font-bold font-serif text-[#1F1F1F] text-sm">Account details for {selectedPayment}:</p>
                        {(() => {
                          const acc = settings.paymentAccounts.find(a => a.method === selectedPayment);
                          if (!acc) return <p className="text-stone-400">Loading instructions...</p>;
                          return (
                            <div className="mt-2 text-xs leading-relaxed space-y-1">
                              <p><span className="font-bold text-stone-500">Account Title:</span> {acc.title}</p>
                              <p><span className="font-bold text-stone-500 animate-pulse">Number:</span> <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{acc.number}</span></p>
                              <p className="text-stone-600 mt-1">{acc.instructions}</p>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-200/60">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                          Upload successful Transfer receipt screenshot (Recommended)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#800020]/10 file:text-[#800020] hover:file:bg-[#800020]/20"
                          />
                        </div>
                        {paymentScreenshotFile && (
                          <div className="mt-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                            ✓ Screenshot processed safely at client browser cache.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Anti-manipulation order notes statement */}
                  <div className="pt-4 border-t border-stone-100 flex gap-2 text-stone-500 text-[10px] items-start">
                    <AlertCircle className="h-4 w-4 text-[#800020] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Your final price is calculated based on the total number of pieces in children orders. Unstitched fabric cuts are securely managed by server verification algorithms. Backends monitor price manipulations to prevent fraud.
                    </p>
                  </div>

                  {checkoutError && (
                    <p className="text-xs font-bold text-red-600 font-sans">
                      ⚠️ {checkoutError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={orderProcessing}
                    className={`w-full py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 ${
                      orderProcessing 
                        ? 'bg-stone-300 text-stone-500 cursor-wait'
                        : 'bg-[#800020] text-white hover:bg-[#600018]'
                    }`}
                  >
                    {orderProcessing ? 'Securing Server connection...' : 'Place Secure Order'}
                  </button>
                </form>
              </div>

              {/* Order summary checkout box */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-stone-900 border-b border-stone-100 pb-2 flex gap-1.5 items-center">
                    <ShoppingBag className="h-4.5 w-4.5 text-stone-400" />
                    Review Your Multi-brand Carton
                  </h3>

                  <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-2">
                    {serverCartDetails.items.map((item, idx) => (
                      <div key={idx} className="flex py-3 gap-3 items-center">
                        <div className="h-12 w-9 rounded overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-stone-400 text-xs bg-stone-200">👗</div>
                          )}
                        </div>
                        <div className="flex-1 text-xs">
                          <p className="font-bold text-stone-900 line-clamp-1">{item.productName}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            SKU: {item.code} | {item.size} / {item.color} | Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold font-mono text-stone-800">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="border-t border-stone-200 pt-4 space-y-2 text-xs font-sans text-stone-600">
                    <div className="flex justify-between">
                      <span>Total pieces in check:</span>
                      <span className="font-bold text-stone-900">{serverCartDetails.totalPieces} pcs</span>
                    </div>
                    <div className="flex justify-between text-[#800020]">
                      <span>Billed Quantity Category Rate:</span>
                      <span className="font-bold">Rs. {serverCartDetails.ratePerPiece.toLocaleString()}/ea</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold text-stone-900">Rs. {serverCartDetails.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee:</span>
                      <span>
                        {serverCartDetails.shippingCost === 0 ? (
                          <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                        ) : (
                          `Rs. ${serverCartDetails.shippingCost}`
                        )}
                      </span>
                    </div>

                    {serverCartDetails.savings > 0 && (
                      <div className="flex justify-between text-[#800020] bg-[#800020]/5 p-2 rounded border border-[#800020]/20 font-bold font-sans">
                        <span>Total Quantity Discount Savings:</span>
                        <span>- Rs. {serverCartDetails.savings.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-bold text-stone-950 border-t border-stone-250 pt-3 font-serif">
                      <span>Invoice Grand Total:</span>
                      <span>Rs. {serverCartDetails.finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================== ORDER CONFIRMATION VIEW ===================== */}
        {currentView === 'order-confirmation' && lastPlacedOrder && (
          <div className="mx-auto max-w-2xl py-12 px-4 text-center font-sans">
            <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xl space-y-6">
              
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h1 className="font-serif text-3xl font-extrabold text-stone-900">Carton Dispatched Safely!</h1>
                <p className="text-xs text-stone-400 mt-1">Invoice number: <span className="font-mono font-extrabold text-stone-900">{lastPlacedOrder.id}</span></p>
              </div>

              {/* Order Status Timeline */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#1F1F1F]">
                  <span>Parcel Status:</span>
                  <span className="rounded bg-sky-100 text-sky-800 px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider">
                    {lastPlacedOrder.status}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                  We are packaging your unstitched suits inside our Lahore warehouse facility. Expect dispatch updates soon via tracking mobile log codes. Est Delivery: <span className="font-bold underline">{settings.shippingTimeEstimate}</span>.
                </p>
              </div>

              {/* Invoice snapshot summary */}
              <div className="text-left select-text border-t border-b border-stone-150 py-4 font-sans text-xs space-y-2">
                <p><span className="font-bold text-stone-500 uppercase tracking-widest text-[9px] font-mono mr-2">Recipient:</span> {lastPlacedOrder.customerName}</p>
                <p><span className="font-bold text-stone-500 uppercase tracking-widest text-[9px] font-mono mr-2">Delivery Address:</span> {lastPlacedOrder.address}, {lastPlacedOrder.city}</p>
                
                <h4 className="font-bold text-[#1F1F1F] pt-2 border-t border-stone-100 uppercase tracking-wider text-[10px]">Articles Summary ({lastPlacedOrder.totalItems} pieces check):</h4>
                <div className="space-y-2 pr-1 font-sans text-xs">
                  {lastPlacedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-2">
                      <div className="h-10 w-7 rounded overflow-hidden border border-stone-250 shrink-0 bg-stone-50">
                        {it.imageUrl ? (
                          <img src={it.imageUrl} alt={it.productName} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-stone-100 text-stone-400 flex items-center justify-center text-[10px]">👗</div>
                        )}
                      </div>
                      <span className="flex-grow truncate font-medium text-stone-850">{it.productName} ({it.size}/{it.color}) x{it.quantity}</span>
                      <span className="shrink-0 font-mono font-bold text-stone-900">Rs. {it.price}/ea</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t border-stone-200 pt-2 text-[#800020] text-xs font-serif">
                    <span>Grand Settled Total Paid</span>
                    <span>Rs. {lastPlacedOrder.finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Whatsapp coordination details */}
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(
                  `Hello Zari Resell, I just completed placing order ID: *${lastPlacedOrder.id}*.\nName: *${lastPlacedOrder.customerName}*\nTotal items: *${lastPlacedOrder.totalItems}*\nGrand total: *Rs. ${lastPlacedOrder.finalTotal}*\n\nPlease help me confirm the logistics processing!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-600 bg-white py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <MessageCircle className="h-4.5 w-4.5 fill-emerald-600 text-white" />
                Confirm Order Instantly On WhatsApp
              </a>

              <div className="flex gap-3 justify-center text-xs">
                <button
                  onClick={() => handleSetView('shop')}
                  className="rounded-full bg-stone-900 border border-stone-900 px-6 py-2 font-bold text-white uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ===================== SECURE ADMIN PANEL VIEW ===================== */}
        {currentView === 'admin' && (
          <div className="animate-fade-in bg-stone-50 pb-16 min-h-[500px]">
            <AdminPanel
              onSettingsUpdate={handleSettingsUpdate}
              onBrandCreated={handleBrandCreated}
              onCategoryCreated={handleCategoryCreated}
              onProductCreated={handleProductCreated}
              onProductUpdated={handleProductUpdated}
              onOrderStatusUpdated={handleOrderStatusUpdated}
              db={{
                brands,
                categories,
                products,
                orders,
                settings
              }}
              adminToken={adminToken}
              setAdminToken={setAdminToken}
            />
          </div>
        )}

        {/* ===================== EDITABLE POLICY VIEW ===================== */}
        {currentView === 'policy' && (
          <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in font-sans">
            <div className="rounded-2xl border border-stone-250 bg-white p-8 md:p-12 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-1 select-none">
                <span className="hover:underline cursor-pointer" onClick={() => handleSetView('home')}>Home</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-stone-850 uppercase font-bold">Policy Page</span>
              </div>

              {/* Policy Category tabs navigation */}
              <div className="flex gap-2 pb-3 border-b border-stone-150 overflow-x-auto">
                {[
                  { key: 'aboutUs', label: 'Who We Are' },
                  { key: 'shipPolicy', label: 'Shipping Policy' },
                  { key: 'returnPolicy', label: 'Exchange & Returns' },
                  { key: 'terms', label: 'Brand Disclaimer Guidelines' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActivePolicyKey(tab.key)}
                    className={`rounded px-4 py-1.5 text-xs font-bold font-sans transition-all shrink-0 ${
                      activePolicyKey === tab.key
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-150'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Render dynamic customizable markdown text */}
              <div className="prose prose-stone max-w-none text-[#1F1F1F] font-sans text-sm space-y-4">
                {activePolicyKey === 'aboutUs' && (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2">About Zari Resell Store</h2>
                    <p className="leading-relaxed whitespace-pre-wrap">{settings.pages.aboutUs}</p>
                    <div className="mt-4 p-4 rounded bg-[#800020]/5 text-xs border border-[#800020]/15 leading-relaxed">
                      We offer a transparent pricing schedule designed to incentivize bulk purchases without imposing unneeded retail tier overheads. Sourcing genuine lawn sets from multiple hubs allows us to pass maximum quantity allowances directly to our end-customers.
                    </div>
                  </>
                )}

                {activePolicyKey === 'shipPolicy' && (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2">Nationwide shipping details</h2>
                    <p className="leading-relaxed whitespace-pre-wrap">{settings.pages.shipPolicy}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-[#FAF9F6] rounded border border-stone-200">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-stone-400 block mb-1">COD Dispatch</span>
                        <span>Standard cash payment on delivery supported in Punjab, Sindh, KPK and Balochistan.</span>
                      </div>
                      <div className="p-3.5 bg-[#FAF9F6] rounded border border-stone-200">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-stone-400 block mb-1">Logistics Handles</span>
                        <span>Tracking codes dispatched via SMS. Parcles arrive at dispatch center on following morning.</span>
                      </div>
                    </div>
                  </>
                )}

                {activePolicyKey === 'returnPolicy' && (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2">Exchanging & returns guidelines</h2>
                    <p className="leading-relaxed whitespace-pre-wrap">{settings.pages.returnPolicy}</p>
                    <div className="p-4 bg-yellow-50 border border-amber-200 rounded-lg text-amber-900 leading-normal">
                      📌 <span className="font-bold">Important note:</span> All original designer suits must be returned with tags un-snipped, unstitched, alongside respective master-reseller boxes or invoices within 7 business days rules.
                    </div>
                  </>
                )}

                {activePolicyKey === 'terms' && (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2">Trademark Disclaimer Guidelines</h2>
                    <p className="leading-relaxed whitespace-pre-wrap">{settings.pages.terms}</p>
                    <p className="text-stone-400 text-xs italic mt-4">
                      This is an independent multi-brand reseller. All brand names, brand logos, patterns, motifs, collections and trademarks displayed on this reseller platform belong entirely to their respective copyright owners (including Khaadi, Sapphire, J., Maria B, Limelight).
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 7. MOBILE PRODUCT DETAIL STICKY ACTION BAR */}
      {currentView === 'product-detail' && selectedProduct && (
        <div className="fixed bottom-[52px] inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200 px-4 py-2.5 shadow-lg flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Price Per Piece</span>
            <span className="text-xs font-black text-[#800020] font-sans">Rs. 2,000 <span className="text-[9px] text-stone-400 font-normal font-mono">(Wholesale)</span></span>
          </div>
          <button
            onClick={() => {
              // Direct selection helper
              const p = selectedProduct;
              setQuickAddProduct(p);
              const productSizes = Array.from(new Set(p.variants.map(v => v.size)));
              const productColors = Array.from(new Set(p.variants.map(v => v.color)));
              setQuickAddSize(productSizes[0] || '');
              setQuickAddColor(productColors[0] || '');
              setQuickAddQty(1);
              setQuickAddError('');
            }}
            className="rounded-lg bg-stone-950 hover:bg-[#800020] text-stone-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add to Carton</span>
          </button>
        </div>
      )}

      {/* 12. RESPONSIVE MOBILE QUICK ADD DRAWER / MODAL */}
      <AnimatePresence>
        {quickAddProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddProduct(null)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            {/* Slider Sheet */}
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-sm sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl z-50 overflow-hidden border border-stone-200 pb-8 sm:pb-5 text-stone-900"
            >
              {/* Top Handle bar */}
              <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-4 sm:hidden" />

              {/* Close Button */}
              <button
                onClick={() => setQuickAddProduct(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="font-serif text-base font-black text-stone-900 mb-3 pr-6 leading-tight">
                Quick Select Article
              </h3>

              {/* Product Thumbnail & Details Card */}
              <div className="flex gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 mb-4">
                <img
                  src={quickAddProduct.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'}
                  alt={quickAddProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-18 object-cover rounded-lg bg-stone-200 border border-stone-300 shadow-xs shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[9px] font-black tracking-widest text-[#800020] uppercase font-sans mb-0.5">
                    {quickAddProduct.brandName}
                  </span>
                  <h4 className="font-serif text-xs font-bold text-stone-900 truncate leading-tight mb-0.5">
                    {quickAddProduct.title}
                  </h4>
                  <p className="font-mono text-[9px] text-stone-400 font-bold mb-0.5">
                    SKU Code: {quickAddProduct.code}
                  </p>
                  <p className="font-sans text-[10px] font-black text-[#800020]">
                    Rs. 2,000 per piece <span className="text-[9px] text-stone-400 font-normal font-mono">(bulk rates auto-apply)</span>
                  </p>
                </div>
              </div>

              {/* Variant selections fields */}
              <div className="space-y-4 text-left font-sans text-xs">
                {/* 1. Size Selection list */}
                <div>
                  <h5 className="font-bold text-stone-700 mb-2 uppercase tracking-wider text-[9px]">
                    Available Size options:
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(quickAddProduct.variants.map(v => v.size))).map(size => {
                      const isSelected = quickAddSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setQuickAddSize(size);
                            // Set default color for this size if not exists
                            const sameSizeVars = quickAddProduct.variants.filter(v => v.size === size);
                            if (sameSizeVars.length > 0) {
                              setQuickAddColor(sameSizeVars[0].color);
                            }
                            setQuickAddError('');
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-stone-950 border-stone-950 text-white shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-950'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Color Selection list */}
                <div>
                  <h5 className="font-bold text-stone-700 mb-2 uppercase tracking-wider text-[9px]">
                    Color variants:
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(quickAddProduct.variants.filter(v => v.size === quickAddSize).map(v => v.color))).map(color => {
                      const isSelected = quickAddColor === color;
                      // Find stock of this variant
                      const currentVar = quickAddProduct.variants.find(v => v.size === quickAddSize && v.color === color);
                      const isOutOfStock = !currentVar || currentVar.stock <= 0;
                      return (
                        <button
                          key={color}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => {
                            setQuickAddColor(color);
                            setQuickAddError('');
                          }}
                          className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all border flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                            isSelected
                              ? 'bg-[#800020] border-[#800020] text-white font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#800020]'
                          }`}
                        >
                          <span>{color}</span>
                          <span className="text-[9px] font-mono opacity-50">({currentVar?.stock ?? 0} left)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Quantity selectors */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-2">
                  <span className="font-bold text-stone-700 uppercase tracking-wider text-[9px]">Select Quantity:</span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setQuickAddQty(Math.max(1, quickAddQty - 1))}
                      className="p-1 px-2 text-stone-500 hover:bg-stone-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono font-bold text-xs text-stone-800">{quickAddQty}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVar = quickAddProduct.variants.find(v => v.size === quickAddSize && v.color === quickAddColor);
                        const maxStock = currentVar ? currentVar.stock : 1;
                        if (quickAddQty >= maxStock) {
                          setQuickAddError(`Max available stock is ${maxStock}`);
                          return;
                        }
                        setQuickAddError('');
                        setQuickAddQty(quickAddQty + 1);
                      }}
                      className="p-1 px-2 text-stone-500 hover:bg-stone-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {quickAddError && (
                  <p className="text-[10px] font-black text-red-600 mt-2">{quickAddError}</p>
                )}

                {/* Confirm action button */}
                <button
                  type="button"
                  onClick={() => {
                    const chosenSize = quickAddSize;
                    const chosenColor = quickAddColor;
                    if (!chosenSize) {
                      setQuickAddError('Please select a size first');
                      return;
                    }
                    if (!chosenColor) {
                      setQuickAddError('Please select a color first');
                      return;
                    }
                    const variant = quickAddProduct.variants.find(v => v.size === chosenSize && v.color === chosenColor);
                    if (!variant || variant.stock <= 0) {
                      setQuickAddError('Selected variant combination is out of stock');
                      return;
                    }
                    if (quickAddQty > variant.stock) {
                      setQuickAddError(`Available stock is only ${variant.stock}`);
                      return;
                    }

                    handleAddToCart(quickAddProduct.id, chosenSize, chosenColor, quickAddQty);
                    setQuickAddProduct(null);
                  }}
                  className="w-full bg-stone-950 hover:bg-[#800020] text-stone-100 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 mt-3 cursor-pointer"
                >
                  Confirm Carton Pack Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION (MANDATORY BRAND PROTECTION DISCLAIMER) */}
      <footer className="bg-stone-900 text-[#FAF9F6] pt-12 pb-6 border-t border-stone-850 font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Logo and address specs */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold tracking-widest text-white uppercase">Zari.Resell</h3>
              <p className="text-xs text-stone-450 leading-relaxed">
                Premium multi-brand reseller store for Pakistani designer brands including Khaadi, Sapphire, J., Limelight, and Maria B. Beautiful, simple, quantity-based pricing.
              </p>
              <div className="space-y-1.5 text-xs">
                <p><span className="font-bold text-stone-500">WhatsApp:</span> <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}`} className="text-emerald-400 underline">{settings.whatsappNumber}</a></p>
                <div className="flex gap-2.5 pt-1.5">
                  <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-xs text-stone-400 hover:text-white underline">Instagram</a>
                  <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-xs text-stone-400 hover:text-white underline">Facebook</a>
                </div>
              </div>
            </div>

            {/* Quick routes */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 mb-3.5">Store Directory</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li><button onClick={() => handleSetView('shop')} className="hover:text-amber-500">All Clothing Articles</button></li>
                <li><button onClick={() => { handleSetView('home'); setTimeout(() => { const el = document.getElementById('shop-by-brand-grid'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 50); }} className="hover:text-amber-500">Explore Brands Boutique</button></li>
                <li><button onClick={() => handleSetView('policy', 'aboutUs')} className="hover:text-amber-500">How Pricing Works</button></li>
                <li><button onClick={() => handleSetView('policy', 'shipPolicy')} className="hover:text-amber-500">Dispatch & Shipping</button></li>
                <li><button onClick={() => handleSetView('admin')} className="hover:text-amber-500 text-stone-500">Staff Control Panel</button></li>
              </ul>
            </div>

            {/* Support policies links */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 mb-3.5">Customer Support</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li><button onClick={() => handleSetView('policy', 'shipPolicy')} className="hover:text-amber-500">Shipping Policy</button></li>
                <li><button onClick={() => handleSetView('policy', 'returnPolicy')} className="hover:text-amber-500">Return & Exchange Policy</button></li>
                <li><button onClick={() => handleSetView('policy', 'terms')} className="hover:text-amber-500 font-bold text-rose-300">Reseller Trademark Disclaimer</button></li>
                <li><button onClick={() => handleSetView('policy', 'contactUs')} className="hover:text-amber-500">Need Help? ContactUs</button></li>
              </ul>
            </div>

            {/* Mini mixing warning status */}
            <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10 text-xs">
              <span className="font-bold text-[#800020] uppercase font-mono tracking-wider text-[10px] block">Mix Carton Rule</span>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Mix items from multiple manufacturers inside standard bulk cartons to automatically claim our discount price rates: Rs. 2,000 for 1-4 articles, Rs. 1,900 for 5-9 pieces, and Rs. 1,800 for 10 or more pieces.
              </p>
            </div>

          </div>

          {/* STRICT MANDATORY TRADEMARK FOOTER DISCLAIMER */}
          <div className="border-t border-stone-850 pt-6 text-center text-xs text-stone-500 space-y-2 select-text">
            <p className="max-w-2xl mx-auto leading-relaxed">
              ⚠️ <span className="font-bold text-stone-400">DISCLAIMER:</span> This is an independent multi-brand reseller. All brand names, brand logos, prints, motifs, sketches, suits designs and trademarks belong entirely to their respective copyright owners (including Khaadi, Sapphire, J., Maria B, Limelight, Ethnic, Zellbury, Bonanza Satrangi, Gul Ahmed, Alkaram Studio). This resell platform does not represent, claim affiliation, or claim official endorsement with the list brands.
            </p>
            <p className="text-[10px] py-1 text-stone-650 tracking-wider">
              © {new Date().getFullYear()} Zari Resell Pvt. All rights reserved. Created in sandboxed safe environment.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
