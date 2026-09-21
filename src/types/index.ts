export interface Product {
  _id?: string;
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  image: string;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  pinout?: string[];
  voltage: string;
  sku: string;
  featured?: boolean;
  datasheetUrl?: string;
  createdAt?: string;
}

export interface RoboticsKit {
  _id?: string;
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  ageRange: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  features: string[];
  bomList: {
    item: string;
    qty: number;
  }[];
  learningOutcomes: string[];
  buildTimeHours: number;
  codeLanguage: string[];
  manualUrl?: string;
  videoTutorial?: string;
  createdAt?: string;
}

export interface PracticalExperiment {
  _id?: string;
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: string;
  durationMin: number;
  image: string;
  description: string;
  objective: string;
  requiredComponents: {
    name: string;
    qty: number;
    productId?: string;
  }[];
  circuitWiring: {
    pinFrom: string;
    pinTo: string;
    color: string;
    note?: string;
  }[];
  codeSnippets: {
    language: 'Arduino C++' | 'MicroPython' | 'CircuitPython';
    code: string;
  }[];
  troubleshootingTips: string[];
  createdAt?: string;
}

export interface EngineeringProject {
  _id?: string;
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedCost: number;
  image: string;
  description: string;
  highlights: string[];
  bom: {
    name: string;
    qty: number;
    unitPrice: number;
    productId?: string;
  }[];
  cadModelAvailable: boolean;
  gerberAvailable: boolean;
  circuitTopology: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'kit' | 'custom_bot' | 'bom_bundle';
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
  variant?: string;
  meta?: Record<string, any>;
}

export interface WhatsAppOrder {
  _id?: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPincode: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'WhatsApp UPI' | 'Cash on Delivery' | 'Bank Transfer / NEFT';
  status: 'New' | 'Contacted' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface InquiryLog {
  _id?: string;
  id: string;
  type: 'product_inquiry' | 'kit_inquiry' | 'stem_lab_setup' | 'custom_bulk';
  targetTitle: string;
  targetId?: string;
  customerName?: string;
  customerPhone?: string;
  message?: string;
  timestamp: string;
}

export interface CMSHeroContent {
  badgeText: string;
  headlinePrefix: string;
  highlightWord: string;
  headlineSuffix: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface CMSWhyUsStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  highlight: string;
}

export interface CMSWhyUsContent {
  badge: string;
  title: string;
  subtitle: string;
  steps: CMSWhyUsStep[];
  guaranteeTitle: string;
  guaranteeDesc: string;
}

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
  role: string;
}

export interface StoreSettings {
  _id?: string;
  whatsappNumber: string;
  storeName: string;
  supportEmail: string;
  announcementText: string;
  showAnnouncement: boolean;
  freeShippingThreshold: number;
  defaultDeliveryFee: number;
  currencySymbol: string;
  upiId: string;
  categories: string[];
  hero?: CMSHeroContent;
  whyUs?: CMSWhyUsContent;
  quotes?: QuoteItem[];
  footerBio?: string;
  footerAddress?: string;
  footerPhone?: string;
}

export interface CustomBotConfig {
  chassis: string;
  brain: string;
  motorDriver: string;
  sensors: string[];
  powerSource: string;
  addons: string[];
}
