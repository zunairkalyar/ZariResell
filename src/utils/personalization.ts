export interface ProductViewInfo {
  productId: string;
  viewCount: number;
  lastViewedTime: number; // millisecond timestamp
  firstViewedTime: number;
}

// Key for storage
const VIEW_HISTORY_KEY = 'zari_view_history';

// Retrieve viewed history
export function getViewHistory(): ProductViewInfo[] {
  try {
    const raw = localStorage.getItem(VIEW_HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read view history', e);
  }
  return [];
}

// Record a new view
export function recordProductView(productId: string, maxHistorySize = 20): ProductViewInfo[] {
  const history = getViewHistory();
  const existingIdx = history.findIndex(h => h.productId === productId);
  const now = Date.now();

  if (existingIdx > -1) {
    history[existingIdx].viewCount += 1;
    history[existingIdx].lastViewedTime = now;
  } else {
    history.push({
      productId,
      viewCount: 1,
      firstViewedTime: now,
      lastViewedTime: now
    });
  }

  // Sort by last viewed time descending
  history.sort((a, b) => b.lastViewedTime - a.lastViewedTime);

  // Trim to size
  const trimmed = history.slice(0, maxHistorySize);

  try {
    localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save view history', e);
  }

  return trimmed;
}

// Clear view history
export function clearViewHistory() {
  try {
    localStorage.removeItem(VIEW_HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear view history', e);
  }
}

// Check total stock of a product
export function getProductTotalStock(product: { variants: { stock: number }[] }): number {
  return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
}

// Interface for scoring inputs
interface ScoringContext {
  personalizationEnabled: boolean;
  viewHistoryDays: number;
  outOfStockDisplay: 'bottom' | 'hide' | 'visible';
  cartProductIds: string[];
  wishlistProductIds: string[];
}

/**
 * Computes personalized score for a product. Higher score = higher priority.
 */
export function scoreProduct(
  product: { id: string; featured: boolean; newArrival: boolean; variants: { stock: number }[] },
  history: ProductViewInfo[],
  ctx: ScoringContext
): number {
  const totalStock = getProductTotalStock(product);
  const isOutOfStock = totalStock <= 0;

  // Handles filtering via negative/lowest values when out of stock display rules apply
  if (isOutOfStock) {
    if (ctx.outOfStockDisplay === 'hide') {
      return -999999; // Filter out
    }
    // 'bottom' or 'visible'
    // Out of stock is always at the bottom relative to standard products (base score range of 0 to 1000)
    let score = 500;
    if (product.featured) score += 200;
    if (product.newArrival) score += 100;
    return score;
  }

  // Base score for in-stock
  let score = 100000;

  // Check features
  if (product.featured) {
    score += 20000;
  }
  if (product.newArrival) {
    score += 10000;
  }

  // Check state helpers
  const isInCart = ctx.cartProductIds.includes(product.id);
  if (isInCart) {
    score += 40000; // Pushed higher so cart products are accessible
  }

  const isInWishlist = ctx.wishlistProductIds.includes(product.id);
  if (isInWishlist) {
    score += 30000; // Keep wishlisted products prominent
  }

  // Apply Viewed Personalization Penalty
  if (ctx.personalizationEnabled) {
    const view = history.find(h => h.productId === product.id);
    if (view) {
      const msLimit = (ctx.viewHistoryDays || 30) * 24 * 3600 * 1000;
      const isExpired = Date.now() - view.lastViewedTime > msLimit;

      if (!isExpired) {
        // Apply penalty
        if (view.viewCount === 1) {
          score -= 50000; // Pushed down past standard unviewed
        } else {
          // Multiple views without addition to cart or wishlist penalizes further
          const actionBonus = (isInCart || isInWishlist) ? 35000 : 0;
          score -= (50000 + (view.viewCount * 2000)) - actionBonus;
        }
      }
    }
  }

  return score;
}

/**
 * Sorts and filters products according to customized personalization + standard sorting criteria
 */
export function sortAndFilterProducts(
  products: any[],
  history: ProductViewInfo[],
  ctx: ScoringContext,
  sortBy: string // 'recommended' | 'newest' | 'brand' | 'instock' | 'lowstock' | 'unviewed_first'
): any[] {
  // Pre-calculate scores
  const scoreMap = new Map<string, number>();
  products.forEach(p => {
    scoreMap.set(p.id, scoreProduct(p, history, ctx));
  });

  // Filter out products that should be hidden
  let filtered = products.filter(p => !p.hidden && scoreMap.get(p.id)! > -500000);

  // Apply sorting
  filtered.sort((a, b) => {
    const stockA = getProductTotalStock(a) > 0;
    const stockB = getProductTotalStock(b) > 0;

    // First rule: handle out of stock at bottom unless outOfStockDisplay is 'visible' (forces original order)
    if (ctx.outOfStockDisplay === 'bottom') {
      if (stockA && !stockB) return -1;
      if (!stockA && stockB) return 1;
    }

    if (sortBy === 'recommended' || sortBy === 'popular') {
      // Use personalisation scoring (since "Recommended for You" should use the system)
      const scoreA = scoreMap.get(a.id) || 0;
      const scoreB = scoreMap.get(b.id) || 0;
      return scoreB - scoreA;
    }

    if (sortBy === 'unviewed_first') {
      // Force unviewed first, so viewed are strictly penalised/pushed to end
      const viewedA = history.some(h => h.productId === a.id);
      const viewedB = history.some(h => h.productId === b.id);
      if (!viewedA && viewedB) return -1;
      if (viewedA && !viewedB) return 1;
      // If both or neither are viewed, fallback to newest
      return b.id.localeCompare(a.id);
    }

    if (sortBy === 'newest') {
      // Ignore personalization, strictly newest (newest SKU / id descending)
      if (a.newArrival && !b.newArrival) return -1;
      if (!a.newArrival && b.newArrival) return 1;
      return b.id.localeCompare(a.id);
    }

    if (sortBy === 'brand') {
      return a.brandName.localeCompare(b.brandName);
    }

    if (sortBy === 'instock') {
      const stockValA = getProductTotalStock(a);
      const stockValB = getProductTotalStock(b);
      return stockValB - stockValA;
    }

    if (sortBy === 'lowstock') {
      const stockValA = getProductTotalStock(a);
      const stockValB = getProductTotalStock(b);
      // Only non-zero stock
      const filteredA = stockValA === 0 ? 999999 : stockValA;
      const filteredB = stockValB === 0 ? 999999 : stockValB;
      return filteredA - filteredB;
    }

    return 0;
  });

  return filtered;
}
