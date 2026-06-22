import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface QuickAddBottomSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product, size: string, color: string, qty: number) => void;
}

export default function QuickAddBottomSheet({ product, isOpen, onClose, onAdd }: QuickAddBottomSheetProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Collect unique sizes and colors
  const sizes = product ? Array.from(new Set(product.variants.map(v => v.size))) : [];
  const colors = product ? Array.from(new Set(product.variants.map(v => v.color))) : [];

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize('');
      setSelectedColor('');
      setQty(1);
      setErrorMsg('');
      
      // Auto-select if there is only 1 choice
      if (sizes.length === 1) setSelectedSize(sizes[0]);
      if (colors.length === 1) setSelectedColor(colors[0]);
    }
  }, [product]);

  if (!product) return null;

  const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size');
      return;
    }
    if (!selectedColor) {
      setErrorMsg('Please select a color option');
      return;
    }

    const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
    if (!variant) {
      setErrorMsg('This combination is unavailable.');
      return;
    }

    if (variant.stock <= 0) {
      setErrorMsg('This choice is currently out of stock.');
      return;
    }

    if (qty > variant.stock) {
      setErrorMsg(`Only ${variant.stock} pieces left in stock.`);
      return;
    }

    onAdd(product, selectedSize, selectedColor, qty);
    setErrorMsg('');
    onClose();
  };

  // Check selected stock
  let maxAvailableStock = 99;
  if (selectedSize && selectedColor) {
    const matching = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
    if (matching) {
      maxAvailableStock = matching.stock;
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            id="quick-add-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-900"
          />

          {/* Sliding Bottom Sheet */}
          <motion.div
            id="quick-add-bottomsheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white p-6 shadow-2xl md:max-w-md md:mx-auto pb-safe font-sans max-h-[85vh] overflow-y-auto"
          >
            {/* Grab handle indicator */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-200" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#800020] bg-[#800020]/5 px-2 py-0.5 rounded">
                  {product.brandName}
                </span>
                <h3 className="mt-1 font-serif text-base font-bold text-stone-950 pr-8 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">Article Code: {product.code}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-stone-100 p-1.5 text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Sheet Body layout */}
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-b border-stone-100 py-4">
              <div className="col-span-1 rounded-lg overflow-hidden border border-stone-200 aspect-[4/5] bg-stone-50 shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="col-span-2 flex flex-col justify-between text-xs py-1">
                <div>
                  <p className="text-[#800020] font-bold text-sm">Rs. 2,000</p>
                  <p className="text-[10px] text-stone-400 mt-1">Wholesale drops to <span className="font-bold text-[#800020]">Rs. 1,800</span> on mix group volume!</p>
                </div>

                {/* Stock status indicator */}
                <div className="mt-2">
                  {totalStock === 0 ? (
                    <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-[10px]">OUT OF STOCK</span>
                  ) : (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">AVAILABLE IN STOCK</span>
                  )}
                </div>
              </div>
            </div>

            {/* SELECTIONS CONTROLS */}
            <div className="mt-4 space-y-4">
              {/* SIZES */}
              <div>
                <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block mb-2">
                  Available Size Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => {
                    const sizeStock = product.variants
                      .filter(v => v.size === size)
                      .reduce((sum, v) => sum + v.stock, 0);

                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={sizeStock <= 0}
                        onClick={() => {
                          setSelectedSize(size);
                          setErrorMsg('');
                        }}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all relative ${
                          sizeStock <= 0
                            ? 'border border-dashed border-stone-200 text-stone-300 bg-stone-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-stone-900 border border-stone-900 text-white shadow-sm'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-[#800020]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLORS */}
              <div>
                <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block mb-1.5">
                  Fabric Colorway
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          setErrorMsg('');
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#800020] text-white'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUANTITY CONSTRAINTS */}
              {selectedSize && selectedColor && maxAvailableStock > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                    Adjust Quantity
                  </span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-1 px-3 text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3.5 text-xs font-bold text-stone-900">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(maxAvailableStock, qty + 1))}
                      className="p-1 px-3 text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error view */}
            {errorMsg && (
              <p className="mt-4 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                {errorMsg}
              </p>
            )}

            {/* Add Action button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={totalStock === 0}
                className={`w-full font-serif font-bold text-center justify-center p-3.5 text-xs text-white uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 ${
                  totalStock === 0
                    ? 'bg-stone-300 text-stone-400 cursor-not-allowed shadow-none'
                    : 'bg-[#800020] hover:bg-[#600018] active:scale-95'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Add Bundle To Cart
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
