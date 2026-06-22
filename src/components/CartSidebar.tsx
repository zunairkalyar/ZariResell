import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { OrderItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  totalPieces: number;
  ratePerPiece: number;
  subtotal: number;
  shippingCost: number;
  finalTotal: number;
  savings: number;
  nextTierMessage: string;
  hasUnlockedBest: boolean;
  onUpdateQty: (productId: string, size: string, color: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string, color: string) => void;
  onCheckoutClick: () => void;
  whatsappNumber: string;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  totalPieces,
  ratePerPiece,
  subtotal,
  shippingCost,
  finalTotal,
  savings,
  nextTierMessage,
  hasUnlockedBest,
  onUpdateQty,
  onRemoveItem,
  onCheckoutClick,
  whatsappNumber
}: CartSidebarProps) {
  if (!isOpen) return null;

  // Generate Whatsapp formatted text message
  const handleOrderViaWhatsApp = () => {
    let orderDetailsText = `Hello Zari Resell, I want to place an order:\n\n`;
    
    cartItems.forEach((item, idx) => {
      orderDetailsText += `${idx + 1}. Brand: *${item.brandName}*\n`;
      orderDetailsText += `   Article: *${item.productName}* (${item.code})\n`;
      orderDetailsText += `   Variant: Size ${item.size} / ${item.color}\n`;
      orderDetailsText += `   Quantity: ${item.quantity}\n\n`;
    });

    orderDetailsText += `*SUMMARY*:\n`;
    orderDetailsText += `Total Pieces: *${totalPieces}*\n`;
    orderDetailsText += `Applied Rate: *Rs. ${ratePerPiece.toLocaleString()} per piece*\n`;
    orderDetailsText += `Subtotal: *Rs. ${subtotal.toLocaleString()}*\n`;
    orderDetailsText += `Shipping: *Rs. ${shippingCost === 0 ? 'FREE' : shippingCost.toLocaleString()}*\n`;
    orderDetailsText += `*GRAND TOTAL: Rs. ${finalTotal.toLocaleString()}*\n\n`;
    orderDetailsText += `Please help me confirm my order details!`;

    const encodedText = encodeURIComponent(orderDetailsText);
    const sanitizedNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    const finalUrl = `https://wa.me/${sanitizedNumber}?text=${encodedText}`;
    window.open(finalUrl, '_blank');
  };

  // Determine progress percentage
  let progressPercentage = 0;
  if (totalPieces > 0) {
    if (totalPieces < 5) {
      progressPercentage = (totalPieces / 5) * 50; // Progress toward 5 pieces
    } else if (totalPieces < 10) {
      progressPercentage = 50 + ((totalPieces - 5) / 5) * 50; // Progress toward 10 pieces
    } else {
      progressPercentage = 100;
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-stone-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-250 px-6 py-5 bg-stone-900 text-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-stone-300" />
              <h2 className="text-lg font-serif font-bold tracking-wide">Your Smart Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dynamic Mix Progress & Tiers Indicator */}
          {totalPieces > 0 && (
            <div className="bg-amber-50 border-b border-amber-200/60 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-1.5 font-sans">
                <span>Quantity-Pricing Tier Level:</span>
                <span className="text-[#800020] font-mono font-bold">
                  {totalPieces < 5 ? 'Standard Tier 1' : totalPieces < 10 ? 'Discount Tier 2' : 'Wholesale Tier 3'}
                </span>
              </div>
              
              {/* Progress Slider */}
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden mb-2 relative">
                <div 
                  className={`h-full transition-all duration-300 ${
                    totalPieces < 5 
                      ? 'bg-amber-500' 
                      : totalPieces < 10 
                      ? 'bg-amber-600' 
                      : 'bg-[#800020]'
                  }`} 
                  style={{ width: `${progressPercentage}%` }}
                />
                {/* Milestone tick marks */}
                <span className="absolute left-[50%] top-0 h-full w-[2px] bg-white opacity-40" />
              </div>

              {/* Progress dynamic text label */}
              <div className="flex items-center justify-between text-xs text-stone-700">
                <p className="font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#800020] animate-bounce" />
                  {nextTierMessage}
                </p>
                <span className="font-mono font-bold text-[#800020] text-sm">
                  Rs. {ratePerPiece.toLocaleString()}/pc
                </span>
              </div>

              {savings > 0 && (
                <div className="mt-2 text-center text-xs font-bold font-mono text-emerald-700 bg-emerald-50 py-1 rounded border border-emerald-150">
                  🎉 Mixed Mix Saving: Rs. {savings.toLocaleString()} saved!
                </div>
              )}
            </div>
          )}

          {/* Cart item listing container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingBag className="h-14 w-14 text-stone-300 stroke-1 mb-4" />
                <h3 className="font-serif text-lg font-bold text-stone-800">Your cart is currently empty</h3>
                <p className="mt-1 text-sm text-stone-500 max-w-xs">
                  Mix & match multiple designer suits across Sapphire, Khaadi, Limelight & more to unlock the wholesale rate!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-[#800020] px-5 py-2 text-xs font-bold text-white uppercase tracking-wider"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {cartItems.map((item, idx) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex py-4 gap-4">
                    {/* Seeded design thumbnail image or custom placeholder */}
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded border border-stone-200 bg-stone-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-stone-200 flex items-center justify-center font-serif text-stone-500 text-xs font-bold">
                          👔
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-sm font-semibold text-stone-900 leading-tight">
                          <h4 className="font-serif">{item.productName}</h4>
                          <p className="text-stone-900 font-sans font-extrabold ml-2 text-right">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-stone-500 font-sans font-medium flex gap-2">
                          <span className="font-extrabold text-stone-700 uppercase tracking-wide bg-stone-100 px-1.5 py-0.5 rounded">{item.brandName}</span>
                          <span>Size: {item.size} / {item.color}</span>
                        </p>
                        <p className="text-[10px] font-mono text-stone-400 mt-1">
                          Article Code: {item.code}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Incrementation panel */}
                        <div className="flex items-center border border-stone-300 rounded bg-white">
                          <button
                            onClick={() => onUpdateQty(item.productId, item.size, item.color, -1)}
                            className="p-1 px-2 text-stone-600 hover:bg-stone-50 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.productId, item.size, item.color, 1)}
                            className="p-1 px-2 text-stone-600 hover:bg-stone-50 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.productId, item.size, item.color)}
                          className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing computations totals block */}
          {cartItems.length > 0 && (
            <div className="border-t border-stone-250 bg-white p-6 space-y-4">
              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between text-stone-600">
                  <span>Selected Pieces</span>
                  <span className="font-bold underline text-stone-900">{totalPieces} {totalPieces === 1 ? 'Piece' : 'Pieces'}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Price per Piece (Tier rate)</span>
                  <span className="font-bold text-[#800020]">Rs. {ratePerPiece.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping Cost</span>
                  <span className="font-bold text-stone-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs">FREE</span>
                    ) : (
                      `Rs. ${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-[#800020] font-sans font-bold bg-[#800020]/5 p-2 rounded text-xs border border-[#800020]/15">
                    <span>You Saved (Bulk Discount)</span>
                    <span>- Rs. {savings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-950 font-serif">
                  <span>Total Payable Amount</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Mixed Checkouts Options Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={onCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#800020] py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-[#600018] shadow-md cursor-pointer"
                >
                  Proceed to Direct Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleOrderViaWhatsApp}
                  className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-emerald-600 bg-white py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-50 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 fill-emerald-600 text-white" />
                  Order Instantly on WhatsApp
                </button>
              </div>

              <p className="text-[10px] text-center text-stone-400 font-sans leading-tight">
                ℹ️ Rates reflect standard reseller pricing guidelines. All items confirm in real-time as per secure backend warehouse allocations.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
