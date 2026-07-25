import { Store, Product, SiteSettings } from "../types";

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteLogo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
  heroBanner: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
  announcement: "WELCOME TO BEATMARKET — THE PREMIER LUXURY AUDIO & MULTI-STORE DIRECTORY"
};

export const INITIAL_STORES: Store[] = [
  {
    id: "store_noir",
    ownerId: "owner_noir",
    storeName: "Noir & Co. Atelier",
    handle: "noir-co",
    description: "Curated high-fidelity acoustics, bespoke audio gear, and sleek minimal aesthetics.",
    bannerImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    logoImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
    template: "monochrome",
    sessionId: "BM-9921",
    location: {
      address: "742 Broadway Avenue",
      city: "New York, NY",
      lat: 40.7291,
      lng: -73.9965
    },
    phoneNumber: "+1 (555) 019-2834",
    enable3DSwipe: true,
    rating: 4.9,
    createdAt: new Date().toISOString()
  },
  {
    id: "store_obsidian",
    ownerId: "owner_obsidian",
    storeName: "Obsidian Beats & Studio",
    handle: "obsidian-beats",
    description: "Heavy bass, analog synthesizers, studio reference monitors, and dark luxury vibes.",
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    logoImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80",
    template: "midnight",
    sessionId: "BM-8843",
    location: {
      address: "128 Mercer Street",
      city: "New York, NY",
      lat: 40.7245,
      lng: -73.9982
    },
    phoneNumber: "+1 (555) 018-9932",
    enable3DSwipe: true,
    rating: 4.8,
    createdAt: new Date().toISOString()
  },
  {
    id: "store_aura",
    ownerId: "owner_aura",
    storeName: "Aura Velvet Sound & Style",
    handle: "aura-velvet",
    description: "High-fashion wearable audio tech, artisanal headphone stands, and boutique lifestyle accessories.",
    bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    logoImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80",
    template: "boutique",
    sessionId: "BM-7712",
    location: {
      address: "590 Fifth Avenue",
      city: "New York, NY",
      lat: 40.7562,
      lng: -73.9785
    },
    phoneNumber: "+1 (555) 017-4421",
    enable3DSwipe: true,
    rating: 4.95,
    createdAt: new Date().toISOString()
  },
  {
    id: "store_platinum",
    ownerId: "owner_platinum",
    storeName: "Platinum Chrono & Acoustics",
    handle: "platinum-gear",
    description: "Engineered precision chronometers, brushed aluminum amplifiers, and audiophile gear.",
    bannerImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    logoImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80",
    template: "platinum",
    sessionId: "BM-6601",
    location: {
      address: "350 Fifth Avenue, Suite 400",
      city: "New York, NY",
      lat: 40.7484,
      lng: -73.9857
    },
    phoneNumber: "+1 (555) 016-8822",
    enable3DSwipe: true,
    rating: 5.0,
    createdAt: new Date().toISOString()
  },
  {
    id: "store_cyber",
    ownerId: "owner_cyber",
    storeName: "CyberPulse Underground",
    handle: "cyberpulse",
    description: "Next-gen spatial audio headsets, modular synthesizer racks, and neon monochrome gear.",
    bannerImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    logoImage: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=300&q=80",
    template: "cyber",
    sessionId: "BM-5539",
    location: {
      address: "210 Bedford Avenue",
      city: "Brooklyn, NY",
      lat: 40.7174,
      lng: -73.9572
    },
    phoneNumber: "+1 (555) 015-3310",
    enable3DSwipe: true,
    rating: 4.7,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    storeId: "store_noir",
    storeHandle: "noir-co",
    storeName: "Noir & Co. Atelier",
    name: "Noir Master-1 Planar Headphones",
    description: "Handcrafted planar magnetic headphones with solid walnut earcups and beryllium transducers.",
    price: 18999,
    originalPrice: 22500,
    category: "Headphones",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 12,
    featured: true,
    location: INITIAL_STORES[0].location,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_2",
    storeId: "store_noir",
    storeHandle: "noir-co",
    storeName: "Noir & Co. Atelier",
    name: "Monochrome Tube Preamplifier",
    description: "Class-A dual triode vacuum tube preamplifier for warm, silky analog playback.",
    price: 24999,
    category: "Amplifiers",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 5,
    featured: true,
    location: INITIAL_STORES[0].location,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_3",
    storeId: "store_obsidian",
    storeHandle: "obsidian-beats",
    storeName: "Obsidian Beats & Studio",
    name: "Obsidian Pro Wireless Earbuds II",
    description: "Active noise cancellation with 32-bit spatial audio output and custom onyx charging case.",
    price: 6999,
    originalPrice: 8499,
    category: "Headphones",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 28,
    featured: true,
    location: INITIAL_STORES[1].location,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_4",
    storeId: "store_obsidian",
    storeHandle: "obsidian-beats",
    storeName: "Obsidian Beats & Studio",
    name: "Analog Sub-Bass Synthesizer",
    description: "Dedicated 25-key analog synth engine with dual oscillators and ladder filter.",
    price: 14999,
    category: "Synthesizers",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 8,
    featured: true,
    location: INITIAL_STORES[1].location,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_5",
    storeId: "store_aura",
    storeHandle: "aura-velvet",
    storeName: "Aura Velvet Sound & Style",
    name: "Velvet Gold Wireless Headphones",
    description: "Brushed gold accents with Italian Nappa leather headband and custom acoustic tuning.",
    price: 11999,
    originalPrice: 13999,
    category: "Headphones",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 15,
    featured: true,
    location: INITIAL_STORES[2].location,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_6",
    storeId: "store_platinum",
    storeHandle: "platinum-gear",
    storeName: "Platinum Chrono & Acoustics",
    name: "Platinum Reference Studio Monitors (Pair)",
    description: "Precision titanium tweeter and kevlar woofer setup for crystal-clear mixing precision.",
    price: 42500,
    category: "Speakers",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 4,
    featured: true,
    location: INITIAL_STORES[3].location,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_7",
    storeId: "store_cyber",
    storeHandle: "cyberpulse",
    storeName: "CyberPulse Underground",
    name: "CyberPulse Haptic Gaming & Audio Rig",
    description: "Zero-latency haptic bass response headset with customizable RGB monochrome pulse LEDs.",
    price: 8999,
    category: "Headphones",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    inventory: 19,
    featured: true,
    location: INITIAL_STORES[4].location,
    createdAt: new Date().toISOString()
  }
];
