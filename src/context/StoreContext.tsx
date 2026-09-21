'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  RoboticsKit, 
  PracticalExperiment, 
  EngineeringProject, 
  CartItem, 
  StoreSettings, 
  WhatsAppOrder,
  CMSHeroContent,
  CMSWhyUsContent,
  QuoteItem
} from '@/types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_KITS, 
  INITIAL_PRACTICALS, 
  INITIAL_PROJECTS, 
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES
} from '@/data/initialData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  kits: RoboticsKit[];
  practicals: PracticalExperiment[];
  projects: EngineeringProject[];
  settings: StoreSettings;
  categories: string[];
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  activeQuickViewProduct: Product | null;
  activePracticalModal: PracticalExperiment | null;
  toasts: Toast[];
  isLoading: boolean;
  appliedCoupon: string | null;
  couponDiscount: number;

  // Modals & UI Actions
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setActiveQuickViewProduct: (product: Product | null) => void;
  setActivePracticalModal: (practical: PracticalExperiment | null) => void;
  
  // Cart & Wishlist
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // WhatsApp Helpers
  generateWhatsAppOrderUrl: (customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: string;
    notes?: string;
  }) => string;
  openWhatsAppInquiry: (topic: string, details?: string, targetId?: string) => void;
  processWhatsAppCheckout: (orderData: Omit<WhatsAppOrder, 'orderId' | 'createdAt' | 'status'>) => Promise<string>;

  // File Upload Helper
  uploadImage: (file: File) => Promise<{ success: boolean; url: string; base64?: string; error?: string }>;

  // Dynamic Categories Management
  addCategory: (categoryName: string) => Promise<boolean>;
  deleteCategory: (categoryName: string) => Promise<boolean>;
  updateCategories: (categories: string[]) => Promise<boolean>;

  // Visual CMS & Settings
  updateCMSContent: (section: 'hero' | 'whyUs' | 'quotes' | 'general', data: any) => Promise<boolean>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;

  // Database CRUD
  refreshData: () => Promise<void>;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addKit: (kit: RoboticsKit) => Promise<boolean>;
  updateKit: (kit: RoboticsKit) => Promise<boolean>;
  deleteKit: (id: string) => Promise<boolean>;
  addPractical: (practical: PracticalExperiment) => Promise<boolean>;
  updatePractical: (practical: PracticalExperiment) => Promise<boolean>;
  deletePractical: (id: string) => Promise<boolean>;
  addProject: (project: EngineeringProject) => Promise<boolean>;
  updateProject: (project: EngineeringProject) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'cl_robotics_cart_v1';
const LOCAL_STORAGE_WISHLIST_KEY = 'cl_robotics_wishlist_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [kits, setKits] = useState<RoboticsKit[]>(INITIAL_KITS);
  const [practicals, setPracticals] = useState<PracticalExperiment[]>(INITIAL_PRACTICALS);
  const [projects, setProjects] = useState<EngineeringProject[]>(INITIAL_PROJECTS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [activePracticalModal, setActivePracticalModal] = useState<PracticalExperiment | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Load local storage on mount & fetch MongoDB
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }

    refreshData();
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 1. Products
      const resProd = await fetch('/api/products');
      if (resProd.ok) {
        const d = await resProd.json();
        if (Array.isArray(d.data)) setProducts(d.data);
      }

      // 2. Kits
      const resKits = await fetch('/api/kits');
      if (resKits.ok) {
        const d = await resKits.json();
        if (Array.isArray(d.data)) setKits(d.data);
      }

      // 3. Practicals
      const resPrac = await fetch('/api/practicals');
      if (resPrac.ok) {
        const d = await resPrac.json();
        if (Array.isArray(d.data)) setPracticals(d.data);
      }

      // 4. Projects
      const resProj = await fetch('/api/projects');
      if (resProj.ok) {
        const d = await resProj.json();
        if (Array.isArray(d.data)) setProjects(d.data);
      }

      // 5. Settings & Categories
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const d = await resSettings.json();
        if (d.data) {
          setSettings(d.data);
          if (Array.isArray(d.data.categories) && d.data.categories.length > 0) {
            setCategories(d.data.categories);
          }
        }
      }
    } catch (error) {
      console.warn('Database fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload image file from device
  const uploadImage = async (file: File): Promise<{ success: boolean; url: string; base64?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showToast('Image Uploaded', `${file.name} uploaded successfully.`, 'success');
        return { success: true, url: data.url, base64: data.base64 };
      } else {
        showToast('Upload Failed', data.error || 'Could not upload image', 'error');
        return { success: false, url: '', error: data.error };
      }
    } catch (err: any) {
      showToast('Upload Error', err.message || 'Network error during upload', 'error');
      return { success: false, url: '', error: err.message };
    }
  };

  // Dynamic Categories Management
  const updateCategories = async (newCats: string[]): Promise<boolean> => {
    try {
      // Ensure 'All' is always first
      const normalized = ['All', ...newCats.filter((c) => c.toLowerCase() !== 'all')];
      setCategories(normalized);
      await updateSettings({ categories: normalized });
      showToast('Categories Updated', 'Store categories saved successfully.', 'success');
      return true;
    } catch (e: any) {
      showToast('Error', 'Failed to update categories', 'error');
      return false;
    }
  };

  const addCategory = async (categoryName: string): Promise<boolean> => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category Exists', `"${trimmed}" is already in category list.`, 'warning');
      return false;
    }
    const updated = [...categories, trimmed];
    return await updateCategories(updated);
  };

  const deleteCategory = async (categoryName: string): Promise<boolean> => {
    if (categoryName.toLowerCase() === 'all') {
      showToast('Cannot Delete', 'Default "All" category cannot be removed.', 'warning');
      return false;
    }
    const updated = categories.filter((c) => c !== categoryName);
    return await updateCategories(updated);
  };

  // Dynamic CMS Text Editor
  const updateCMSContent = async (section: 'hero' | 'whyUs' | 'quotes' | 'general', data: any): Promise<boolean> => {
    try {
      let updatedSettings: Partial<StoreSettings> = {};
      if (section === 'hero') {
        updatedSettings = { hero: data as CMSHeroContent };
      } else if (section === 'whyUs') {
        updatedSettings = { whyUs: data as CMSWhyUsContent };
      } else if (section === 'quotes') {
        updatedSettings = { quotes: data as QuoteItem[] };
      } else {
        updatedSettings = data;
      }

      await updateSettings(updatedSettings);
      showToast('CMS Updated', `${section.toUpperCase()} content updated live on website.`, 'success');
      return true;
    } catch (e: any) {
      showToast('Error', 'Failed to save website content', 'error');
      return false;
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });

    showToast('Added to Cart 🚀', `${item.name.slice(0, 32)}... added to your kit bag.`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed from Cart', 'Item removed from your cart bag.', 'info');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Wishlist', 'Item removed from wishlist.', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Wishlist', 'Item saved to wishlist!', 'success');
        return [...prev, id];
      }
    });
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'ROBO10') {
      setAppliedCoupon('ROBO10');
      setCouponDiscount(10); // 10%
      showToast('Coupon Applied! 🎉', '10% discount applied to your robotics order.', 'success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      return true;
    } else if (cleanCode === 'MAKER50') {
      setAppliedCoupon('MAKER50');
      setCouponDiscount(50); // ₹50 flat
      showToast('Coupon Applied! 🎉', '₹50 maker bonus discount applied.', 'success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      return true;
    } else {
      showToast('Invalid Coupon', 'Code not recognized. Try "ROBO10"', 'warning');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon Removed', 'Discount coupon was removed.', 'info');
  };

  // WhatsApp Order URL
  const generateWhatsAppOrderUrl = (customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: string;
    notes?: string;
  }): string => {
    const rawNumber = settings.whatsappNumber || '+919714045096';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = 0;
    if (appliedCoupon === 'ROBO10') {
      discountAmount = Math.round((subtotal * 10) / 100);
    } else if (appliedCoupon === 'MAKER50') {
      discountAmount = 50;
    }

    const freeThreshold = settings.freeShippingThreshold || 999;
    const shippingFee = (subtotal - discountAmount >= freeThreshold || cart.length === 0) 
      ? 0 
      : (settings.defaultDeliveryFee || 60);

    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    let message = `⚡ *NEW ORDER - CREATIVE LEARNING STORE*\n`;
    message += `===================================\n\n`;
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `• *Name:* ${customer.name}\n`;
    message += `• *Phone:* ${customer.phone}\n`;
    message += `• *Delivery Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n`;
    message += `• *Payment Mode:* ${customer.paymentMethod}\n`;
    if (customer.notes) message += `• *Instructions:* ${customer.notes}\n`;
    message += `\n📦 *ORDER ITEMS (${cart.length})*\n`;

    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}*\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
      if (item.sku) message += `   SKU: \`${item.sku}\`\n`;
      if (item.meta) {
        if (item.meta.chassis) message += `   Config: ${item.meta.chassis} + ${item.meta.brain}\n`;
      }
    });

    message += `\n-----------------------------------\n`;
    message += `💰 *FINANCIAL SUMMARY*\n`;
    message += `• Items Subtotal: ₹${subtotal}\n`;
    if (discountAmount > 0) message += `• Coupon (${appliedCoupon}): -₹${discountAmount}\n`;
    message += `• Shipping / Delivery: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}\n`;
    message += `• *Grand Total Payable:* *₹${grandTotal}*\n`;
    message += `===================================\n`;
    message += `🚀 *Please confirm stock & dispatch timeline.*`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const openWhatsAppInquiry = (topic: string, details?: string, targetId?: string) => {
    const rawNumber = settings.whatsappNumber || '+919714045096';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    let text = `👋 Hello Creative Learning Team,\n\nI have an inquiry regarding: *${topic}*`;
    if (details) text += `\nDetails: ${details}`;
    text += `\n\nPlease assist me with pricing, datasheet, and availability. Thank you!`;

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_inquiry',
        type: 'product_inquiry',
        targetTitle: topic,
        targetId: targetId,
        message: details,
        timestamp: new Date().toISOString()
      }),
    }).catch(() => {});

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const processWhatsAppCheckout = async (
    orderData: Omit<WhatsAppOrder, 'orderId' | 'createdAt' | 'status'>
  ): Promise<string> => {
    const orderId = 'CL-' + Date.now().toString().slice(-6);
    const fullOrder: WhatsAppOrder = {
      ...orderData,
      orderId,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullOrder),
      });
    } catch (e) {
      console.warn('Could not log order to database:', e);
    }

    const waUrl = generateWhatsAppOrderUrl({
      name: orderData.customerName,
      phone: orderData.customerPhone,
      address: orderData.customerAddress,
      city: orderData.customerCity,
      pincode: orderData.customerPincode,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
    });

    clearCart();
    return waUrl;
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast('Settings Saved', 'Settings updated successfully in MongoDB.', 'success');
    } catch (e) {
      showToast('Error', 'Failed to save settings to server', 'error');
    }
  };

  // Products CRUD
  const addProduct = async (product: Product): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const d = await res.json();
      if (d.success) {
        setProducts((prev) => [d.data || product, ...prev]);
        showToast('Product Added', `${product.name} saved to MongoDB.`, 'success');
        return true;
      }
    } catch (e) {}
    setProducts((prev) => [product, ...prev]);
    return true;
  };

  const updateProduct = async (product: Product): Promise<boolean> => {
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (e) {}
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    showToast('Product Updated', `${product.name} updated successfully.`, 'success');
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Deleted', 'Item removed from database.', 'info');
    return true;
  };

  // Kits CRUD
  const addKit = async (kit: RoboticsKit): Promise<boolean> => {
    try {
      const res = await fetch('/api/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kit),
      });
      const d = await res.json();
      if (d.success) {
        setKits((prev) => [d.data || kit, ...prev]);
        showToast('Robotics Kit Added', `${kit.title} created.`, 'success');
        return true;
      }
    } catch (e) {}
    setKits((prev) => [kit, ...prev]);
    return true;
  };

  const updateKit = async (kit: RoboticsKit): Promise<boolean> => {
    try {
      await fetch('/api/kits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kit),
      });
    } catch (e) {}
    setKits((prev) => prev.map((k) => (k.id === kit.id ? kit : k)));
    showToast('Kit Updated', `${kit.title} updated successfully.`, 'success');
    return true;
  };

  const deleteKit = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/kits?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setKits((prev) => prev.filter((k) => k.id !== id));
    showToast('Kit Deleted', 'Robotics kit removed from database.', 'info');
    return true;
  };

  // Practicals CRUD
  const addPractical = async (practical: PracticalExperiment): Promise<boolean> => {
    try {
      const res = await fetch('/api/practicals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(practical),
      });
      const d = await res.json();
      if (d.success) {
        setPracticals((prev) => [d.data || practical, ...prev]);
        showToast('Practical Lab Added', `${practical.title} created.`, 'success');
        return true;
      }
    } catch (e) {}
    setPracticals((prev) => [practical, ...prev]);
    return true;
  };

  const updatePractical = async (practical: PracticalExperiment): Promise<boolean> => {
    try {
      await fetch('/api/practicals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(practical),
      });
    } catch (e) {}
    setPracticals((prev) => prev.map((p) => (p.id === practical.id ? practical : p)));
    showToast('Practical Updated', 'Lab experiment updated.', 'success');
    return true;
  };

  const deletePractical = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/practicals?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setPracticals((prev) => prev.filter((p) => p.id !== id));
    showToast('Practical Deleted', 'Lab removed from database.', 'info');
    return true;
  };

  // Projects CRUD
  const addProject = async (project: EngineeringProject): Promise<boolean> => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      const d = await res.json();
      if (d.success) {
        setProjects((prev) => [d.data || project, ...prev]);
        showToast('Blueprint Added', `${project.title} added.`, 'success');
        return true;
      }
    } catch (e) {}
    setProjects((prev) => [project, ...prev]);
    return true;
  };

  const updateProject = async (project: EngineeringProject): Promise<boolean> => {
    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
    } catch (e) {}
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    showToast('Blueprint Updated', 'Project updated successfully.', 'success');
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Blueprint Deleted', 'Project removed from database.', 'info');
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        kits,
        practicals,
        projects,
        settings,
        categories,
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        isCheckoutOpen,
        activeQuickViewProduct,
        activePracticalModal,
        toasts,
        isLoading,
        appliedCoupon,
        couponDiscount,
        setIsCartOpen,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setActiveQuickViewProduct,
        setActivePracticalModal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        showToast,
        removeToast,
        generateWhatsAppOrderUrl,
        openWhatsAppInquiry,
        processWhatsAppCheckout,
        uploadImage,
        addCategory,
        deleteCategory,
        updateCategories,
        updateCMSContent,
        refreshData,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        addKit,
        updateKit,
        deleteKit,
        addPractical,
        updatePractical,
        deletePractical,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
