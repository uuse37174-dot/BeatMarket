import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useLocationContext } from "../context/LocationContext";
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  User, 
  Store as StoreIcon, 
  ShieldCheck, 
  ArrowUpDown, 
  LogOut, 
  Sparkles, 
  Menu, 
  X,
  Compass
} from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAuthModal: () => void;
  onOpenCompareModal: () => void;
  onNavigateView: (view: "home" | "store" | "dashboard" | "admin" | "orders") => void;
  currentView: string;
}

export const Navbar: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  onOpenAuthModal,
  onOpenCompareModal,
  onNavigateView,
  currentView
}) => {
  const { user, isAdmin, siteSettings, logout } = useAuthContext();
  const { totalItems, setIsCartOpen } = useCartContext();
  const { isDetecting, detectLocation } = useLocationContext();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Top Announcement Bar */}
      {siteSettings.announcement && (
        <div className="bg-zinc-900 text-zinc-200 text-[10px] sm:text-[11px] font-bold py-1.5 px-3 text-center tracking-widest uppercase flex items-center justify-center gap-1.5 overflow-hidden">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">{siteSettings.announcement}</span>
        </div>
      )}

      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setIsMenuOpen(false);
            onNavigateView("home");
          }}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center shadow-md shrink-0">
            <img
              src={siteSettings.siteLogo}
              alt="BeatMarket Logo"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-base sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase font-sans leading-tight">
              Beat<span className="text-emerald-500">Market</span>
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-zinc-400 hidden sm:block font-semibold leading-none mt-0.5">
              Multi-Store Luxury Directory
            </span>
          </div>
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg items-center relative">
          <Search className="w-4 h-4 absolute left-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products or stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-24 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
          />
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="absolute right-1.5 px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold flex items-center gap-1 transition-all"
            title="Detect GPS Nearby Stores"
          >
            <MapPin className="w-3 h-3 text-emerald-500" />
            {isDetecting ? "..." : "GPS"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Admin Console Direct Button */}
          {isAdmin && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateView("admin");
              }}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
                currentView === "admin"
                  ? "bg-amber-500 text-black shadow-amber-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">Admin</span>
            </button>
          )}

          {/* Price Compare Button (Desktop / Tablet) */}
          <button
            onClick={onOpenCompareModal}
            className="hidden sm:flex px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="hidden lg:inline">Compare</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:p-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all shadow-md flex items-center gap-1.5 font-bold text-xs shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {totalItems > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Profile Menu (Desktop) */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all"
              >
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-xs font-bold text-zinc-900 dark:text-white max-w-[90px] truncate">
                  {user.displayName}
                </span>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 text-xs space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="font-extrabold text-zinc-900 dark:text-white truncate">{user.displayName}</p>
                    <p className="text-[10px] text-zinc-400 capitalize">{user.role} Account</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onNavigateView("home");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" /> Discover Stores
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onNavigateView("dashboard");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold flex items-center gap-2 text-zinc-900 dark:text-white"
                  >
                    <StoreIcon className="w-4 h-4 text-emerald-500" /> Shopkeeper Portal
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigateView("admin");
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500" /> Master Admin Console
                    </button>
                  )}

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-rose-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="hidden sm:block px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-all shadow-sm"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          {/* Mobile Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products or stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold"
            >
              GPS
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateView("home");
              }}
              className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-500" /> Discover
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenCompareModal();
              }}
              className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4 text-emerald-500" /> Compare
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateView("dashboard");
              }}
              className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 col-span-2"
            >
              <StoreIcon className="w-4 h-4 text-emerald-500" /> Shopkeeper Portal
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateView("admin");
                }}
                className="p-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 col-span-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" /> Open Master Admin Console
              </button>
            )}

            {user ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 col-span-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({user.displayName})
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="p-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs flex items-center justify-center gap-2 col-span-2"
              >
                <User className="w-4 h-4" /> Sign In / Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
