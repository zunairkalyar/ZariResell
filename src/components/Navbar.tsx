import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, Settings, ShieldCheck, Heart, ChevronDown, ChevronUp, Home, Compass, Grid, HelpCircle, PhoneCall, Gift } from 'lucide-react';
import { Brand, Category, Product } from '../types';

interface NavbarProps {
  brands: Brand[];
  categories: Category[];
  cartCount: number;
  cartRate: number;
  currentView: string;
  setView: (view: string, id?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCartClick: () => void;
  products: Product[];
  onInspectProduct: (product: Product) => void;
}

export default function Navbar({
  brands,
  categories,
  cartCount,
  cartRate,
  currentView,
  setView,
  searchQuery,
  setSearchQuery,
  onCartClick,
  products,
  onInspectProduct
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Real-time search suggestions calculation
  const searchSuggestions = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2 || !products) return [];
    return products.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.brandName.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, products]);
  
  // Accordions for mobile drawer
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentView !== 'shop' && currentView !== 'search') {
      setView('shop');
    }
  };

  const handleBrandSelect = (brandId: string) => {
    setView('brand-catalog', brandId);
    setMobileMenuOpen(false);
  };

  const handleCategorySelect = (catId: string) => {
    // In shop view, categories filter. Set view to shop first
    setView('shop');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-[#FAF9F6]/95 backdrop-blur-md">
        {/* Announcement Ticker */}
        <div className="w-full bg-[#800020] px-4 py-1.5 text-center text-[10px] sm:text-xs font-semibold tracking-wider text-[#FAF9F6] select-none uppercase">
          👗 MIX ANY DESIGNER INDEPENDENT SUITS — 1 Pc Rs. 2000 • 5+ Rs. 1900 • 10+ Rs. 1800 Wholesale
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden md:flex mx-auto h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          
          {/* Logo on Left */}
          <div className="flex items-center">
            <button
              onClick={() => setView('home')}
              className="text-2xl font-serif font-black tracking-widest text-[#1F1F1F] uppercase cursor-pointer hover:opacity-85"
            >
              Zari<span className="text-[#800020] font-sans font-light text-xl">.Resell</span>
            </button>
          </div>

          {/* Nav Links in Center */}
          <nav className="flex space-x-8">
            <button
              onClick={() => setView('home')}
              className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#800020] ${
                currentView === 'home' ? 'text-[#800020]' : 'text-stone-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setView('shop')}
              className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#800020] ${
                currentView === 'shop' ? 'text-[#800020]' : 'text-stone-600'
              }`}
            >
              Shop Catalog
            </button>
            
            {/* Brands Hover dropdown */}
            <div className="relative group flex items-center">
              <button
                onClick={() => setView('shop')}
                className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-[#800020] flex items-center gap-1"
              >
                Brands <ChevronDown className="h-3 w-3 inline text-stone-400 group-hover:text-[#800020]" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 hidden w-60 rounded-xl border border-stone-200 bg-white shadow-xl group-hover:block transition-all duration-200 z-50">
                <div className="p-3 max-h-72 overflow-y-auto space-y-0.5 no-scrollbar">
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandSelect(brand.id)}
                      className="w-full text-left rounded-lg px-3 py-2 text-[11px] font-sans font-bold text-stone-700 hover:bg-stone-50 hover:text-[#800020] transition-colors"
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('policy', 'aboutUs')}
              className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-[#800020]"
            >
              How Pricing Works
            </button>
            <button
              onClick={() => setView('policy', 'contactUs')}
              className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-[#800020]"
            >
              Contact
            </button>
          </nav>

          {/* User actions right */}
          <div className="flex items-center space-x-4">
            {/* Inline search bar with real-time suggestions */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search SKU code, fabric..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                className="w-52 lg:w-64 rounded-full border border-stone-200 bg-stone-50/50 py-1.5 pl-9 pr-4 text-[11px] font-sans text-stone-950 placeholder-stone-400 focus:border-[#800020] focus:bg-white focus:outline-hidden transition-all"
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div id="search-suggestions" className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-stone-200 bg-white p-2 shadow-xl z-50 animate-fade-in text-left">
                  <div className="px-2 py-1 font-mono text-[9px] text-[#800020] uppercase tracking-wider font-extrabold border-b border-stone-105 select-none">
                    Live Catalog Suggestions
                  </div>
                  <div className="mt-1 space-y-0.5 max-h-60 overflow-y-auto no-scrollbar">
                    {searchSuggestions.map(p => {
                      const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onInspectProduct(p);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-stone-50 transition-colors"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-7 h-9 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-150"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-[11px] font-black leading-tight text-stone-900">{p.title} <span className="font-mono text-[9px] font-bold text-stone-400 uppercase">({p.code})</span></p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-semibold text-stone-500 font-sans">
                              <span className="uppercase text-[#800020] tracking-wider text-[8px] font-black">{p.brandName}</span>
                              <span>•</span>
                              <span>{totalStock > 0 ? `${totalStock} available` : 'Sold Out'}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin control panel link */}
            <button
              onClick={() => setView('admin')}
              className="rounded-full p-2 hover:bg-stone-100 flex items-center gap-1 text-stone-500 hover:text-[#800020] transition-colors cursor-pointer"
              title="Admin Panel"
            >
              <Settings className="h-4 w-4" />
              <span className="text-[9px] font-mono tracking-widest font-extrabold text-stone-400 uppercase">Reseller</span>
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-[#FAF9F6] transition-all hover:bg-stone-850 hover:scale-[1.02] cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#CAF0F8]" />
              {cartCount > 0 ? (
                <span className="text-xs font-bold">
                  {cartCount} <span className="opacity-40 mx-1">|</span> Rs. {(cartCount * cartRate).toLocaleString()}
                </span>
              ) : (
                <span className="text-xs font-bold">0</span>
              )}
            </button>
          </div>
        </div>

        {/* 9. REDESIGNED MOBILE HEADER - Single Line Layout */}
        <div className="flex md:hidden h-14 items-center justify-between px-4 w-full bg-[#FAF9F6]">
          {/* Menu icon on Left */}
          <button
            id="mobile-nav-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 px-2.5 rounded-lg border border-stone-200 text-stone-900 bg-white hover:bg-stone-50 cursor-pointer flex items-center justify-center"
            aria-label="Toggle mobile drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo strictly in the Middle (size locked) */}
          <div className="flex-1 flex justify-center pl-2">
            <button
              onClick={() => { setView('home'); setMobileMenuOpen(false); }}
              className="text-lg font-serif font-black tracking-wider text-stone-900 uppercase"
            >
              Zari<span className="text-[#800020] font-sans font-light text-sm">.Resell</span>
            </button>
          </div>

          {/* Search Toggle icon */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 select-none text-stone-600 active:bg-stone-100 rounded-full cursor-pointer"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Shopping Cart button with Badges */}
            <button
              onClick={onCartClick}
              className="p-2 select-none text-stone-600 active:bg-stone-100 rounded-full relative cursor-pointer"
              title="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#800020] text-[8px] font-black text-white px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expanded compact search for mobile */}
        {searchOpen && (
          <div className="border-t border-stone-200 bg-white p-2.5 md:hidden relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search code, brand context, fabric color..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 py-1.5 pl-9 pr-8 text-xs font-sans text-stone-900 focus:border-[#800020] focus:outline-none focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-stone-400 hover:text-stone-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div id="mobile-search-suggestions" className="absolute top-full left-0 right-0 mx-2.5 mt-1 rounded-xl border border-stone-200 bg-white p-2 shadow-xl z-50 animate-fade-in text-left">
                <div className="px-2 py-1 font-mono text-[9px] text-[#800020] uppercase tracking-wider font-extrabold border-b border-stone-105 select-none">
                  Live Catalog Suggestions
                </div>
                <div className="mt-1 space-y-0.5 max-h-52 overflow-y-auto no-scrollbar">
                  {searchSuggestions.map(p => {
                    const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onInspectProduct(p);
                          setShowSuggestions(false);
                          setSearchOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-stone-50 transition-colors"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-7 h-9 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-150"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sans text-[11px] font-black leading-tight text-stone-900">{p.title} <span className="font-mono text-[9px] font-bold text-stone-400 uppercase">({p.code})</span></p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-semibold text-stone-500 font-sans">
                            <span className="uppercase text-[#800020] tracking-wider text-[8px] font-black">{p.brandName}</span>
                            <span>•</span>
                            <span>{totalStock > 0 ? `${totalStock} available` : 'Sold Out'}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. HORIZONTALLY SCROLLABLE BRAND/CATEGORY SWIPE BAR */}
        <div className="w-full bg-stone-50 border-t border-stone-200 flex items-center py-1.5 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 whitespace-nowrap scroll-smooth select-none w-full">
            <button
              onClick={() => { setView('shop'); setSearchQuery(''); }}
              className="rounded-full bg-[#800020] text-white px-3.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0"
            >
              New Arrivals ✨
            </button>

            {brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => setView('brand-catalog', brand.id)}
                className={`rounded-full border px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 shrink-0 ${
                  currentView === 'brand-catalog' && brand.id === brand.id // simplistically active check
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-900'
                }`}
              >
                {brand.name}
              </button>
            ))}

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setView('shop'); }}
                className="rounded-full border border-stone-200 bg-white text-stone-700 hover:border-stone-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider shrink-0"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 10. COMPREHENSIVE MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Outside overlay click */}
          <div
            id="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Side Drawer Panel */}
          <div className="relative flex w-4/5 max-w-sm flex-col bg-[#FAF9F6] p-6 shadow-2xl transition-transform duration-300 transform translate-x-0 h-full overflow-y-auto no-scrollbar z-50">
            {/* Header / Logo + Close button */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 font-sans">
              <span className="text-base font-serif font-black tracking-wider text-stone-900 uppercase">
                Zari<span className="text-[#800020] font-sans font-light text-xs">.Resell</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-stone-100 p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-900 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Navigation item lists */}
            <div className="space-y-4 font-sans text-xs uppercase tracking-wider font-extrabold">
              <button
                onClick={() => { setView('home'); setMobileMenuOpen(false); }}
                className={`flex w-full items-center gap-3.5 rounded-lg py-3 px-4 text-stone-850 hover:bg-stone-100 text-left transition-all ${
                  currentView === 'home' ? 'bg-[#800020]/5 text-[#800020]' : ''
                }`}
              >
                <Home className="h-4 w-4 text-[#800020]" />
                <span>Home Dashboard</span>
              </button>

              <button
                onClick={() => { setView('shop'); setMobileMenuOpen(false); }}
                className={`flex w-full items-center gap-3.5 rounded-lg py-3 px-4 text-stone-850 hover:bg-stone-100 text-left transition-all ${
                  currentView === 'shop' ? 'bg-[#800020]/5 text-[#800020]' : ''
                }`}
              >
                <Compass className="h-4 w-4 text-[#800020]" />
                <span>Shop All Articles</span>
              </button>

              {/* Brands Accordion Section */}
              <div className="border-t border-b border-stone-200/60 py-2.5">
                <button
                  type="button"
                  onClick={() => setBrandsExpanded(!brandsExpanded)}
                  className="flex w-full items-center justify-between py-2 px-4 text-stone-850 hover:bg-stone-105 rounded text-left transition-colors font-bold uppercase tracking-wider"
                >
                  <span className="flex items-center gap-3.5">
                    <Grid className="h-4 w-4 text-[#800020]" /> 
                    Our Fashion Brands
                  </span>
                  {brandsExpanded ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
                </button>

                {brandsExpanded && (
                  <div className="mt-2 pl-11 space-y-1.5 border-l-2 border-[#800020]/20 ml-6">
                    {brands.slice(0, 10).map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandSelect(brand.id)}
                        className="block w-full text-left py-1 px-2.5 text-[11px] font-bold text-stone-600 hover:text-[#800020]"
                      >
                        {brand.name}
                      </button>
                    ))}
                    <button
                      onClick={() => { setView('shop'); setMobileMenuOpen(false); }}
                      className="block w-full text-left py-1 text-[11px] font-black text-[#800020] underline"
                    >
                      View All Brands →
                    </button>
                  </div>
                )}
              </div>

              {/* Collections Accordion Section */}
              <div className="border-b border-stone-200/60 pb-2.5">
                <button
                  type="button"
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="flex w-full items-center justify-between py-2 px-4 text-stone-850 hover:bg-stone-105 rounded text-left transition-colors font-bold uppercase tracking-wider"
                >
                  <span className="flex items-center gap-3.5">
                    <Gift className="h-4 w-4 text-[#800020]" />
                    Collection Category
                  </span>
                  {categoriesExpanded ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
                </button>

                {categoriesExpanded && (
                  <div className="mt-2 pl-11 space-y-1.5 border-l-2 border-[#800020]/20 ml-6">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className="block w-full text-left py-1 px-2.5 text-[11px] font-bold text-stone-600 hover:text-[#800020]"
                      >
                        {cat.name}
                      </button>
                    ))}
                    <button
                      onClick={() => { setView('shop'); setMobileMenuOpen(false); }}
                      className="block w-full text-left py-1 text-[11px] font-black text-[#800020] underline"
                    >
                      View All Categories →
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => { setView('policy', 'aboutUs'); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-3.5 rounded-lg py-3 px-4 text-stone-850 hover:bg-stone-100 text-left transition-all"
              >
                <HelpCircle className="h-4 w-4 text-[#800020]" />
                <span>How Pricing Works</span>
              </button>

              <button
                onClick={() => { setView('policy', 'contactUs'); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-3.5 rounded-lg py-3 px-4 text-stone-850 hover:bg-stone-100 text-left transition-all"
              >
                <PhoneCall className="h-4 w-4 text-[#800020]" />
                <span>WhatsApp Support</span>
              </button>
            </div>

            {/* Admin entry point in drawer bottom */}
            <div className="mt-auto pt-8 border-t border-stone-200">
              <button
                onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3.5 text-xs font-bold text-[#FAF9F6] uppercase tracking-wider"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Access Reseller Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 8. MOBILE BOTTOM FIXED NAVIGATION BAR WITH QUANTITY BADGES */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1.5 select-none hover:bg-white transition-colors">
        <div className="flex items-center justify-around h-11 max-w-md mx-auto text-stone-600">
          
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-tighter w-14 h-full cursor-pointer transition-colors ${
              currentView === 'home' ? 'text-[#800020]' : 'text-stone-500 hover:text-[#800020]'
            }`}
          >
            <Home className="h-4 w-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setView('shop')}
            className={`flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-tighter w-14 h-full cursor-pointer transition-colors ${
              currentView === 'shop' ? 'text-[#800020]' : 'text-stone-500 hover:text-[#800020]'
            }`}
          >
            <Compass className="h-4 w-4 mb-0.5" />
            <span>Shop</span>
          </button>

          <button
            onClick={() => { setView('shop'); }}
            className={`flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-tighter w-14 h-full cursor-pointer transition-colors ${
              currentView === 'brand-catalog' ? 'text-[#800020]' : 'text-stone-500 hover:text-[#800020]'
            }`}
          >
            <Grid className="h-4 w-4 mb-0.5" />
            <span>Brands</span>
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-tighter w-14 h-full cursor-pointer text-stone-500 hover:text-[#800020]"
          >
            <Search className="h-4 w-4 mb-0.5" />
            <span>Search</span>
          </button>

          <button
            onClick={onCartClick}
            className="flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-tighter w-14 h-full cursor-pointer text-stone-500 hover:text-[#800020] relative"
          >
            <ShoppingBag className="h-4 w-4 mb-0.5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#800020] text-[8px] font-black text-white px-1 shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </>
  );
}
