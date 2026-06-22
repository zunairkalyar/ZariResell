import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Search, Settings, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Brand, Category } from '../types';

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
  onCartClick
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-[#FAF9F6]/95 backdrop-blur-md">
      {/* Dynamic Announcement Ticker */}
      <div className="w-full bg-[#800020] px-4 py-2 text-center text-xs font-medium tracking-wide text-[#FAF9F6]">
        MIX ANY ARTICLES — 1 Piece Rs. 2,000 | 5+ Rs. 1,900 Each | 10+ Rs. 1,800 Each
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Toggle Button for Mobile Navigation */}
        <button
          id="mobile-nav-toggle"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 md:hidden"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Premium Brand Logo */}
        <div id="store-logo" className="flex flex-1 justify-center md:justify-start">
          <button
            onClick={() => setView('home')}
            className="text-2xl font-serif font-bold tracking-widest text-[#1F1F1F] uppercase cursor-pointer hover:opacity-85"
          >
            Zari<span className="text-[#800020] font-sans font-light text-xl">.Resell</span>
          </button>
        </div>

        {/* Desktop Navigation Link Cluster */}
        <nav className="hidden space-x-8 md:flex">
          <button
            onClick={() => setView('home')}
            className={`font-sans text-sm font-medium tracking-wide transition-colors hover:text-[#800020] ${
              currentView === 'home' ? 'text-[#800020] font-semibold' : 'text-stone-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setView('shop')}
            className={`font-sans text-sm font-medium tracking-wide transition-colors hover:text-[#800020] ${
              currentView === 'shop' ? 'text-[#800020] font-semibold' : 'text-stone-600'
            }`}
          >
            Shop All
          </button>
          
          {/* Brands Dropdown */}
          <div className="relative group flex items-center">
            <button
              onClick={() => setView('shop')}
              className="font-sans text-sm font-medium tracking-wide text-stone-600 transition-colors hover:text-[#800020] flex items-center gap-1"
            >
              Brands
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 hidden w-56 rounded-md border border-stone-200 bg-white shadow-lg group-hover:block transition-all duration-300 z-50">
              <div className="p-2 space-y-1">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.id)}
                    className="w-full text-left rounded px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#800020] transition-colors"
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setView('policy', 'aboutUs')}
            className="font-sans text-sm font-medium tracking-wide text-stone-600 transition-colors hover:text-[#800020]"
          >
            How Pricing Works
          </button>
          <button
            onClick={() => setView('policy', 'contactUs')}
            className="font-sans text-sm font-medium tracking-wide text-stone-600 transition-colors hover:text-[#800020]"
          >
            Contact
          </button>
        </nav>

        {/* User Utilities Corner */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {/* Actionable Compact Inline Search */}
          <div className="relative hidden max-w-xs items-center sm:flex">
            <Search className="absolute left-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search code, brand, color..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-48 sm:w-60 rounded-full border border-stone-200 bg-stone-50/50 py-1.5 pl-9 pr-4 text-xs font-sans text-stone-950 placeholder-stone-400 transition-all focus:border-[#800020] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020]"
            />
          </div>

          {/* Search Trigger for Mobile viewports */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-full p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:hidden"
            title="Search Products"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Secure Admin Workspace link */}
          <button
            onClick={() => setView('admin')}
            className={`rounded-full p-2 hover:bg-stone-100 flex items-center gap-1 text-stone-500 hover:text-[#800020] transition-colors`}
            title="Secure Admin Control Panel"
          >
            <Settings className="h-5 w-5" />
            <span className="hidden lg:inline text-[10px] font-mono tracking-widest font-medium text-stone-400 uppercase">Admin</span>
          </button>

          {/* Enhanced Smart Shop Cart Icon */}
          <button
            id="cart-icon-btn"
            onClick={onCartClick}
            className="group relative flex items-center gap-1.5 rounded-full bg-stone-900 border border-stone-800 px-3.5 py-1.5 text-[#FAF9F6] transition-all hover:bg-stone-800 hover:scale-105"
          >
            <ShoppingBag className="h-4 w-4 text-stone-200" />
            {cartCount > 0 ? (
              <span className="flex items-center text-xs font-semibold">
                {cartCount} <span className="opacity-50 mx-1">|</span> Rs. {cartRate.toLocaleString()}
              </span>
            ) : (
              <span className="text-xs font-medium tracking-wide">0</span>
            )}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#800020] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#800020]"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Search Bar for Mobile viewports */}
      {searchOpen && (
        <div className="border-b border-stone-200 bg-white p-3 sm:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search SKU code, category, brand..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-md border border-stone-200 bg-stone-50 py-2 pl-9 pr-10 text-sm focus:border-[#800020] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay and Drawer Content */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-24 z-50 flex flex-col bg-[#FAF9F6] p-6 shadow-2xl animate-fade-in md:hidden border-t border-stone-200 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 font-mono">Store Navigation</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setView('home'); setMobileMenuOpen(false); }}
                  className="rounded-lg bg-white border border-stone-200 p-3 text-left text-sm font-medium text-stone-800 hover:border-[#800020]"
                >
                  Home
                </button>
                <button
                  onClick={() => { setView('shop'); setMobileMenuOpen(false); }}
                  className="rounded-lg bg-white border border-stone-200 p-3 text-left text-sm font-medium text-stone-800 hover:border-[#800020]"
                >
                  Shop All
                </button>
                <button
                  onClick={() => { setView('policy', 'aboutUs'); setMobileMenuOpen(false); }}
                  className="rounded-lg bg-white border border-stone-200 p-3 text-left text-sm font-medium text-stone-800 hover:border-[#800020]"
                >
                  How Pricing Works
                </button>
                <button
                  onClick={() => { setView('policy', 'contactUs'); setMobileMenuOpen(false); }}
                  className="rounded-lg bg-white border border-stone-200 p-3 text-left text-sm font-medium text-stone-800 hover:border-[#800020]"
                >
                  Need Help?
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 font-mono">Browse Designer Brands</h3>
              <div className="space-y-1">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.id)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm text-stone-800 hover:bg-[#800020] hover:text-white transition-colors"
                  >
                    <span>{brand.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <button
                onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-3 text-sm font-medium text-[#FAF9F6] hover:bg-stone-800"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Access Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
