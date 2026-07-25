import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Star, Phone } from "lucide-react";
import { useCartContext } from "../context/CartContext";

interface Props {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onCallShopkeeper?: () => void;
}

export const ProductSwiper3D: React.FC<Props> = ({ products, onSelectProduct, onCallShopkeeper }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { addToCart } = useCartContext();

  if (!products || products.length === 0) return null;

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const activeProduct = products[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-4 select-none">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Interactive Showcase</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
            3D Product Swipe Gallery
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevProduct}
            className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-all shadow-sm"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextProduct}
            className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-all shadow-sm"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Stage */}
      <div className="relative h-[480px] w-full flex items-center justify-center perspective-[1200px] overflow-hidden py-4">
        {products.map((prod, idx) => {
          // Calculate relative position to current index
          let offset = idx - currentIndex;
          if (offset < -Math.floor(products.length / 2)) {
            offset += products.length;
          } else if (offset > Math.floor(products.length / 2)) {
            offset -= products.length;
          }

          const isActive = offset === 0;
          const isAbsVisible = Math.abs(offset) <= 2;

          if (!isAbsVisible) return null;

          const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
          const xOffset = offset * (isMobile ? 70 : 180);

          return (
            <motion.div
              key={prod.id}
              className="absolute w-[88%] max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden cursor-pointer"
              initial={false}
              animate={{
                x: xOffset,
                scale: isActive ? 1 : 1 - Math.abs(offset) * 0.15,
                rotateY: offset * -20,
                opacity: 1 - Math.abs(offset) * 0.35,
                zIndex: 10 - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={() => {
                if (isActive && onSelectProduct) onSelectProduct(prod);
                else setCurrentIndex(idx);
              }}
            >
              {/* Product Card Content */}
              <div className="relative h-60 bg-zinc-100 dark:bg-zinc-950 overflow-hidden group">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                  {prod.category}
                </div>
                {prod.originalPrice && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold">
                    SAVE ₹{(prod.originalPrice - prod.price).toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  {prod.storeName}
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {prod.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {prod.description}
                </p>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                      ₹{prod.price.toLocaleString("en-IN")}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through ml-2">
                        ₹{prod.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onCallShopkeeper && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCallShopkeeper();
                        }}
                        className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                        title="Call Store"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? "w-8 bg-zinc-900 dark:bg-white"
                : "w-2 bg-zinc-300 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
