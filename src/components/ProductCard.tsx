import React, { useState } from 'react';
import { Eye, Plus, ShoppingCart, Info, TrendingUp } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product, selectedSize: string, selectedColor: string) => void;
}

export default function ProductCard({ product, onProductClick, onQuickAdd }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Collect unique sizes and colors
  const sizes = Array.from(new Set(product.variants.map(v => v.size)));
  const colors = Array.from(new Set(product.variants.map(v => v.color)));

  // Pick first size and color automatically if none select, or let customer select
  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!selectedSize && sizes.length > 1) {
      setErrorMsg('Please select a size first');
      return;
    }
    
    const chosenSize = selectedSize || sizes[0];
    const chosenColor = selectedColor || colors[0];

    // Check inventory
    const variant = product.variants.find(v => v.size === chosenSize && v.color === chosenColor);
    if (!variant || variant.stock <= 0) {
      setErrorMsg('Selected combination is out of stock.');
      return;
    }

    setErrorMsg('');
    onQuickAdd(product, chosenSize, chosenColor);
  };

  // Check general stock status across all variants
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  let overallStockBadge = null;

  if (totalStock === 0) {
    overallStockBadge = <span className="rounded-md bg-stone-100 text-stone-500 border border-stone-200 px-2 py-0.5 text-[10px] font-mono uppercase font-semibold">Out of Stock</span>;
  } else if (totalStock <= 4) {
    overallStockBadge = <span className="rounded-md bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 text-[10px] font-mono uppercase font-bold">Only {totalStock} Left</span>;
  } else {
    overallStockBadge = <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-mono uppercase font-bold">In Stock</span>;
  }

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-[#800020]/20 cursor-pointer"
    >
      {/* Product Image Holder */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Brand Overlay Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="rounded bg-stone-950 px-2.5 py-1 text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#FAF9F6]">
            {product.brandName}
          </span>
          {product.newArrival && (
            <span className="rounded bg-[#800020] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white">
              New Arrival
            </span>
          )}
        </div>

        {/* Hover Utilities overlay */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
          <span className="rounded-full bg-[#FAF9F6] p-3 text-stone-950 shadow-lg hover:scale-110 transition-transform duration-200">
            <Eye className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Product Card Text and Info */}
      <div className="flex flex-col flex-grow p-4">
        {/* SKU and Stock Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] tracking-wider text-stone-400 font-bold uppercase">
            SKU: {product.code}
          </span>
          {overallStockBadge}
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 font-serif text-sm font-bold text-stone-900 group-hover:text-[#800020] transition-colors mb-1">
          {product.title}
        </h3>

        {/* Category & Pieces snapshot */}
        <p className="text-xs text-stone-500 font-sans mb-3">
          {product.pieces} Unstitched Suit • {product.fabric}
        </p>

        {/* MANDATORY EXPLICIT PRICING BLOCK */}
        <div className="mb-4 rounded-lg bg-stone-50 p-2.5 border border-stone-100">
          <p className="text-xs font-semibold text-[#800020]">
            Price starts from Rs. 1,800 per piece
          </p>
          
          <div className="mt-1.5 grid grid-cols-3 gap-1 border-t border-stone-200/50 pt-1 text-[9px] text-[#1F1F1F] font-mono leading-tight">
            <div>
              <span className="block text-stone-400">1 Piece</span>
              <span className="font-bold">Rs. 2,000</span>
            </div>
            <div>
              <span className="block text-stone-400">5+ Qty</span>
              <span className="font-bold">Rs. 1,900 ea</span>
            </div>
            <div>
              <span className="block text-stone-400">10+ Qty</span>
              <span className="font-bold">Rs. 1,800 ea</span>
            </div>
          </div>
        </div>

        {/* Variant quick selects */}
        {totalStock > 0 && (
          <div className="mb-3 space-y-2 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] font-medium text-stone-400 mr-1 font-sans">Size:</span>
              {sizes.map(size => {
                const totalStockForSize = product.variants
                  .filter(v => v.size === size)
                  .reduce((sum, v) => sum + v.stock, 0);

                const isSelected = selectedSize === size;
                
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={totalStockForSize <= 0}
                    onClick={() => { setSelectedSize(size); setErrorMsg(''); }}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-sans font-medium transition-all ${
                      totalStockForSize <= 0 
                        ? 'border border-dashed border-stone-200 text-stone-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-stone-900 text-white border border-stone-900'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-[#800020]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Actions & Error message feedback */}
        {errorMsg && (
          <p className="text-[10px] font-semibold text-red-600 mb-2 font-sans">
            {errorMsg}
          </p>
        )}

        <div className="mt-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={totalStock === 0}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold tracking-wide transition-all ${
              totalStock === 0
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-stone-900 text-white hover:bg-[#800020] hover:scale-[1.02]'
            }`}
          >
            <Plus className="h-3 w-3" />
            Quick Add
          </button>
        </div>
      </div>
    </div>
  );
}
