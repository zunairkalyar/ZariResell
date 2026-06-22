import React from 'react';
import { ShoppingBag, Star, HelpCircle, Layers, PiggyBank } from 'lucide-react';
import { PricingTier } from '../types';

interface HeroProps {
  onShopClick: () => void;
  onBrandsClick: () => void;
  onHowItWorksClick: () => void;
  tiers: PricingTier[];
}

export default function Hero({ onShopClick, onBrandsClick, onHowItWorksClick, tiers }: HeroProps) {
  // Sort tiers by minimum quantity ascending
  const sortedTiers = [...tiers].sort((a, b) => a.minQty - b.minQty);

  return (
    <div className="relative overflow-hidden bg-[#FAF9F6]">
      {/* Decorative vector background elements */}
      <div className="absolute inset-y-0 right-0 z-0 hidden w-1/2 bg-gradient-to-l from-stone-50 to-[#FAF9F6] lg:block" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-12 lg:py-24">
          
          {/* Slogan and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-[#800020] font-medium tracking-wide">
              <Star className="h-3 w-3 fill-current" />
              <span>Independent Premium Reseller Hub</span>
            </div>
            
            <h1 className="font-serif text-4xl font-extrabold tracking-tight text-[#1F1F1F] sm:text-5xl lg:text-6xl leading-[1.1]">
              Branded Women’s Clothing <br/>
              <span className="text-[#800020]">at One Simple Price</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-stone-600 font-sans leading-relaxed">
              Choose any articles from your favourite brands like Khaadi, Sapphire, J., and Maria B. Mix different designs and brands in a single checkout to automatically unlock better wholesale quantity pricing tiers!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onShopClick}
                className="inline-flex items-center gap-2 rounded-full bg-[#800020] px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:bg-[#600018] hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop All Articles
              </button>
              <button
                onClick={onBrandsClick}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold tracking-wide text-stone-800 transition-colors hover:bg-stone-50 cursor-pointer"
              >
                Explore Brand Catalogs
              </button>
            </div>

            {/* Quick operational banners */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-stone-200 text-stone-600">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold tracking-wider text-stone-700 uppercase font-mono">100% Verified Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold tracking-wider text-stone-700 uppercase font-mono">Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold tracking-wider text-stone-700 uppercase font-mono">Mixed Quantity Savings</span>
              </div>
            </div>
          </div>

          {/* Right Billboard Card: Interactive pricing schedule display */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 -m-4 rounded-3xl bg-amber-50/40 p-4 blur-xl" />
            <div className="relative rounded-2xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h2 className="text-lg font-serif font-bold text-stone-900 tracking-wide">Automatic Mixing Tier Rate</h2>
                <span className="rounded bg-[#800020]/10 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#800020]">
                  Cart Discount Rule
                </span>
              </div>

              {/* Real-time calculated pricing schedule */}
              <div className="mt-6 space-y-4">
                {sortedTiers.map((tier, idx) => {
                  let rangeText = '';
                  if (tier.maxQty === null) {
                    rangeText = `${tier.minQty}+ Pieces`;
                  } else if (tier.minQty === tier.maxQty) {
                    rangeText = `${tier.minQty} Piece`;
                  } else {
                    rangeText = `${tier.minQty}–${tier.maxQty} Pieces`;
                  }

                  return (
                    <div
                      key={tier.id}
                      className={`flex items-center justify-between rounded-xl p-4 transition-all ${
                        idx === sortedTiers.length - 1
                          ? 'bg-[#FAF9F6] border border-[#800020]/25'
                          : 'border border-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2.5 ${
                          idx === 0 
                            ? 'bg-stone-100 text-stone-600'
                            : idx === 1 
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {idx === 0 && <Layers className="h-4 w-4" />}
                          {idx === 1 && <HelpCircle className="h-4 w-4" />}
                          {idx === 2 && <PiggyBank className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 font-mono">
                            {tier.name}
                          </p>
                          <p className="text-base font-bold text-stone-900">
                            {rangeText}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-[#800020] font-sans">
                          Rs. {tier.rate.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-medium text-stone-400">
                          per piece
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center text-xs text-stone-500 font-sans">
                💡 <span className="underline decoration-[#800020] underline-offset-2">Cart Mix Rule:</span> Put unstitched items from Khaadi alongside Sapphire kurtis. We calculate discounts automatically based on total carton headcount!
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
