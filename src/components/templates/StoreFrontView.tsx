import React, { useState } from "react";
import { Store, Product } from "../../types";
import { ProductSwiper3D } from "../3DProductSwiper";
import { Phone, MessageSquare, MapPin, Star, Share2, ShoppingBag, Eye, Copy, Check } from "lucide-react";
import { useCartContext } from "../../context/CartContext";
import { useLocationContext } from "../../context/LocationContext";

interface Props {
  store: Store;
  products: Product[];
  onOpenCallModal: (store: Store) => void;
  onOpenChatDrawer: (store: Store) => void;
}

export const StoreFrontView: React.FC<Props> = ({
  store,
  products,
  onOpenCallModal,
  onOpenChatDrawer
}) => {
  const { addToCart } = useCartContext();
  const { calculateDistanceKm } = useLocationContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copied, setCopied] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const distance = calculateDistanceKm(store.location.lat, store.location.lng);

  const handleCopyLink = () => {
    const link = `${window.location.origin}?store=${store.handle}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Template-specific styling classes
  const getTemplateStyles = () => {
    switch (store.template) {
      case "midnight":
        return {
          bg: "bg-zinc-950 text-zinc-100",
          card: "bg-zinc-900 border-zinc-800 hover:border-amber-500/50",
          accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          button: "bg-amber-400 text-zinc-950 hover:bg-amber-300 font-bold",
          border: "border-zinc-800"
        };
      case "boutique":
        return {
          bg: "bg-[#fcfbf7] text-zinc-900",
          card: "bg-white border-zinc-200/80 shadow-sm hover:shadow-md",
          accent: "text-amber-900 bg-amber-100/60 border-amber-200",
          button: "bg-zinc-900 text-white hover:bg-black font-serif",
          border: "border-zinc-200"
        };
      case "platinum":
        return {
          bg: "bg-slate-950 text-slate-100",
          card: "bg-slate-900/80 backdrop-blur border-slate-800 hover:border-slate-600 shadow-xl",
          accent: "text-cyan-400 bg-cyan-950/50 border-cyan-800",
          button: "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 hover:from-white hover:to-slate-300 font-bold",
          border: "border-slate-800"
        };
      case "cyber":
        return {
          bg: "bg-black text-white font-mono",
          card: "bg-zinc-900 border-2 border-zinc-800 hover:border-white",
          accent: "text-emerald-400 bg-emerald-950 border-emerald-800",
          button: "bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-wider",
          border: "border-zinc-800"
        };
      case "monochrome":
      default:
        return {
          bg: "bg-white text-zinc-900",
          card: "bg-white border border-zinc-200 hover:border-zinc-900 shadow-sm",
          accent: "text-zinc-900 bg-zinc-100 border-zinc-300",
          button: "bg-zinc-900 text-white hover:bg-black font-semibold",
          border: "border-zinc-200"
        };
    }
  };

  const t = getTemplateStyles();

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
      {/* Store Banner & Header */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden bg-zinc-900">
        <img
          src={store.bannerImage}
          alt={store.storeName}
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Store Share & Badge Bar */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/30 transition-all shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Link Copied!" : "Share Store Link"}
          </button>
        </div>

        {/* Store Information Overlay */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-black shrink-0">
              <img
                src={store.logoImage}
                alt={store.storeName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold border ${t.accent}`}>
                  {store.template.toUpperCase()} TEMPLATE
                </span>
                {distance !== null && (
                  <span className="text-xs bg-black/60 text-emerald-400 backdrop-blur px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-emerald-500/30">
                    <MapPin className="w-3 h-3" /> {distance} km away
                  </span>
                )}
                <span className="text-xs bg-black/60 text-amber-300 backdrop-blur px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-300" /> {store.rating}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mt-2">
                {store.storeName}
              </h1>
              <p className="text-xs md:text-sm text-zinc-300 max-w-2xl mt-1 line-clamp-2">
                {store.description}
              </p>
              <p className="text-xs text-zinc-400 flex items-center gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5" /> {store.location.address}, {store.location.city}
              </p>
            </div>
          </div>

          {/* Direct Contact Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenCallModal(store)}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              Call Shopkeeper
            </button>
            <button
              onClick={() => onOpenChatDrawer(store)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold text-xs flex items-center gap-2 border border-white/20 shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Message Shop
            </button>
          </div>
        </div>
      </div>

      {/* 3D Product Swiper Section if enabled */}
      {store.enable3DSwipe && products.length > 0 && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-500/5">
          <ProductSwiper3D
            products={products}
            onSelectProduct={(p) => setQuickViewProduct(p)}
            onCallShopkeeper={() => onOpenCallModal(store)}
          />
        </div>
      )}

      {/* Main Store Catalog Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between gap-4 mb-8 border-b pb-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? t.button
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${t.card}`}
            >
              <div>
                <div className="relative h-56 bg-zinc-100 dark:bg-zinc-900 overflow-hidden group">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/80 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {product.inventory < 5 && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Only {product.inventory} Left
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                    {product.category}
                  </span>
                  <h3 className="text-base font-bold tracking-tight mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-zinc-100 dark:border-zinc-800/60 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xl font-extrabold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-zinc-400 line-through ml-2">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm ${t.button}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xl font-bold p-2"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 md:h-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-zinc-400">
                    {quickViewProduct.category} • {store.storeName}
                  </span>
                  <h2 className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">
                    {quickViewProduct.name}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">
                      ${quickViewProduct.price}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-zinc-400 line-through">
                        ${quickViewProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      onOpenCallModal(store);
                    }}
                    className="p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    title="Call Shopkeeper"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
