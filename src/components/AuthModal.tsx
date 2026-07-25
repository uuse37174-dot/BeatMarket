import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Mail, Lock, User, Store, ShieldAlert, LogIn, Chrome, UserCheck, X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, loginAsGuest } = useAuthContext();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<"customer" | "shopkeeper">("customer");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name, role);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      const code = err?.code || "";
      if (code === "auth/unauthorized-domain") {
        setError(
          `Google Sign-In is restricted for external domain (${window.location.hostname}). To enable Google Popup: Go to Firebase Console > Authentication > Settings > Authorized Domains and add '${window.location.hostname}'. Or click 'Instant Admin Login' below!`
        );
      } else if (code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups or use Instant Admin Login below.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Google Sign-In provider is not enabled in Firebase Console for beatmarket-68ae0. Enable it under Authentication > Sign-in method.");
      } else {
        setError(err?.message || "Google Sign-In failed. Use Instant Admin Login below.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    try {
      setLoading(true);
      await loginAsGuest();
      onClose();
    } catch (err: any) {
      setError("Guest sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-3xl max-w-md w-full p-5 sm:p-7 relative shadow-2xl my-auto max-h-[88vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 pr-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">BeatMarket Portal</h2>
          <p className="text-xs text-zinc-500 mt-1 leading-normal">
            Sign in to manage your luxury store, save cart items, or track orders.
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs space-y-2 leading-relaxed shadow-sm">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="flex-1 font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={async () => {
                setError("");
                setLoading(true);
                try {
                  await loginWithEmail("beatbounce181@gmail.com", "Dayal@123Madhumangal@123");
                  onClose();
                } catch (e: any) {
                  try {
                    await signupWithEmail("beatbounce181@gmail.com", "Dayal@123Madhumangal@123", "Master Admin", "shopkeeper");
                    onClose();
                  } catch (err: any) {
                    setError("Could not sign in: " + (err.message || e.message));
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              🛡️ Click Here for Instant Admin Access (beatbounce181@gmail.com)
            </button>
          </div>
        )}

        {/* Quick OAuth, Guest & Instant Admin Login Buttons */}
        <div className="space-y-2 mb-4">
          <button
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                await loginWithEmail("beatbounce181@gmail.com", "Dayal@123Madhumangal@123");
                onClose();
              } catch (e: any) {
                try {
                  await signupWithEmail("beatbounce181@gmail.com", "Dayal@123Madhumangal@123", "Master Admin", "shopkeeper");
                  onClose();
                } catch (err: any) {
                  setError("Admin login error: " + (err.message || e.message));
                }
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <ShieldAlert className="w-4 h-4 text-black shrink-0" />
            Instant Admin Login (beatbounce181@gmail.com)
          </button>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-zinc-200 dark:border-zinc-700"
          >
            <Chrome className="w-4 h-4 text-rose-500" />
            Continue with Google
          </button>

          <button
            onClick={handleGuest}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            Browse as Anonymous Guest
          </button>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <span className="relative bg-white dark:bg-zinc-900 px-3 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Or Email & Password
          </span>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === "login" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-extrabold" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === "signup" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-extrabold" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                    placeholder="E.g. Marcus Thorne"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 tracking-wider">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      role === "customer"
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-sm"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Shopper
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("shopkeeper")}
                    className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      role === "shopkeeper"
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-sm"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" /> Shopkeeper
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-md mt-3"
          >
            {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-2 text-center">
          <p className="text-[10px] text-zinc-400 leading-normal">
            Master Admin Email: <span className="font-mono font-bold text-emerald-500">beatbounce181@gmail.com</span>
          </p>
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setEmail("beatbounce181@gmail.com");
                setPassword("Dayal@123Madhumangal@123");
              }}
              className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline py-2 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 w-full text-center transition-all"
            >
              ⚡ Fill Admin Details
            </button>
            <button
              type="button"
              onClick={async () => {
                setError("");
                setLoading(true);
                try {
                  await loginWithEmail("beatbounce181@gmail.com", "Dayal@123Madhumangal@123");
                  onClose();
                } catch (e: any) {
                  try {
                    await signupWithEmail("beatbounce181@gmail.com", "Dayal@123Madhumangal@123", "Master Admin", "shopkeeper");
                    onClose();
                  } catch (err: any) {
                    setError("Could not sign in as master admin: " + (err.message || e.message));
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className="text-[10px] font-black text-black bg-amber-500 hover:bg-amber-400 py-2 px-2 rounded-xl border border-amber-600 w-full text-center shadow-sm transition-all"
            >
              🛡️ Instant Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
