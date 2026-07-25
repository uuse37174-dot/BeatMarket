import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Store, Product, StoreTemplate } from "../types";
import { 
  Store as StoreIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Bell, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  MessageSquare, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Layout, 
  MapPin,
  Clock
} from "lucide-react";

interface Props {
  onOpenCallCustomer?: (phone: string) => void;
}

export const ShopkeeperDashboard: React.FC<Props> = () => {
  const { 
    user, 
    stores, 
    products, 
    storeOrders, 
    assistedStore, 
    createOrUpdateStore, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus 
  } = useAuthContext();

  // Active store being managed (either user's own store or admin-assisted store)
  const currentStore = assistedStore || stores.find((s) => s.ownerId === user?.uid) || null;

  const [activeTab, setActiveTab] = useState<"products" | "store_settings" | "orders">("products");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Store form state
  const [storeName, setStoreName] = useState<string>(currentStore?.storeName || "");
  const [handle, setHandle] = useState<string>(currentStore?.handle || "");
  const [description, setDescription] = useState<string>(currentStore?.description || "");
  const [bannerImage, setBannerImage] = useState<string>(currentStore?.bannerImage || "");
  const [logoImage, setLogoImage] = useState<string>(currentStore?.logoImage || "");
  const [template, setTemplate] = useState<StoreTemplate>(currentStore?.template || "monochrome");
  const [phoneNumber, setPhoneNumber] = useState<string>(currentStore?.phoneNumber || "");
  const [address, setAddress] = useState<string>(currentStore?.location.address || "");
  const [city, setCity] = useState<string>(currentStore?.location.city || "");
  const [savingStore, setSavingStore] = useState<boolean>(false);
  const [storeSuccessMsg, setStoreSuccessMsg] = useState<string>("");

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState<string>("");
  const [prodDesc, setProdDesc] = useState<string>("");
  const [prodPrice, setProdPrice] = useState<string>("");
  const [prodOrigPrice, setProdOrigPrice] = useState<string>("");
  const [prodCategory, setProdCategory] = useState<string>("Headphones");
  const [prodImage, setProdImage] = useState<string>("");
  const [prodInventory, setProdInventory] = useState<string>("10");

  const handleCopyLink = () => {
    if (!currentStore) return;
    const link = `${window.location.origin}?store=${currentStore.handle}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStore(true);
    try {
      await createOrUpdateStore({
        storeName,
        handle: handle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        description,
        bannerImage,
        logoImage,
        template,
        phoneNumber,
        location: {
          address,
          city,
          lat: currentStore?.location.lat || 40.7128,
          lng: currentStore?.location.lng || -74.0060
        }
      });
      setStoreSuccessMsg("Store profile and customization saved!");
      setTimeout(() => setStoreSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingStore(false);
    }
  };

  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProductId(prod.id);
      setProdName(prod.name);
      setProdDesc(prod.description);
      setProdPrice(prod.price.toString());
      setProdOrigPrice(prod.originalPrice ? prod.originalPrice.toString() : "");
      setProdCategory(prod.category);
      setProdImage(prod.images[0] || "");
      setProdInventory(prod.inventory.toString());
    } else {
      setEditingProductId(null);
      setProdName("");
      setProdDesc("");
      setProdPrice("");
      setProdOrigPrice("");
      setProdCategory("Headphones");
      setProdImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
      setProdInventory("10");
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore) return;

    const priceNum = parseFloat(prodPrice) || 0;
    const origPriceNum = prodOrigPrice ? parseFloat(prodOrigPrice) : undefined;
    const invNum = parseInt(prodInventory, 10) || 1;

    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: prodName,
        description: prodDesc,
        price: priceNum,
        originalPrice: origPriceNum,
        category: prodCategory,
        images: [prodImage],
        inventory: invNum
      });
    } else {
      await addProduct({
        storeId: currentStore.id,
        storeHandle: currentStore.handle,
        storeName: currentStore.storeName,
        name: prodName,
        description: prodDesc,
        price: priceNum,
        originalPrice: origPriceNum,
        category: prodCategory,
        images: [prodImage],
        inventory: invNum,
        location: currentStore.location
      });
    }
    setIsProductModalOpen(false);
  };

  const myProducts = currentStore
    ? products.filter((p) => p.storeId === currentStore.id && !(p as any).deleted)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white rounded-3xl p-6 md:p-8 mb-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
        {assistedStore && (
          <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Admin Assisting Mode (Session ID: {assistedStore.sessionId})
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-white/20 shrink-0">
              <img
                src={currentStore?.logoImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"}
                alt="Store Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                {currentStore ? currentStore.storeName : "Create Your Luxury Store"}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {currentStore ? `Unique Store Link: beatmarket.com?store=${currentStore.handle}` : "Setup your shop, set custom template, and list products."}
              </p>
              {currentStore && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono px-2.5 py-0.5 rounded border border-zinc-700">
                    Session ID: {currentStore.sessionId}
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800 uppercase">
                    {currentStore.template} TEMPLATE
                  </span>
                </div>
              )}
            </div>
          </div>

          {currentStore && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={`?store=${currentStore.handle}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-md"
              >
                <ExternalLink className="w-4 h-4" /> Live Preview
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === "products"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Layers className="w-4 h-4" /> Product Inventory ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap relative ${
            activeTab === "orders"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Bell className="w-4 h-4" /> Live Store Orders ({storeOrders.length})
          {storeOrders.some((o) => o.status === "pending") && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("store_settings")}
          className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === "store_settings"
              ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Layout className="w-4 h-4" /> Store Customization & 5 Templates
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Catalog Items</h2>
              <p className="text-xs text-zinc-500">Manage real-time inventory and pricing.</p>
            </div>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="h-44 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 mb-3 relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{p.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{p.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black">${p.price}</span>
                    <span className="text-xs text-zinc-400 ml-2">Stock: {p.inventory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProductModal(p)}
                      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Incoming Customer Orders</h2>
            <p className="text-xs text-zinc-500">Real-time alerts for orders placed at your shop.</p>
          </div>

          {storeOrders.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">No Orders Yet</p>
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
                        {item.quantity}x {item.productName} (${item.price})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className="text-2xl font-black">${order.totalAmount.toFixed(2)}</span>
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

      {/* STORE SETTINGS TAB */}
      {activeTab === "store_settings" && (
        <form onSubmit={handleSaveStore} className="max-w-3xl space-y-6 text-xs">
          {storeSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold">
              {storeSuccessMsg}
            </div>
          )}

          {/* Template Picker */}
          <div>
            <label className="block text-sm font-extrabold mb-2">
              Select 1 of 5 Luxury Storefront Templates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: "monochrome", title: "Monochrome Minimalist", desc: "Ultra-clean B&W luxury gallery" },
                { id: "midnight", title: "Midnight Onyx", desc: "Velvet dark gold luxury palette" },
                { id: "boutique", title: "Boutique Atelier", desc: "High-fashion editorial layout" },
                { id: "platinum", title: "Platinum Chrono", desc: "Metallic glass-morphism cards" },
                { id: "cyber", title: "CyberPulse Underground", desc: "Stark monochrome dark grid" }
              ].map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id as StoreTemplate)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    template === tmpl.id
                      ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 shadow-md"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider block">{tmpl.title}</span>
                  <span className="text-[10px] text-zinc-500 mt-1 block">{tmpl.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Store Handle (URL Slug)</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Banner Image URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Logo / Profile Image URL</label>
              <input
                type="text"
                value={logoImage}
                onChange={(e) => setLogoImage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1">Contact Phone</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">City, State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingStore}
            className="px-8 py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all"
          >
            {savingStore ? "Saving Customizations..." : "Save Store Customizations"}
          </button>
        </form>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl text-zinc-900 dark:text-white">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-black mb-4">
              {editingProductId ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold"
                >
                  <option value="Headphones">Headphones</option>
                  <option value="Speakers">Speakers</option>
                  <option value="Amplifiers">Amplifiers</option>
                  <option value="Synthesizers">Synthesizers</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Orig. Price ($)</label>
                  <input
                    type="number"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Stock Inv.</label>
                  <input
                    type="number"
                    required
                    value={prodInventory}
                    onChange={(e) => setProdInventory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Direct Image URL</label>
                <input
                  type="text"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs uppercase tracking-wider shadow-md"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
