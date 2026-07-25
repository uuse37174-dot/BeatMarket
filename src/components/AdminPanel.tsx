import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Store, Product, StoreTemplate } from "../types";
import { 
  ShieldCheck, 
  Search, 
  Key, 
  Store as StoreIcon, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  ShoppingBag,
  Bell,
  MapPin,
  X,
  ExternalLink,
  RefreshCw
} from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { 
    stores, 
    products, 
    siteSettings, 
    assistedStoreBySessionId, 
    assistedStore, 
    setAssistedStore, 
    updateSiteSettings,
    adminCreateStore,
    adminUpdateStore,
    adminDeleteStore,
    addProduct,
    updateProduct,
    deleteProduct,
    storeOrders,
    updateOrderStatus
  } = useAuthContext();

  const [adminTab, setAdminTab] = useState<"shops" | "orders" | "branding" | "session_assist">("shops");

  // Shop Search & Filters
  const [shopSearchQuery, setShopSearchQuery] = useState<string>("");

  // Create Store Modal State
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState<boolean>(false);
  const [newStoreName, setNewStoreName] = useState<string>("");
  const [newStoreHandle, setNewStoreHandle] = useState<string>("");
  const [newStoreDesc, setNewStoreDesc] = useState<string>("");
  const [newStoreTemplate, setNewStoreTemplate] = useState<StoreTemplate>("monochrome");
  const [newStorePhone, setNewStorePhone] = useState<string>("+91 98765 43210");
  const [newStoreAddress, setNewStoreAddress] = useState<string>("M.G. Road");
  const [newStoreCity, setNewStoreCity] = useState<string>("Mumbai, MH");
  const [newStoreLogo, setNewStoreLogo] = useState<string>("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80");
  const [newStoreBanner, setNewStoreBanner] = useState<string>("https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80");
  const [newStoreSessionId, setNewStoreSessionId] = useState<string>(`BM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [createStoreMsg, setCreateStoreMsg] = useState<string>("");

  // Edit Store Modal State
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editStoreName, setEditStoreName] = useState<string>("");
  const [editStoreHandle, setEditStoreHandle] = useState<string>("");
  const [editStoreDesc, setEditStoreDesc] = useState<string>("");
  const [editStoreTemplate, setEditStoreTemplate] = useState<StoreTemplate>("monochrome");
  const [editStorePhone, setEditStorePhone] = useState<string>("");
  const [editStoreAddress, setEditStoreAddress] = useState<string>("");
  const [editStoreCity, setEditStoreCity] = useState<string>("");
  const [editStoreLogo, setEditStoreLogo] = useState<string>("");
  const [editStoreBanner, setEditStoreBanner] = useState<string>("");

  // Session ID search state
  const [sessionIdSearch, setSessionIdSearch] = useState<string>("");
  const [sessionSearchMsg, setSessionSearchMsg] = useState<string>("");
  
  // Site settings form state
  const [siteLogo, setSiteLogo] = useState<string>(siteSettings.siteLogo);
  const [heroBanner, setHeroBanner] = useState<string>(siteSettings.heroBanner);
  const [announcement, setAnnouncement] = useState<string>(siteSettings.announcement);
  const [siteSavedMsg, setSiteSavedMsg] = useState<string>("");

  // Product upload modal by Admin
  const [selectedStoreForAdmin, setSelectedStoreForAdmin] = useState<Store | null>(stores[0] || null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [pName, setPName] = useState<string>("");
  const [pDesc, setPDesc] = useState<string>("");
  const [pPrice, setPPrice] = useState<string>("");
  const [pCategory, setPCategory] = useState<string>("Headphones");
  const [pImage, setPImage] = useState<string>("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
  const [pInventory, setPInventory] = useState<string>("10");

  const filteredStores = stores.filter((s) => {
    const q = shopSearchQuery.toLowerCase();
    return (
      s.storeName.toLowerCase().includes(q) ||
      s.handle.toLowerCase().includes(q) ||
      s.sessionId.toLowerCase().includes(q) ||
      s.location.city.toLowerCase().includes(q)
    );
  });

  const handleCreateNewShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    try {
      const created = await adminCreateStore({
        storeName: newStoreName.trim(),
        handle: newStoreHandle.trim() || newStoreName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        description: newStoreDesc.trim() || "Welcome to our luxury shop on BeatMarket.",
        template: newStoreTemplate,
        phoneNumber: newStorePhone.trim(),
        location: {
          address: newStoreAddress.trim() || "M.G. Road",
          city: newStoreCity.trim() || "Mumbai, MH",
          lat: 19.0760,
          lng: 72.8777
        },
        logoImage: newStoreLogo,
        bannerImage: newStoreBanner,
        sessionId: newStoreSessionId || `BM-${Math.floor(1000 + Math.random() * 9000)}`
      });

      setCreateStoreMsg(`Store "${created.storeName}" created successfully!`);
      setTimeout(() => {
        setCreateStoreMsg("");
        setIsCreateStoreModalOpen(false);
        setNewStoreName("");
        setNewStoreHandle("");
        setNewStoreDesc("");
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditStore = (store: Store) => {
    setEditingStore(store);
    setEditStoreName(store.storeName);
    setEditStoreHandle(store.handle);
    setEditStoreDesc(store.description);
    setEditStoreTemplate(store.template);
    setEditStorePhone(store.phoneNumber);
    setEditStoreAddress(store.location.address);
    setEditStoreCity(store.location.city);
    setEditStoreLogo(store.logoImage);
    setEditStoreBanner(store.bannerImage);
  };

  const handleSaveEditStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;

    await adminUpdateStore(editingStore.id, {
      storeName: editStoreName,
      handle: editStoreHandle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: editStoreDesc,
      template: editStoreTemplate,
      phoneNumber: editStorePhone,
      location: {
        ...editingStore.location,
        address: editStoreAddress,
        city: editStoreCity
      },
      logoImage: editStoreLogo,
      bannerImage: editStoreBanner
    });

    setEditingStore(null);
  };

  const handleDeleteStore = async (store: Store) => {
    if (window.confirm(`Are you sure you want to delete "${store.storeName}"? This action cannot be undone.`)) {
      await adminDeleteStore(store.id);
      if (assistedStore?.id === store.id) {
        setAssistedStore(null);
      }
    }
  };

  const handleSearchSessionId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionIdSearch.trim()) return;

    const store = await assistedStoreBySessionId(sessionIdSearch.trim());
    if (store) {
      setSessionSearchMsg(`Connected to "${store.storeName}"! You are now assisting this shopkeeper.`);
      setSelectedStoreForAdmin(store);
    } else {
      setSessionSearchMsg("Session ID not found. Please check the code.");
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({ siteLogo, heroBanner, announcement });
    setSiteSavedMsg("Global website branding and banner updated!");
    setTimeout(() => setSiteSavedMsg(""), 3000);
  };

  const handleAdminAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStore = selectedStoreForAdmin || stores[0];
    if (!targetStore) return;

    await addProduct({
      storeId: targetStore.id,
      storeHandle: targetStore.handle,
      storeName: targetStore.storeName,
      name: pName,
      description: pDesc,
      price: parseFloat(pPrice) || 0,
      category: pCategory,
      images: [pImage],
      inventory: parseInt(pInventory, 10) || 5,
      location: targetStore.location
    });

    setIsAddProductModalOpen(false);
    setPName("");
    setPDesc("");
    setPPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-black text-white rounded-3xl p-6 md:p-8 mb-8 border border-zinc-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> BeatMarket Master Platform Administrator
          </span>
          <h1 className="text-2xl md:text-3xl font-black">Admin Management Console</h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Create and manage every shop, upload catalog gear, handle customer orders, and assist shopkeepers directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {assistedStore && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-right">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Assisting Mode</span>
              <span className="text-xs font-black text-white">{assistedStore.storeName}</span>
              <button
                onClick={() => setAssistedStore(null)}
                className="mt-1.5 px-3 py-1 bg-amber-500 text-black font-bold text-[10px] rounded-lg block ml-auto hover:bg-amber-400"
              >
                Exit Assisting
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setNewStoreSessionId(`BM-${Math.floor(1000 + Math.random() * 9000)}`);
              setIsCreateStoreModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Another Shop
          </button>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setAdminTab("shops")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            adminTab === "shops"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <StoreIcon className="w-4 h-4" /> All Shops & Catalogs ({stores.length})
        </button>
        <button
          onClick={() => setAdminTab("orders")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            adminTab === "orders"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Bell className="w-4 h-4" /> Platform Orders ({storeOrders.length})
        </button>
        <button
          onClick={() => setAdminTab("session_assist")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            adminTab === "session_assist"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Key className="w-4 h-4 text-amber-500" /> Session ID Assist
        </button>
        <button
          onClick={() => setAdminTab("branding")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            adminTab === "branding"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Globe className="w-4 h-4" /> Site Branding & Banner
        </button>
      </div>

      {/* SHOPS TAB */}
      {adminTab === "shops" && (
        <div className="space-y-6">
          {/* Search Bar & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search shops by name, handle, city, or Session ID..."
                value={shopSearchQuery}
                onChange={(e) => setShopSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedStoreForAdmin(stores[0] || null);
                  setIsAddProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Upload Product for a Shop
              </button>
            </div>
          </div>

          {/* Shop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((shop) => {
              const shopProducts = products.filter((p) => p.storeId === shop.id && !(p as any).deleted);

              return (
                <div
                  key={shop.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black border border-zinc-700 shrink-0">
                          <img
                            src={shop.logoImage}
                            alt={shop.storeName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-zinc-900 dark:text-white line-clamp-1">
                            {shop.storeName}
                          </h3>
                          <p className="text-[11px] font-mono text-amber-500 font-bold">
                            Session ID: {shop.sessionId}
                          </p>
                          <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-extrabold uppercase px-2 py-0.5 rounded">
                            {shop.template} TEMPLATE
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {shop.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{shop.location.address}, {shop.location.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{shop.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200 pt-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{shopProducts.length} Items in Catalog</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditStore(shop)}
                      className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedStoreForAdmin(shop);
                        setIsAddProductModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Product
                    </button>

                    <button
                      onClick={() => handleDeleteStore(shop)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600"
                      title="Delete Shop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {adminTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">All Platform Orders ({storeOrders.length})</h2>
              <p className="text-xs text-zinc-500">Monitor and update customer order statuses globally.</p>
            </div>
          </div>

          {storeOrders.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">No Orders Placed Yet</p>
            </div>
          ) : (
            storeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-zinc-400">{order.id}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                      Store: {order.storeName}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold mt-1">{order.customerName}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-3 mt-1">
                    <span>Phone: {order.customerPhone}</span>
                    <span>Email: {order.customerEmail}</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Address: {order.deliveryAddress}</p>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg font-medium">
                        {item.quantity}x {item.productName} (₹{item.price.toLocaleString("en-IN")})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className="text-2xl font-black">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Customer
                    </a>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-bold"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SESSION ID ASSIST TAB */}
      {adminTab === "session_assist" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Shopkeeper Assistance via Session ID</h2>
              <p className="text-xs text-zinc-500">
                For shopkeepers who cannot read or write, enter their Session ID (e.g. BM-9921) to override and manage their store directly.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchSessionId} className="flex gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter Session ID (e.g. BM-9921)"
                value={sessionIdSearch}
                onChange={(e) => setSessionIdSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Access Store
            </button>
          </form>

          {sessionSearchMsg && (
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> {sessionSearchMsg}
            </p>
          )}
        </div>
      )}

      {/* BRANDING TAB */}
      {adminTab === "branding" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-emerald-500" />
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Website Global Assets & Branding</h2>
              <p className="text-xs text-zinc-500">Manage main BeatMarket logo, homepage hero banner, and announcement text.</p>
            </div>
          </div>

          {siteSavedMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              {siteSavedMsg}
            </div>
          )}

          <form onSubmit={handleSaveSiteSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">BeatMarket Main Logo Image URL</label>
              <input
                type="text"
                required
                value={siteLogo}
                onChange={(e) => setSiteLogo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Homepage Hero Banner Image URL</label>
              <input
                type="text"
                required
                value={heroBanner}
                onChange={(e) => setHeroBanner(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Top Announcement Banner</label>
              <input
                type="text"
                required
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider"
            >
              Save Global Branding
            </button>
          </form>
        </div>
      )}

      {/* CREATE NEW STORE MODAL */}
      {isCreateStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl text-zinc-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateStoreModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black mb-1">Create New Shop</h2>
            <p className="text-xs text-zinc-500 mb-6">
              Add a brand new shop to the BeatMarket multi-layer directory.
            </p>

            {createStoreMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {createStoreMsg}
              </div>
            )}

            <form onSubmit={handleCreateNewShop} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Beats Studio"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">URL Handle Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. royal-beats"
                    value={newStoreHandle}
                    onChange={(e) => setNewStoreHandle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Template Style</label>
                <select
                  value={newStoreTemplate}
                  onChange={(e) => setNewStoreTemplate(e.target.value as StoreTemplate)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold"
                >
                  <option value="monochrome">Monochrome Minimalist</option>
                  <option value="midnight">Midnight Onyx</option>
                  <option value="boutique">Boutique Atelier</option>
                  <option value="platinum">Platinum Chrono</option>
                  <option value="cyber">CyberPulse Underground</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Bespoke high-fidelity audio equipment..."
                  value={newStoreDesc}
                  onChange={(e) => setNewStoreDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={newStorePhone}
                    onChange={(e) => setNewStorePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Session ID Code</label>
                  <input
                    type="text"
                    required
                    value={newStoreSessionId}
                    onChange={(e) => setNewStoreSessionId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newStoreAddress}
                    onChange={(e) => setNewStoreAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">City, State</label>
                  <input
                    type="text"
                    required
                    value={newStoreCity}
                    onChange={(e) => setNewStoreCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Logo Image URL</label>
                <input
                  type="text"
                  required
                  value={newStoreLogo}
                  onChange={(e) => setNewStoreLogo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={newStoreBanner}
                  onChange={(e) => setNewStoreBanner(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-md mt-4"
              >
                Create Shop Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STORE MODAL */}
      {editingStore && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl text-zinc-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingStore(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black mb-1">Edit Shop: {editingStore.storeName}</h2>
            <p className="text-xs text-zinc-500 mb-6">Modify store profile details as master admin.</p>

            <form onSubmit={handleSaveEditStore} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">URL Handle Slug</label>
                  <input
                    type="text"
                    required
                    value={editStoreHandle}
                    onChange={(e) => setEditStoreHandle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Template Style</label>
                <select
                  value={editStoreTemplate}
                  onChange={(e) => setEditStoreTemplate(e.target.value as StoreTemplate)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold"
                >
                  <option value="monochrome">Monochrome Minimalist</option>
                  <option value="midnight">Midnight Onyx</option>
                  <option value="boutique">Boutique Atelier</option>
                  <option value="platinum">Platinum Chrono</option>
                  <option value="cyber">CyberPulse Underground</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editStoreDesc}
                  onChange={(e) => setEditStoreDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editStorePhone}
                    onChange={(e) => setEditStorePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={editStoreAddress}
                    onChange={(e) => setEditStoreAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">City, State</label>
                  <input
                    type="text"
                    required
                    value={editStoreCity}
                    onChange={(e) => setEditStoreCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Logo Image URL</label>
                <input
                  type="text"
                  required
                  value={editStoreLogo}
                  onChange={(e) => setEditStoreLogo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={editStoreBanner}
                  onChange={(e) => setEditStoreBanner(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs uppercase tracking-wider shadow-md mt-4"
              >
                Save Shop Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN UPLOAD PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl text-zinc-900 dark:text-white">
            <button
              onClick={() => setIsAddProductModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black mb-1">Admin Product Upload</h2>
            <p className="text-xs text-zinc-500 mb-4">Upload a product directly to any shop catalog.</p>

            <form onSubmit={handleAdminAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Target Shop Store</label>
                <select
                  value={selectedStoreForAdmin?.id}
                  onChange={(e) => {
                    const found = stores.find((s) => s.id === e.target.value);
                    if (found) setSelectedStoreForAdmin(found);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.storeName} (Session: {s.sessionId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Studio Headphones"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="18999"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Stock Inv.</label>
                  <input
                    type="number"
                    required
                    value={pInventory}
                    onChange={(e) => setPInventory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-md"
              >
                Upload Product for {selectedStoreForAdmin?.storeName}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
