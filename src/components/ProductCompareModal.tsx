import React, { useState } from "react";
import { Product, Store } from "../types";
import { Search, Store as StoreIcon, ShoppingBag, X, Phone, ArrowUpDown, Tag } from "lucide-react";
import { useCartContext } from "../context/CartContext";

interface Props {
  products: Product[];
  stores: Store[];
  onClose: () => void;
  onOpenCallModal: (store: Store) => void;
}

export const ProductCompareModal: React.FC<Props> = ({
  products,
  stores,
  onClose,
  onOpenCallModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addToCart } = useCartContext();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group matching products by product name keyword to compare stores!
  const groupedByName = filteredProducts.reduce((acc, p) => {
    const key = p.name.trim().toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-3xl max-w-3xl w-full p-6 md:p-8 relative shadow-2xl max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-black">Multi-Store Product Price Compare</h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Search any product name to see all shops offering that item and compare prices instantly.
          </p>

          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products (e.g. Headphones, Earbuds, Synthesizer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>
        </div>

        {/* Search Results & Comparisons */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {Object.keys(groupedByName).length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Tag className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold">No matching products found</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching for 'Headphones' or 'Pro'.</p>
            </div>
          ) : (
            (Object.entries(groupedByName) as [string, Product[]][]).map(([groupName, prodList]) => {
              // Sort lowest price first
              const sortedList = [...prodList].sort((a, b) => a.price - b.price);
              const lowestPrice = sortedList[0].price;

              return (
                <div
                  key={groupName}
                  className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                        Available in {prodList.length} Stores
                      </span>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-white capitalize">
                        {prodList[0].name}
                      </h3>
                    </div>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold px-3 py-1 rounded-full border border-emerald-300/40">
                      From ₹{lowestPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sortedList.map((prod) => {
                      const matchedStore = stores.find((s) => s.id === prod.storeId);
                      const isBestDeal = prod.price === lowestPrice;

                      return (
                        <div
                          key={prod.id}
                          className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            isBestDeal
                              ? "bg-white dark:bg-zinc-900 border-emerald-500/50 shadow-sm"
                              : "bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                                  {prod.storeName}
                                </span>
                                {isBestDeal && (
                                  <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded">
                                    BEST PRICE
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-400">
                                Stock: {prod.inventory} units • {prod.location?.city || "NYC"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4">
                            <div className="text-right">
                              <span className="text-lg font-black text-zinc-900 dark:text-white">
                                ₹{prod.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {matchedStore && (
                                <button
                                  onClick={() => onOpenCallModal(matchedStore)}
                                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                  title="Call Store"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => addToCart(prod)}
                                className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
