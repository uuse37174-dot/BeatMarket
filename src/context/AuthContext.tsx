import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc
} from "../lib/firebase";
import { UserProfile, Store, Product, SiteSettings, Order } from "../types";
import { INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_SITE_SETTINGS } from "../lib/seedData";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isShopkeeper: boolean;
  assistedStore: Store | null; // Store managed by admin via session ID
  setAssistedStore: (store: Store | null) => void;
  stores: Store[];
  products: Product[];
  siteSettings: SiteSettings;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, role: 'customer' | 'shopkeeper') => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  createOrUpdateStore: (storeData: Partial<Store>) => Promise<Store>;
  adminCreateStore: (storeData: Partial<Store>) => Promise<Store>;
  adminUpdateStore: (storeId: string, storeData: Partial<Store>) => Promise<void>;
  adminDeleteStore: (storeId: string) => Promise<void>;
  assistedStoreBySessionId: (sessionId: string) => Promise<Store | null>;
  addProduct: (productData: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  userOrders: Order[];
  storeOrders: Order[];
  placeOrder: (order: Omit<Order, "id" | "createdAt">) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [assistedStore, setAssistedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [storeOrders, setStoreOrders] = useState<Order[]>([]);

  // Initialize and subscribe to Firestore stores and products
  useEffect(() => {
    // Listen to Stores
    const unsubStores = onSnapshot(collection(db, "stores"), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedStores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Store));
        setStores(fetchedStores);
      } else {
        // Seed initial stores to Firestore if empty
        INITIAL_STORES.forEach(async (s) => {
          await setDoc(doc(db, "stores", s.id), s);
        });
        setStores(INITIAL_STORES);
      }
    }, (err) => {
      console.warn("Firestore stores fallback to local state:", err.message);
    });

    // Listen to Products
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(fetchedProducts);
      } else {
        // Seed initial products to Firestore if empty
        INITIAL_PRODUCTS.forEach(async (p) => {
          await setDoc(doc(db, "products", p.id), p);
        });
        setProducts(INITIAL_PRODUCTS);
      }
    }, (err) => {
      console.warn("Firestore products fallback to local state:", err.message);
    });

    // Listen to Site Settings
    const unsubSettings = onSnapshot(doc(db, "siteSettings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(docSnap.data() as SiteSettings);
      } else {
        setDoc(doc(db, "siteSettings", "main"), INITIAL_SITE_SETTINGS);
      }
    }, (err) => {
      console.warn("Firestore siteSettings fallback:", err.message);
    });

    return () => {
      unsubStores();
      unsubProducts();
      unsubSettings();
    };
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Special check for master admin email (Google login or password)
        const userEmail = (firebaseUser.email || "").trim().toLowerCase();
        const isMasterAdmin = 
          userEmail === "admin@beatmarket.com" || 
          userEmail === "beatbounce181@gmail.com" || 
          userEmail === "uuse37174@gmail.com";
        
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserProfile;
            if (isMasterAdmin && userData.role !== "admin") {
              userData.role = "admin";
              await setDoc(userDocRef, { role: "admin" }, { merge: true });
            }
            setUser(userData);
          } else {
            // New user profile creation
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || `guest_${firebaseUser.uid.substring(0, 6)}@beatmarket.com`,
              displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Guest Shopper" : "BeatMarket User"),
              photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${firebaseUser.uid}`,
              role: isMasterAdmin ? "admin" : "customer",
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
          }
        } catch (e) {
          console.warn("Auth sync fallback:", e);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "guest@beatmarket.com",
            displayName: firebaseUser.displayName || "Guest Shopper",
            role: isMasterAdmin ? "admin" : "customer",
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Orders
  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      setStoreOrders([]);
      return;
    }

    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      // Filter customer orders
      setUserOrders(allOrders.filter(o => o.customerUid === user.uid));

      // Filter shopkeeper store orders (if user owns a store or admin is inspecting)
      const myStore = stores.find(s => s.ownerId === user.uid) || assistedStore;
      if (myStore) {
        setStoreOrders(allOrders.filter(o => o.storeId === myStore.id));
      } else if (user.role === 'admin') {
        setStoreOrders(allOrders);
      }
    });

    return () => unsubOrders();
  }, [user, stores, assistedStore]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isMasterAdmin = 
      cleanEmail === "admin@beatmarket.com" || 
      cleanEmail === "beatbounce181@gmail.com" || 
      cleanEmail === "uuse37174@gmail.com";

    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      if (isMasterAdmin) {
        // Auto sign up if user does not exist yet or credentials failed initial check
        try {
          const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
          const profile: UserProfile = {
            uid: res.user.uid,
            email: email.trim(),
            displayName: "Master Admin",
            photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${res.user.uid}`,
            role: "admin",
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, "users", res.user.uid), profile);
          setUser(profile);
          return;
        } catch (signupErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, role: 'customer' | 'shopkeeper') => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const isMasterAdmin = 
      email.toLowerCase() === "admin@beatmarket.com" || 
      email.toLowerCase() === "beatbounce181@gmail.com" ||
      email.toLowerCase() === "uuse37174@gmail.com";
    const profile: UserProfile = {
      uid: res.user.uid,
      email,
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${res.user.uid}`,
      role: isMasterAdmin ? "admin" : role,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "users", res.user.uid), profile);
    setUser(profile);
  };

  const loginAsGuest = async () => {
    await signInAnonymously(auth);
  };

  const logout = async () => {
    setAssistedStore(null);
    await firebaseSignOut(auth);
  };

  const createOrUpdateStore = async (storeData: Partial<Store>): Promise<Store> => {
    if (!user) throw new Error("Must be logged in to manage a store");
    
    // Check if store already exists for user or assisted store
    const existingStore = stores.find(s => s.ownerId === user.uid) || assistedStore;
    const storeId = existingStore ? existingStore.id : `store_${Date.now()}`;
    const handle = storeData.handle || storeData.storeName?.toLowerCase().replace(/[^a-z0-9]/g, "-") || `store-${Date.now()}`;
    const sessionId = existingStore?.sessionId || `BM-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullStore: Store = {
      id: storeId,
      ownerId: existingStore ? existingStore.ownerId : user.uid,
      storeName: storeData.storeName || "My Luxury Store",
      handle,
      description: storeData.description || "Welcome to my exclusive store on BeatMarket.",
      bannerImage: storeData.bannerImage || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
      logoImage: storeData.logoImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
      template: storeData.template || "monochrome",
      sessionId,
      location: storeData.location || {
        address: "Luxury Row",
        city: "New York, NY",
        lat: 40.7128,
        lng: -74.0060
      },
      phoneNumber: storeData.phoneNumber || "+1 (555) 123-4567",
      enable3DSwipe: storeData.enable3DSwipe !== undefined ? storeData.enable3DSwipe : true,
      rating: storeData.rating || 5.0,
      createdAt: existingStore?.createdAt || new Date().toISOString()
    };

    await setDoc(doc(db, "stores", storeId), fullStore);
    
    // Update user role to shopkeeper & storeHandle if needed
    if (user.role !== "admin") {
      const updatedUser: UserProfile = { ...user, role: "shopkeeper", storeHandle: handle };
      await setDoc(doc(db, "users", user.uid), updatedUser);
      setUser(updatedUser);
    }

    if (assistedStore && assistedStore.id === storeId) {
      setAssistedStore(fullStore);
    }

    return fullStore;
  };

  const adminCreateStore = async (storeData: Partial<Store>): Promise<Store> => {
    const storeId = storeData.id || `store_${Date.now()}`;
    const handle = storeData.handle || storeData.storeName?.toLowerCase().replace(/[^a-z0-9]/g, "-") || `store-${Date.now()}`;
    const sessionId = storeData.sessionId || `BM-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullStore: Store = {
      id: storeId,
      ownerId: storeData.ownerId || user?.uid || "admin_created_owner",
      storeName: storeData.storeName || "New Luxury Shop",
      handle,
      description: storeData.description || "Welcome to our exclusive luxury shop on BeatMarket.",
      bannerImage: storeData.bannerImage || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
      logoImage: storeData.logoImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
      template: storeData.template || "monochrome",
      sessionId,
      location: storeData.location || {
        address: "M.G. Road",
        city: "Mumbai, MH",
        lat: 19.0760,
        lng: 72.8777
      },
      phoneNumber: storeData.phoneNumber || "+91 98765 43210",
      enable3DSwipe: storeData.enable3DSwipe !== undefined ? storeData.enable3DSwipe : true,
      rating: storeData.rating || 5.0,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "stores", storeId), fullStore);
    return fullStore;
  };

  const adminUpdateStore = async (storeId: string, storeData: Partial<Store>) => {
    await setDoc(doc(db, "stores", storeId), storeData, { merge: true });
  };

  const adminDeleteStore = async (storeId: string) => {
    await deleteDoc(doc(db, "stores", storeId));
    // Clean up products for this store
    const storeProds = products.filter((p) => p.storeId === storeId);
    for (const p of storeProds) {
      await deleteDoc(doc(db, "products", p.id));
    }
  };

  // Find store by Session ID for illiterate/disabled shopkeepers assistance by Admin
  const assistedStoreBySessionId = async (sessionId: string): Promise<Store | null> => {
    const found = stores.find(s => s.sessionId.toLowerCase() === sessionId.trim().toLowerCase());
    if (found) {
      setAssistedStore(found);
      return found;
    }
    return null;
  };

  const addProduct = async (productData: Omit<Product, "id" | "createdAt">) => {
    const newProdId = `prod_${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newProdId,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "products", newProdId), newProduct);
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    await setDoc(doc(db, "products", productId), productData, { merge: true });
  };

  const deleteProduct = async (productId: string) => {
    await setDoc(doc(db, "products", productId), { deleted: true }, { merge: true });
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    await setDoc(doc(db, "siteSettings", "main"), updated);
    setSiteSettings(updated);
  };

  const placeOrder = async (orderData: Omit<Order, "id" | "createdAt">): Promise<string> => {
    const orderId = `ord_${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "orders", orderId), newOrder);

    // Deduct real-time inventory for products
    orderData.items.forEach(async (item) => {
      const targetProd = products.find(p => p.id === item.productId);
      if (targetProd) {
        const newInv = Math.max(0, targetProd.inventory - item.quantity);
        await setDoc(doc(db, "products", targetProd.id), { inventory: newInv }, { merge: true });
      }
    });

    return orderId;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await setDoc(doc(db, "orders", orderId), { status }, { merge: true });
  };

  const isAdmin = 
    user?.role === "admin" || 
    user?.email?.toLowerCase() === "admin@beatmarket.com" || 
    user?.email?.toLowerCase() === "beatbounce181@gmail.com" ||
    user?.email?.toLowerCase() === "uuse37174@gmail.com";
  const isShopkeeper = user?.role === "shopkeeper" || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isShopkeeper,
        assistedStore,
        setAssistedStore,
        stores,
        products,
        siteSettings,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginAsGuest,
        logout,
        createOrUpdateStore,
        adminCreateStore,
        adminUpdateStore,
        adminDeleteStore,
        assistedStoreBySessionId,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSiteSettings,
        userOrders,
        storeOrders,
        placeOrder,
        updateOrderStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
