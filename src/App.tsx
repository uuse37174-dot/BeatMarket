import React, { useState, useEffect } from "react";
import { LocationProvider } from "./context/LocationContext";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { CartProvider, useCartContext } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { HomeDirectoryView } from "./components/HomeDirectoryView";
import { StoreFrontView } from "./components/templates/StoreFrontView";
import { ShopkeeperDashboard } from "./components/ShopkeeperDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { CallShopkeeperModal } from "./components/CallShopkeeperModal";
import { ChatDrawer } from "./components/ChatDrawer";
import { StripeCheckoutModal } from "./components/StripeCheckoutModal";
import { AuthModal } from "./components/AuthModal";
import { ProductCompareModal } from "./components/ProductCompareModal";
import { CartSlideOver } from "./components/CartSlideOver";
import { Store } from "./types";

const MainContent: React.FC = () => {
  const { stores, products, user, isAdmin } = useAuthContext();
  const { isCheckoutOpen, setIsCheckoutOpen } = useCartContext();

  const [currentView, setCurrentView] = useState<"home" | "store" | "dashboard" | "admin">("home");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Drawers State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [callingStore, setCallingStore] = useState<Store | null>(null);
  const [chattingStore, setChattingStore] = useState<Store | null>(null);

  // Check URL query param for unique store link: e.g. ?store=noir-co
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storeHandle = params.get("store");
    if (storeHandle && stores.length > 0) {
      const match = stores.find((s) => s.handle.toLowerCase() === storeHandle.toLowerCase());
      if (match) {
        setSelectedStore(match);
        setCurrentView("store");
      }
    }
  }, [stores]);

  // When admin logs in (e.g. beatbounce181@gmail.com via Google or Email), automatically switch to Admin view
  useEffect(() => {
    if (user && isAdmin) {
      setCurrentView("admin");
      setIsAuthModalOpen(false);
    }
  }, [user, isAdmin]);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setCurrentView("store");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateView = (view: "home" | "store" | "dashboard" | "admin" | "orders") => {
    if (view === "dashboard" && !user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (view === "admin" && !isAdmin) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView(view as any);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const storeProducts = selectedStore
    ? products.filter((p) => p.storeId === selectedStore.id && !(p as any).deleted)
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <div>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
          onNavigateView={handleNavigateView}
          currentView={currentView}
        />

        <main>
          {currentView === "home" && (
            <HomeDirectoryView
              stores={stores}
              products={products}
              searchQuery={searchQuery}
              onSelectStore={handleSelectStore}
              onOpenCallModal={(s) => setCallingStore(s)}
              onOpenChatDrawer={(s) => setChattingStore(s)}
            />
          )}

          {currentView === "store" && selectedStore && (
            <StoreFrontView
              store={selectedStore}
              products={storeProducts}
              onOpenCallModal={(s) => setCallingStore(s)}
              onOpenChatDrawer={(s) => setChattingStore(s)}
            />
          )}

          {currentView === "dashboard" && <ShopkeeperDashboard />}

          {currentView === "admin" && <AdminPanel />}
        </main>
      </div>

      {/* Global Modals and Overlay Drawers */}
      <CartSlideOver />

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}

      {isCompareModalOpen && (
        <ProductCompareModal
          products={products}
          stores={stores}
          onClose={() => setIsCompareModalOpen(false)}
          onOpenCallModal={(s) => setCallingStore(s)}
        />
      )}

      {isCheckoutOpen && (
        <StripeCheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(orderId) => {
            console.log("Order confirmed:", orderId);
          }}
        />
      )}

      {callingStore && (
        <CallShopkeeperModal
          store={callingStore}
          onClose={() => setCallingStore(null)}
        />
      )}

      {chattingStore && (
        <ChatDrawer
          store={chattingStore}
          onClose={() => setChattingStore(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 px-6 mt-16 text-xs text-zinc-400 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold text-zinc-900 dark:text-white">
            Beat<span className="text-emerald-500">Market</span> — Luxury Multi-Layer Shop Marketplace
          </p>
          <p>© 2026 BeatMarket Inc. All rights reserved. Powered by Google AI Studio.</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <CartProvider>
          <MainContent />
        </CartProvider>
      </AuthProvider>
    </LocationProvider>
  );
}
