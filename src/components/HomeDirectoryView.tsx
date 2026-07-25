import React, { useState } from "react";
import { Store, Product } from "../types";
import { useAuthContext } from "../context/AuthContext";
import { useLocationContext } from "../context/LocationContext";
import { 
  MapPin, 
  Search, 
  Store as StoreIcon, 
  Phone, 
  MessageSquare, 
  Star, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Compass
} from "lucide-react";

interface Props {
  stores: Store[];
  products: Product[];
  searchQuery: string;
  onSelectStore: (store: Store) => void;
  onOpenCallModal: (store: Store) => void;
  onOpenChatDrawer: (store: Store) => void;
}

export const HomeDirectoryView: React.FC<Props> = ({
  stores,
  products,
  searchQuery,
  onSelectStore,
  onOpenCallModal,
  onOpenChatDrawer
}) => {
  const { siteSettings } = useAuthContext();
  const { calculateDistanceKm, locationName, detectLocation } = useLocationContext();

  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>("All");

  // Filter stores based on search query (store name, description, address, or products)
  const filteredStores = stores.filter((store) => {
    const matchesQuery =
      store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      products.some(
        (p) =>
          p.storeId === store.id &&
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTemplate =
      selectedTemplateFilter === "All" || store.template === selectedTemplateFilter;

    return matchesQuery && matchesTemplate;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      {/* Hero Header Section */}
      <div className="relative w-full h-[400px] md:h-[480px] bg-black overflow-hidden flex items-center">
        <img
          src={siteSettings.heroBanner}
          alt="BeatMarket Hero"
          className="w-full h-full object-cover opacity-50 scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 w-full text-center md:text-left flex flex-col items-center md:items-start justify-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Multi-Store Luxury Marketplace
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Discover Exclusive Audio & Luxury Shops Near You.
          </h1>

          <p className="text-sm md:text-base text-zinc-300 max-w-2xl mt-4 leading-relaxed">
            Every storekeeper gets their unique store link, custom 3D swipe showcases, 5 luxury templates, and direct voice & chat lines.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={detectLocation}
              className="px-6 py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 shadow-xl transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              Find Stores Near {locationName}
            </button>
          </div>
        </div>
      </div>

      {/* Main Directory & Location Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Template & Location Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Luxury Store Directory</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Showing {filteredStores.length} shops offering high-fidelity audio & studio gear.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {["All", "monochrome", "midnight", "boutique", "platinum", "cyber"].map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setSelectedTemplateFilter(tmpl)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  selectedTemplateFilter === tmpl
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tmpl === "All" ? "All Templates" : `${tmpl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map((store) => {
            const distance = calculateDistanceKm(store.location.lat, store.location.lng);
            const storeProductCount = products.filter((p) => p.storeId === store.id).length;

            return (
              <div
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Store Banner */}
                  <div className="relative h-48 bg-zinc-900 overflow-hidden">
                    <img
                      src={store.bannerImage}
                      alt={store.storeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Template Badge & Distance */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-widest bg-black/80 text-white px-2.5 py-1 rounded-full border border-white/20">
                        {store.template}
                      </span>
                      {distance !== null && (
                        <span className="text-[10px] bg-emerald-950/90 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {distance} km
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-black/80 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-500/30">
                      <Star className="w-3 h-3 fill-amber-300" /> {store.rating}
                    </div>

                    {/* Logo Overlay */}
                    <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-900 bg-black shadow-lg">
                      <img
                        src={store.logoImage}
                        alt={store.storeName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="p-6 pt-8">
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-emerald-500 transition-colors">
                      {store.storeName}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {store.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{store.location.address}, {store.location.city}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800/80 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">
                    {storeProductCount} Products Available
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCallModal(store);
                      }}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      title="Call Shopkeeper"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChatDrawer(store);
                      }}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      title="Message Shopkeeper"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectStore(store)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      Visit Shop <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
