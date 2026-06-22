import React, { useState } from 'react';
import { Eye, Plus, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product, selectedSize: string, selectedColor: string) => void;
  onOpenQuickAddSheet?: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick, onQuickAdd, onOpenQuickAddSheet }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Collect unique sizes and colors
  const sizes = Array.from(new Set(product.variants.map(v => v.size)));
  const colors = Array.from(new Set(product.variants.map(v => v.color)));

  const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  // Quick Add click event
  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (totalStock === 0) return;

    // If parent sheet handler exists and we're either on mobile or sizes are multiple, open the sheet
    if (onOpenQuickAddSheet) {
      onOpenQuickAddSheet(product);
      return;
    }

    if (!selectedSize && sizes.length > 1) {
      setErrorMsg('Select size or click helper');
      return;
    }
    
    const chosenSize = selectedSize || sizes[0];
    const chosenColor = selectedColor || colors[0];

    // Check inventory
    const variant = product.variants.find(v => v.size === chosenSize && v.color === chosenColor);
    if (!variant || variant.stock <= 0) {
      setErrorMsg('Out of stock');
      return;
    }

    setErrorMsg('');
    onQuickAdd(product, chosenSize, chosenColor);
  };

  // Build stock helper indicator
  let stockBadge = null;
  if (totalStock === 0) {
    stockBadge = (
      <span className="rounded bg-stone-100 text-stone-500 border border-stone-200 px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold tracking-tight">
        Sold Out
      </span>
    );
  } else if (totalStock <= 4) {
    stockBadge = (
      <span className="rounded bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 text-[9px] font-mono uppercase font-black tracking-tight animate-pulse">
        LTD QTY ({totalStock})
      </span>
    );
  } else {
    stockBadge = (
      <span className="rounded bg-stone-100 text-stone-700 border border-stone-200 px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold tracking-tight">
        In Stock
      </span>
    );
  }

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-lg hover:border-[#800020]/30 hover:translate-y-[-2px] duration-300 cursor-pointer h-full"
    >
      {/* 1. FIXED-RATIO IMAGE CONTAINER (4:5 Ratio) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Brand Overlay Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="rounded bg-stone-950/95 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-sans font-black uppercase tracking-widest text-[#FAF9F6] shadow-sm">
            {product.brandName}
          </span>
          {product.newArrival && (
            <span className="rounded bg-[#800020] px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-[#FAF9F6] shadow-sm uppercase">
              New Arrival
            </span>
          )}
        </div>

        {/* Light overlay hover utilities */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="rounded-full bg-white p-3 text-stone-950 shadow-lg hover:scale-110 active:scale-95 transition-transform duration-250">
            <Eye className="h-5 w-5 text-stone-900" />
          </span>
        </div>
      </div>

      {/* Product Content Details in column wrapper */}
      <div className="flex flex-col flex-grow p-4">
        
        {/* 2. BRAND LABEL AREA */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#800020] font-sans">
            {product.brandName}
          </span>
          {stockBadge}
        </div>

        {/* 3. PRODUCT-NAME AREA (Reserved 2-line height) */}
        <div className="h-10 mb-1 flex items-start overflow-hidden">
          <h3 className="line-clamp-2 font-serif text-xs font-bold text-stone-900 group-hover:text-[#800020] transition-colors leading-relaxed">
            {product.title}
          </h3>
        </div>

        {/* 4. ARTICLE-CODE AREA (SKU) */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1.5 font-mono">
          <span className="font-bold">Code: {product.code}</span>
          <span className="text-[9px] font-sans bg-stone-100 text-stone-600 px-1 rounded uppercase tracking-wider">{product.pieces}</span>
        </div>

        {/* 5. VARIANT AREA */}
        <div className="min-h-[22px] mb-2 text-left" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-wrap gap-1 items-center">
            {sizes.slice(0, 4).map(size => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (onOpenQuickAddSheet) {
                      onOpenQuickAddSheet(product);
                    } else {
                      setSelectedSize(size);
                    }
                  }}
                  className={`rounded text-[9px] px-1.5 py-0.5 tracking-tighter ${
                    isSelected
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-[#800020]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
            {sizes.length > 4 && (
              <span className="text-[9px] font-bold text-[#800020] cursor-pointer" onClick={() => onOpenQuickAddSheet?.(product)}>+{sizes.length - 4} sizes</span>
            )}
          </div>
        </div>

        {/* 6. PRICE AREA (Stable aligned heights) */}
        <div className="mb-3 rounded-lg bg-stone-50 border border-stone-150 p-2.5 min-h-[62px] flex flex-col justify-center text-center">
          <p className="text-[11px] font-extrabold text-[#800020] font-sans">
            From Rs. 1,800 per piece
          </p>
          <div className="mt-1 flex items-center justify-center gap-1.5 border-t border-stone-200/50 pt-1 text-[8px] font-mono tracking-tight text-stone-500">
            <span>Solo: <strong className="text-stone-850">2000</strong></span>
            <span>•</span>
            <span>5+: <strong className="text-stone-850">1900</strong></span>
            <span>•</span>
            <span>10+: <strong className="text-stone-[#800020]">1800</strong></span>
          </div>
        </div>

        {/* Error message slot */}
        {errorMsg && (
          <p className="text-[9px] font-bold text-red-600 mb-1 leading-none">{errorMsg}</p>
        )}

        {/* 7. ACTION-BUTTON AREA (Flex aligned perfectly to card bottom) */}
        <div className="mt-auto pt-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={totalStock === 0}
            className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-2.5 text-[11px] font-black uppercase tracking-wider text-white transition-all ${
              totalStock === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-stone-950 hover:bg-[#800020] hover:shadow-xs active:scale-95 duration-200'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>

      </div>
    </div>
  );
}
