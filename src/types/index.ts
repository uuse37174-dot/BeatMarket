export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  storeHandle?: string;
  createdAt: string;
}

export type StoreTemplate = 'monochrome' | 'midnight' | 'boutique' | 'platinum' | 'cyber';

export interface StoreLocation {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export interface Store {
  id: string;
  ownerId: string;
  storeName: string;
  handle: string; // Unique URL slug
  description: string;
  bannerImage: string;
  logoImage: string;
  template: StoreTemplate;
  sessionId: string; // Used by admin to assist shopkeeper
  location: StoreLocation;
  phoneNumber: string;
  enable3DSwipe: boolean;
  rating: number;
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  storeHandle: string;
  storeName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  inventory: number;
  featured?: boolean;
  location?: StoreLocation;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedStore: {
    id: string;
    name: string;
    handle: string;
    phone: string;
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  storeId: string;
  storeName?: string;
  customerUid: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  storeId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export interface SiteSettings {
  siteLogo: string;
  heroBanner: string;
  announcement: string;
}
