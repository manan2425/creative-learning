'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Product, PracticalActivity, Project, Quote, CompanyConfig } from '@/types';
import { formatMediaUrl, parseStringList, parseSpecKeyValue } from '@/lib/utils';
import { compressImageForMobile, compressImageToDataUrl, isImageFile } from '@/lib/imageCompressor';
import styles from './admin.module.css';
import ProductModal from '@/components/ProductModal';
import {
  Package,
  Layers,
  FlaskConical,
  Rocket,
  Quote as QuoteIcon,
  Building,
  Plus,
  Edit2,
  Trash2,
  Save,
  LogOut,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Star,
  Inbox,
  RefreshCw,
  RotateCcw,
  Database,
  FileText,
  Image as ImageIcon,
  Search,
  X,
  Eye,
  Check,
  Loader2,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface InquiryRecord {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  college?: string;
  message?: string;
  items?: Array<{ name: string; quantity: number; price?: string }>;
  createdAt?: string;
}

const COMMON_CATEGORIES = [
  'Boards',
  'Sensors',
  'Wireless & IoT',
  'Actuators & Motors',
  'Displays',
  'Starter Kits',
  'Accessories & Power',
  'Components',
];

export default function AdminPage() {
  const {
    catalog,
    refreshCatalog,
    saveProduct,
    deleteProduct,
    savePractical,
    deletePractical,
    saveProject,
    deleteProject,
    saveQuote,
    deleteQuote,
    setHeroQuote,
    saveCompany,
    setSelectedProduct,
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'products' | 'kits' | 'practicals' | 'projects' | 'quotes' | 'inquiries' | 'company'
  >('products');

  // Table Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Modals & Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingPractical, setEditingPractical] = useState<PracticalActivity | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyConfig>(catalog.company);
  const [toastMessage, setToastMessage] = useState('');
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImagesCount, setUploadingImagesCount] = useState(0);
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    mongoConnected: boolean;
    ipWhitelistRequired?: boolean;
    mongoError?: string | null;
    storageEngine?: string;
  }>({ mongoConnected: false });
  const [showDbModal, setShowDbModal] = useState(false);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch { }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDbStatus();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (catalog?.company) {
      setCompanyForm(catalog.company);
    }
  }, [catalog]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
        }
      }
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [isAuthenticated, activeTab]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Invalid password');
      }
    } catch {
      setLoginError('Authentication failed');
    }
  };

  // Password reset handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', recoveryCode, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetMessage('Password reset successful! You can now log in.');
        setShowForgot(false);
      } else {
        setResetMessage(data.error || 'Reset failed');
      }
    } catch {
      setResetMessage('Reset failed');
    }
  };

  // File upload handler helper with instant mobile auto-compression & resilient fallback
  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!file) return null;

    // 0. Auto-compress large camera photos before sending them over the network.
    let uploadFile = file;
    if (isImageFile(file)) {
      try {
        uploadFile = await compressImageForMobile(file);
      } catch (compErr) {
        console.warn('Pre-upload compression note, proceeding with original:', compErr);
      }
    }

    // 1. Try server-side file upload
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data?.url || (Array.isArray(data?.urls) && data.urls[0]);
        if (url) {
          return url;
        }
      }
    } catch (err) {
      console.warn('Network upload request failed, falling back to local compressed data URL:', err);
    }

    // 2. Resilient Fallback: Read file as lightweight Data URL (Base64)
    try {
      const fallbackUrl = await compressImageToDataUrl(uploadFile, 1000, 0.75);
      if (fallbackUrl) {
        return fallbackUrl;
      }
    } catch (dataErr) {
      console.warn('Data URL generation failed:', dataErr);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          resolve(null);
        }
      };
      reader.onerror = () => {
        resolve(null);
      };
      reader.readAsDataURL(uploadFile);
    });
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshCatalog();
    showToast('Catalog refreshed from MongoDB Atlas online!');
    setIsSyncing(false);
  };

  const handleResetDatabase = async (resetInquiries = false) => {
    const confirmMsg = resetInquiries
      ? '⚠️ CAUTION: Are you sure you want to completely RESET all database tables and CLEAR all inquiries?\n\nThis will re-seed products (28), practicals (8), projects (6), quotes (5), company settings, auth credentials, and wipe inquiries back to initial clean state.'
      : '⚠️ Are you sure you want to RESET the database?\n\nThis will re-seed all tables (products, practicals, projects, quotes, company, auth) with the fresh initial hardware catalog and schematics.';

    if (!window.confirm(confirmMsg)) return;

    setIsResetting(true);
    try {
      const res = await fetch('/api/reset-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetInquiries }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCatalog();
        await fetchDbStatus();
        if (activeTab === 'inquiries') {
          await fetchInquiries();
        }
        showToast('Database reset and re-seeded successfully across all tables!');
      } else {
        showToast(data.error || 'Failed to reset database');
      }
    } catch (err) {
      console.error('Database reset error:', err);
      showToast('Error resetting database');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteInquiry = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this customer inquiry record?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Inquiry record deleted from MongoDB.');
        fetchInquiries();
      } else {
        showToast('Failed to delete inquiry.');
      }
    } catch {
      showToast('Error deleting inquiry.');
    }
  };

  const handleClearAllInquiries = async () => {
    if (!window.confirm('Are you sure you want to CLEAR ALL customer inquiries from the database?')) return;
    try {
      const res = await fetch('/api/inquiries', { method: 'DELETE' });
      if (res.ok) {
        showToast('All inquiries cleared from database.');
        fetchInquiries();
      } else {
        showToast('Failed to clear inquiries.');
      }
    } catch {
      showToast('Error clearing inquiries.');
    }
  };

  // Filtered Products for Table
  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    return catalog.products.filter((p) => {
      const matchCat =
        selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [catalog.products, productSearch, selectedCategoryFilter]);

  // Starter Kits list
  const starterKits = useMemo(() => {
    return catalog.products.filter(
      (p) =>
        p.category.toLowerCase().includes('kit') ||
        p.id.toLowerCase().includes('kit') ||
        p.category === 'Starter Kits'
    );
  }, [catalog.products]);

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      showToast('Product name is required');
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveProduct(editingProduct);
      if (success) {
        showToast(`Saved "${editingProduct.name}" to MongoDB Atlas!`);
        setEditingProduct(null);
      } else {
        showToast('Error saving to cloud. Changes cached locally.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Practical Save
  const handleSavePractical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPractical) return;
    setIsSaving(true);
    try {
      const success = await savePractical(editingPractical);
      if (success) {
        showToast(`Saved practical "${editingPractical.title}"!`);
        setEditingPractical(null);
      } else {
        showToast('Error saving practical lab.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save practical lab');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Project Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    try {
      const success = await saveProject(editingProject);
      if (success) {
        showToast(`Saved project "${editingProject.title}"!`);
        setEditingProject(null);
      } else {
        showToast('Error saving project.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Quote Save
  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote) return;
    setIsSaving(true);
    try {
      const success = await saveQuote(editingQuote);
      if (success) {
        showToast('Quote saved to MongoDB Atlas!');
        setEditingQuote(null);
      } else {
        showToast('Error saving quote.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save quote');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Company Save
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await saveCompany(companyForm);
      if (success) {
        showToast('Company information saved to MongoDB Atlas!');
      } else {
        showToast('Error saving company configuration.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save company settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <img
            src="/images/branding/creative-learning-logo.png"
            alt="Logo"
            className={styles.loginLogo}
          />
          <h2 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800 }}>Creative Learning</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 24px' }}>
            Enter your admin credentials to manage hardware catalogue and cloud settings.
          </p>

          {!showForgot ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '6px',
                    color: '#334155',
                  }}
                >
                  Admin Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password (default: admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {loginError && (
                <div
                  style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="primary"
                style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '10px' }}
              >
                Login to Dashboard
              </button>

              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={{
                  background: 'none',
                  border: 0,
                  color: '#0872c9',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '16px',
                }}
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  Recovery Code
                </label>
                <input
                  type="text"
                  placeholder="Default: CREATIVE-LEARNING-RESET"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {resetMessage && (
                <div
                  style={{
                    color: resetMessage.includes('successful') ? '#16a34a' : '#dc2626',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  {resetMessage}
                </div>
              )}

              <button
                type="submit"
                className="primary"
                style={{ width: '100%', padding: '12px', fontSize: '13px', borderRadius: '10px' }}
              >
                Reset Password
              </button>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                style={{
                  background: 'none',
                  border: 0,
                  color: '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginTop: '12px',
                }}
              >
                Back to Login
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', fontSize: '11px', color: '#94a3b8' }}>
            <Link href="/" style={{ color: '#0872c9', fontWeight: 700 }}>
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <header className={styles.adminHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/images/branding/creative-learning-logo.png"
            alt="Logo"
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          />
          <div>
            <strong style={{ fontSize: '16px', letterSpacing: '0.05em' }}>
              CREATIVE LEARNING ADMIN
            </strong>
            <div
              onClick={() => setShowDbModal(true)}
              style={{
                fontSize: '11px',
                color: dbStatus.mongoConnected ? '#93c5fd' : '#fef08a',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                marginTop: '2px',
              }}
              title="Click to view Database Connectivity & Cloud Sync details"
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: dbStatus.mongoConnected ? '#00ff9d' : '#facc15',
                  display: 'inline-block',
                }}
              ></span>
              {dbStatus.mongoConnected
                ? 'MongoDB Atlas Online'
                : 'Local Database Active (Cloud IP Pending)'}
              <span style={{ textDecoration: 'underline', opacity: 0.8, fontSize: '10px' }}>
                [DB Info]
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={async () => {
              await handleManualSync();
              await fetchDbStatus();
            }}
            disabled={isSyncing || isResetting}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={13} className={isSyncing ? styles.spin : ''} /> Sync Database
          </button>
          <button
            type="button"
            onClick={() => handleResetDatabase(false)}
            disabled={isSyncing || isResetting}
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.45)',
              color: '#fca5a5',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Reset & Re-seed all collections (products, practicals, projects, quotes, auth)"
          >
            <RotateCcw size={13} className={isResetting ? styles.spin : ''} />
            {isResetting ? 'Resetting DB...' : 'Reset DB'}
          </button>
          <Link
            href="/"
            style={{
              fontSize: '12px',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700,
              background: 'rgba(0,240,255,0.15)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(0,240,255,0.3)',
            }}
          >
            <ArrowLeft size={14} /> View Live Storefront
          </Link>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#fca5a5',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={styles.adminNavTabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} /> Products & Components ({catalog.products.length})
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'kits' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('kits')}
        >
          <Layers size={16} /> Starter Kits ({starterKits.length})
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'practicals' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('practicals')}
        >
          <FlaskConical size={16} /> Practicals ({catalog.practicals.length})
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <Rocket size={16} /> Projects ({catalog.projects.length})
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'quotes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          <QuoteIcon size={16} /> Quotes ({catalog.quotes.length})
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'inquiries' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          <Inbox size={16} /> Inquiries & Orders ({inquiries.length})
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'company' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <Building size={16} /> Company & Settings
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#07152f',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700,
            zIndex: 9999,
            border: '1px solid rgba(0,255,157,0.3)',
          }}
        >
          <CheckCircle size={16} color="#00ff9d" /> {toastMessage}
        </div>
      )}

      {/* Main Content Areas */}
      <main className={styles.adminMain}>
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className={styles.cardPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Products & Components Management</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Add new hardware modules, update specifications, upload photos, and attach PDF datasheets.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 18px', borderRadius: '10px' }}
                onClick={() => {
                  const stamp = Date.now();
                  setEditingProduct({
                    id: `prod_${stamp}`,
                    name: '',
                    category: 'Boards',
                    description: '',
                    specifications: '',
                    applications: '',
                    price: 'Contact for price',
                    sku: `CL-P${stamp.toString().slice(-4)}`,
                    image: '',
                    images: [],
                    pdf: '',
                  });
                  setIsCustomCategory(false);
                }}
              >
                <Plus size={16} /> Add New Component
              </button>
            </div>

            {/* Toolbar: Search and Category Filter */}
            <div className={styles.adminToolbar}>
              <div className={styles.adminSearchWrap}>
                <Search size={15} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search by name, category, or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className={styles.adminSearchInput}
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    style={{ border: 0, background: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className={styles.adminSelect}
                >
                  <option value="all">All Categories ({catalog.products.length})</option>
                  {Array.from(new Set(catalog.products.map((p) => p.category).filter(Boolean))).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Component Name</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>PDF Datasheet</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const imgUrl = formatMediaUrl(p.images?.[0] || p.image);
                    return (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={imgUrl}
                            alt=""
                            style={{
                              width: '44px',
                              height: '44px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        </td>
                        <td>
                          <b style={{ color: '#0f172a' }}>{p.name}</b>
                          {p.description && (
                            <div style={{ fontSize: '11.5px', color: '#64748b', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.description}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`${styles.badge} ${styles.badgeCategory}`}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155' }}>
                          {p.sku || p.id}
                        </td>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{p.price}</td>
                        <td>
                          {p.pdf ? (
                            <a
                              href={formatMediaUrl(p.pdf)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles.badge} ${styles.badgePdf}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <FileText size={12} /> PDF Attached
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              style={{ background: 'rgba(2, 132, 199, 0.08)', color: '#0284c7', borderColor: '#bae6fd' }}
                              onClick={() => setSelectedProduct(p)}
                              title="Preview hardware specs modal"
                            >
                              <Eye size={13} /> Specs
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionEdit}`}
                              onClick={() => {
                                setEditingProduct({ ...p });
                                setIsCustomCategory(!COMMON_CATEGORIES.includes(p.category));
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                  showToast(`Deleted ${p.name}`);
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                        No components match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KITS TAB */}
        {activeTab === 'kits' && (
          <div className={styles.cardPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Starter Kits Management</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Manage bundled educational kits, component inclusions, and guided lab manuals.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 18px', borderRadius: '10px' }}
                onClick={() => {
                  const stamp = Date.now();
                  setEditingProduct({
                    id: `kit_${stamp}`,
                    name: '',
                    category: 'Starter Kits',
                    description: '',
                    specifications: '',
                    applications: '',
                    price: 'Contact for price',
                    sku: `CL-KIT-${stamp.toString().slice(-4)}`,
                    image: '',
                    images: [],
                    pdf: '',
                  });
                  setIsCustomCategory(false);
                }}
              >
                <Plus size={16} /> Add New Starter Kit
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Kit Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>PDF Lab Manual</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {starterKits.map((kit) => {
                    const imgUrl = formatMediaUrl(kit.images?.[0] || kit.image);
                    return (
                      <tr key={kit.id}>
                        <td>
                          <img
                            src={imgUrl}
                            alt=""
                            style={{
                              width: '44px',
                              height: '44px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        </td>
                        <td>
                          <b style={{ color: '#0f172a' }}>{kit.name}</b>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{kit.sku || kit.id}</td>
                        <td style={{ fontWeight: 700 }}>{kit.price}</td>
                        <td>
                          {kit.pdf ? (
                            <a
                              href={formatMediaUrl(kit.pdf)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles.badge} ${styles.badgePdf}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <FileText size={12} /> PDF Attached
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              style={{ background: 'rgba(2, 132, 199, 0.08)', color: '#0284c7', borderColor: '#bae6fd' }}
                              onClick={() => setSelectedProduct(kit)}
                              title="Preview starter kit specs modal"
                            >
                              <Eye size={13} /> Specs
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionEdit}`}
                              onClick={() => {
                                setEditingProduct({ ...kit });
                                setIsCustomCategory(false);
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                              onClick={() => {
                                if (confirm(`Delete starter kit "${kit.name}"?`)) {
                                  deleteProduct(kit.id);
                                  showToast(`Deleted ${kit.name}`);
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {starterKits.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                        No starter kits found. Click &quot;Add New Starter Kit&quot; above to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRACTICALS TAB */}
        {activeTab === 'practicals' && (
          <div className={styles.cardPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Practical Experiments & Labs</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Manage guided hardware labs, time duration, learning goals, and step-by-step circuit procedures.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 18px', borderRadius: '10px' }}
                onClick={() => {
                  const stamp = Date.now();
                  setEditingPractical({
                    key: `prac_${stamp}`,
                    title: '',
                    product: catalog.products[0]?.id || 'p02-1',
                    level: 'Beginner',
                    time: '25 min',
                    goal: '',
                    steps: [],
                    images: [],
                    pdf: '',
                  });
                }}
              >
                <Plus size={16} /> Add Practical Lab
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Duration</th>
                    <th>Linked Board</th>
                    <th>Goal / Objective</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.practicals.map((prac) => (
                    <tr key={prac.key}>
                      <td>
                        <b style={{ color: '#0f172a' }}>{prac.title}</b>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeCategory}`}>{prac.level}</span>
                      </td>
                      <td>{prac.time}</td>
                      <td>{catalog.products.find((p) => p.id === prac.product)?.name || prac.product}</td>
                      <td style={{ maxWidth: '300px', fontSize: '12px', color: '#475569' }}>{prac.goal}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionEdit}`}
                            onClick={() => setEditingPractical({ ...prac })}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionDelete}`}
                            onClick={() => {
                              if (confirm(`Delete practical "${prac.title}"?`)) {
                                deletePractical(prac.key);
                                showToast(`Deleted ${prac.title}`);
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className={styles.cardPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Robotics & IoT Projects (Blueprints)</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Manage capstone projects, required hardware lists, learning outcomes, and downloadable blueprint PDFs.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 18px', borderRadius: '10px' }}
                onClick={() => {
                  const stamp = Date.now();
                  setEditingProject({
                    key: `proj_${stamp}`,
                    title: '',
                    product: catalog.products[0]?.id || 'p02-1',
                    kit: '',
                    summary: '',
                    learn: '',
                    upgrade: '',
                    images: [],
                    pdf: '',
                  });
                }}
              >
                <Plus size={16} /> Add New Project
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Hardware BOM</th>
                    <th>Summary</th>
                    <th>PDF Blueprint</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.projects.map((proj) => (
                    <tr key={proj.key}>
                      <td>
                        <b style={{ color: '#0f172a' }}>{proj.title}</b>
                      </td>
                      <td style={{ fontSize: '12px', color: '#0369a1' }}>{proj.kit}</td>
                      <td style={{ maxWidth: '340px', fontSize: '12px', color: '#475569' }}>{proj.summary}</td>
                      <td>
                        {proj.pdf ? (
                          <a
                            href={formatMediaUrl(proj.pdf)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.badge} ${styles.badgePdf}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <FileText size={12} /> Attached
                          </a>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionEdit}`}
                            onClick={() => setEditingProject({ ...proj })}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionDelete}`}
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                deleteProject(proj.key);
                                showToast(`Deleted ${proj.title}`);
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QUOTES TAB */}
        {activeTab === 'quotes' && (
          <div className={styles.cardPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Inspiration & Quotes Manager</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Update quotes appearing on the live hero banner and inspiration gallery.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 18px', borderRadius: '10px' }}
                onClick={() => {
                  const stamp = Date.now();
                  setEditingQuote({
                    id: `q_${stamp}`,
                    text: '',
                    author: 'Creative Learning',
                  });
                }}
              >
                <Plus size={16} /> Add New Quote
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Quote Text</th>
                    <th>Author</th>
                    <th>Featured on Hero</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.quotes.map((q) => {
                    const isHero = q.id === catalog.heroQuoteId;
                    return (
                      <tr key={q.id}>
                        <td style={{ fontStyle: 'italic', color: '#0f172a' }}>“{q.text}”</td>
                        <td style={{ fontWeight: 700 }}>{q.author}</td>
                        <td>
                          {isHero ? (
                            <span className={`${styles.badge} ${styles.badgeVerified}`}>
                              ★ Live Hero Quote
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setHeroQuote(q.id);
                                showToast('Updated Featured Hero Quote!');
                              }}
                              style={{
                                fontSize: '11px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Set as Hero Quote
                            </button>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionEdit}`}
                              onClick={() => setEditingQuote({ ...q })}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                              onClick={() => {
                                if (confirm(`Delete quote?`)) {
                                  deleteQuote(q.id);
                                  showToast('Quote deleted');
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INQUIRIES & ORDERS TAB */}
        {activeTab === 'inquiries' && (
          <div className={styles.cardPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Customer Inquiries & Engineer Orders</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Live customer quote requests and engineer cart orders received from the storefront.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={fetchInquiries}
                  disabled={loadingInquiries}
                  className="secondary"
                  style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={loadingInquiries ? styles.spin : ''} /> Refresh Leads
                </button>
                {inquiries.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllInquiries}
                    className="secondary"
                    style={{
                      fontSize: '12px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#dc2626',
                      borderColor: 'rgba(239,68,68,0.3)',
                    }}
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <Inbox size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>No inquiries recorded in MongoDB yet.</p>
                <p style={{ fontSize: '12px', margin: '4px 0 0' }}>When visitors submit quote requests or orders on the storefront, they will show up here automatically.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer Name</th>
                      <th>Phone / WhatsApp</th>
                      <th>Email</th>
                      <th>Inquiry / Cart Items</th>
                      <th>Message</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq, idx) => (
                      <tr key={inq._id || idx}>
                        <td style={{ fontSize: '11.5px', whiteSpace: 'nowrap', color: '#64748b' }}>
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent'}
                        </td>
                        <td><b>{inq.name || 'Anonymous'}</b></td>
                        <td>
                          {inq.phone ? (
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#0872c9', fontWeight: 700, textDecoration: 'none' }}
                            >
                              {inq.phone}
                            </a>
                          ) : '—'}
                        </td>
                        <td>{inq.email || '—'}</td>
                        <td style={{ fontSize: '12px', maxWidth: '280px' }}>
                          {Array.isArray(inq.items) && inq.items.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '16px' }}>
                              {inq.items.map((it, i) => (
                                <li key={i}>{it.name} (x{it.quantity})</li>
                              ))}
                            </ul>
                          ) : (
                            'Direct Quote Request'
                          )}
                        </td>
                        <td style={{ fontSize: '12px', maxWidth: '200px', color: '#475569' }}>{inq.message || '—'}</td>
                        <td>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionDelete}`}
                            onClick={() => handleDeleteInquiry(inq._id)}
                            title="Delete inquiry record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* COMPANY SETTINGS TAB */}
        {activeTab === 'company' && (
          <div className={styles.cardPanel}>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>Company Information & Contact Settings</h3>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>
              These details are reflected across the header, footer, WhatsApp links, and customer enquiry forms.
            </p>

            <form onSubmit={handleSaveCompany} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tagline</label>
                <input
                  type="text"
                  value={companyForm.tagline}
                  onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>WhatsApp Number (with country code, e.g. +91 97140 45096)</label>
                <input
                  type="text"
                  value={companyForm.whatsapp}
                  onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contact Email Address</label>
                <input
                  type="email"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Physical Address / Location</label>
                <input
                  type="text"
                  value={companyForm.address || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                />
              </div>

              <div className={styles.fullCol} style={{ marginTop: '10px' }}>
                <button
                  type="submit"
                  className="primary"
                  disabled={isSaving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '10px', padding: '12px 22px' }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className={styles.spin} /> Saving to Cloud...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Company Settings to MongoDB
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Database Management & Danger Zone */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '2px dashed #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Database size={20} color="#0872c9" />
                <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                  Database Tables & Reset Administration
                </h4>
              </div>
              <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13px' }}>
                Manage full database re-seeding and sync across all MongoDB tables: <code>products</code>, <code>practicals</code>, <code>projects</code>, <code>quotes</code>, <code>company</code>, <code>auth</code>, and <code>inquiries</code>.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={async () => {
                    await handleManualSync();
                    await fetchDbStatus();
                  }}
                  disabled={isSyncing || isResetting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={isSyncing ? styles.spin : ''} />
                  Test & Sync Database
                </button>

                <button
                  type="button"
                  onClick={() => handleResetDatabase(false)}
                  disabled={isResetting || isSyncing}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <RotateCcw size={14} className={isResetting ? styles.spin : ''} />
                  {isResetting ? 'Resetting Database...' : 'Reset & Re-seed All Tables'}
                </button>

                <button
                  type="button"
                  onClick={() => handleResetDatabase(true)}
                  disabled={isResetting || isSyncing}
                  style={{
                    background: '#450a0a',
                    border: '1px solid #7f1d1d',
                    color: '#fecaca',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Trash2 size={14} />
                  Reset Database + Wipe Inquiries
                </button>

                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowDbModal(true)}
                  style={{ fontSize: '13px' }}
                >
                  View Cloud Diagnostics
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PRODUCT / KIT EDIT MODAL */}
      {editingProduct && (
        <div className={styles.adminModalBackdrop} onClick={() => setEditingProduct(null)}>
          <div className={styles.adminModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.adminModalHead}>
              <h3>
                {editingProduct.id.includes('kit') || editingProduct.category.includes('Kit')
                  ? 'Edit Starter Kit'
                  : 'Edit Hardware Component'}
              </h3>
              <button
                type="button"
                className={styles.adminModalClose}
                onClick={() => setEditingProduct(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Product / Component Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  placeholder="e.g. Arduino UNO R3 or HC-SR04 Sensor"
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category *</label>
                {!isCustomCategory ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true);
                          setEditingProduct({ ...editingProduct, category: '' });
                        } else {
                          setEditingProduct({ ...editingProduct, category: e.target.value });
                        }
                      }}
                      style={{ width: '100%' }}
                    >
                      {COMMON_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__custom__">+ Enter Custom Category...</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={editingProduct.category}
                      placeholder="Type custom category name..."
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      required
                      style={{ width: '100%' }}
                    />
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setEditingProduct({ ...editingProduct, category: 'Boards' });
                      }}
                      style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '6px 10px' }}
                    >
                      List
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>SKU (Stock Identifier)</label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  placeholder="e.g. CL-P02-UNO"
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Price Display</label>
                <input
                  type="text"
                  value={editingProduct.price}
                  placeholder="e.g. Contact for price or ₹450"
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Short Overview Description *</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  placeholder="Brief description of the component architecture, MCU type, and core capabilities..."
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ margin: 0 }}>Hardware Specifications (separate items with semicolon ; or newlines)</label>
                  {editingProduct.specifications && (
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                      {parseStringList(editingProduct.specifications).length} items detected
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={editingProduct.specifications}
                  placeholder="ATmega328P MCU; 14 Digital I/O (6 PWM); 6 Analog Inputs; 32 KB Flash; 5V Operating Voltage"
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, specifications: e.target.value })
                  }
                />
                <span className={styles.formHelper}>
                  Format: <code>Parameter: Value; Parameter 2: Value 2</code> or one per line.
                </span>

                {/* Live Specs Preview */}
                {editingProduct.specifications && parseStringList(editingProduct.specifications).length > 0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', marginBottom: '6px' }}>
                      ⚡ Live Specs Preview:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {parseStringList(editingProduct.specifications).map((spec, i) => {
                        const parsed = parseSpecKeyValue(spec);
                        return (
                          <span
                            key={i}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '11.5px',
                              color: '#1e293b',
                            }}
                          >
                            {parsed.label ? (
                              <>
                                <b>{parsed.label}:</b> {parsed.value}
                              </>
                            ) : (
                              parsed.value
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ margin: 0 }}>Robotics & IoT Applications (separate items with semicolon ;)</label>
                  {editingProduct.applications && (
                    <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 700 }}>
                      {parseStringList(editingProduct.applications).length} applications detected
                    </span>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={editingProduct.applications}
                  placeholder="Robotics chassis control; Sensor interfacing; IoT gateways; STEM education labs"
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, applications: e.target.value })
                  }
                />

                {/* Live Apps Preview */}
                {editingProduct.applications && parseStringList(editingProduct.applications).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                    {parseStringList(editingProduct.applications).map((app, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#fff7ed',
                          border: '1px solid #fed7aa',
                          color: '#c2410c',
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        ⚡ {app}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Multi-Image Gallery Manager */}
              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ margin: 0 }}>
                    Product Images & Gallery ({((Array.isArray(editingProduct.images) && editingProduct.images.length > 0 ? editingProduct.images : (editingProduct.image ? [editingProduct.image] : []))).length} photos)
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    First photo is used as Primary Cover. All photos appear in Specs gallery.
                  </span>
                </div>

                <div className={styles.galleryManager}>
                  {/* Top Upload & URL Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
                      <input
                        type="text"
                        value={newProductImageUrl}
                        placeholder="Paste online or local image URL (e.g. images/components/p01-2.jpg)..."
                        onChange={(e) => setNewProductImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newProductImageUrl.trim()) {
                              const existing = Array.isArray(editingProduct.images) && editingProduct.images.length > 0
                                ? editingProduct.images
                                : editingProduct.image
                                ? [editingProduct.image]
                                : [];
                              const updated = [...existing, newProductImageUrl.trim()];
                              setEditingProduct({
                                ...editingProduct,
                                image: updated[0] || '',
                                images: updated,
                              });
                              setNewProductImageUrl('');
                              showToast('Image URL added to product gallery!');
                            }
                          }
                        }}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => {
                          if (newProductImageUrl.trim()) {
                            const existing = Array.isArray(editingProduct.images) && editingProduct.images.length > 0
                              ? editingProduct.images
                              : editingProduct.image
                              ? [editingProduct.image]
                              : [];
                            const updated = [...existing, newProductImageUrl.trim()];
                            setEditingProduct({
                              ...editingProduct,
                              image: updated[0] || '',
                              images: updated,
                            });
                            setNewProductImageUrl('');
                            showToast('Image URL added to product gallery!');
                          }
                        }}
                        disabled={!newProductImageUrl.trim()}
                        style={{
                          fontSize: '12px',
                          padding: '8px 14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderRadius: '8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Plus size={14} /> Add URL
                      </button>
                    </div>

                    <label
                      className="primary"
                      style={{
                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        padding: '8px 16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                      }}
                    >
                      {uploadingImage ? (
                        <Loader2 size={15} className={styles.spin} />
                      ) : (
                        <Upload size={15} />
                      )}
                      {uploadingImage
                        ? `Uploading ${uploadingImagesCount > 0 ? uploadingImagesCount + ' ' : ''}Photo(s)...`
                        : '+ Upload Multiple Photos'}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                        onClick={(e) => {
                          (e.target as HTMLInputElement).value = '';
                        }}
                        onChange={async (e) => {
                          const fileList = e.target.files;
                          if (!fileList || fileList.length === 0) return;
                          const files = Array.from(fileList);
                          setUploadingImagesCount(files.length);
                          setUploadingImage(true);
                          try {
                            const results: Array<string | null> = [];
                            for (let index = 0; index < files.length; index += 2) {
                              const batch = files.slice(index, index + 2);
                              results.push(...(await Promise.all(batch.map((f) => handleFileUpload(f)))));
                            }
                            const validUrls = results.filter((url): url is string => Boolean(url));
                            if (validUrls.length > 0) {
                              const existing = Array.isArray(editingProduct.images) && editingProduct.images.length > 0
                                ? editingProduct.images.filter(Boolean)
                                : editingProduct.image
                                ? [editingProduct.image]
                                : [];
                              const updated = [...existing, ...validUrls.filter((u) => !existing.includes(u))];
                              setEditingProduct({
                                ...editingProduct,
                                image: updated[0] || '',
                                images: updated,
                              });
                              showToast(`✓ Added ${validUrls.length} photo(s)! Click "Save Product" below to save online.`);
                            } else {
                              showToast('⚠️ Could not process selected photo(s). Please choose a valid image file.');
                            }
                          } catch (uploadErr) {
                            console.error('Multi-photo upload error:', uploadErr);
                            showToast('⚠️ Error processing photos. Please try again.');
                          } finally {
                            setUploadingImage(false);
                            setUploadingImagesCount(0);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Multi-Image Gallery Grid */}
                  {(() => {
                    const currentImgs = Array.isArray(editingProduct.images) && editingProduct.images.length > 0
                      ? editingProduct.images.filter(Boolean)
                      : editingProduct.image
                      ? [editingProduct.image]
                      : [];

                    if (currentImgs.length === 0) {
                      return (
                        <div className={styles.galleryEmpty}>
                          <ImageIcon size={32} style={{ color: '#cbd5e1' }} />
                          <div>No images attached yet. Select multiple photos from your device or paste an image URL above.</div>
                        </div>
                      );
                    }

                    return (
                      <div className={styles.galleryGrid}>
                        {currentImgs.map((imgUrl, idx) => {
                          const isCover = idx === 0;
                          return (
                            <div
                              key={`${imgUrl}-${idx}`}
                              className={`${styles.galleryCard} ${isCover ? styles.galleryCardCover : ''}`}
                            >
                              {isCover ? (
                                <span className={styles.galleryBadge}>
                                  <Star size={10} fill="#ffffff" /> COVER
                                </span>
                              ) : (
                                <span className={styles.galleryOrderBadge}>
                                  #{idx + 1}
                                </span>
                              )}

                              <img
                                src={formatMediaUrl(imgUrl)}
                                alt={`Product view ${idx + 1}`}
                                className={styles.galleryCardThumb}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/branding/creative-learning-logo.png';
                                }}
                              />

                              <div className={styles.galleryActions}>
                                {!isCover && (
                                  <button
                                    type="button"
                                    className={styles.galleryActionBtn}
                                    title="Set as Primary Cover Image"
                                    onClick={() => {
                                      const updated = [...currentImgs];
                                      const [item] = updated.splice(idx, 1);
                                      updated.unshift(item);
                                      setEditingProduct({
                                        ...editingProduct,
                                        image: updated[0] || '',
                                        images: updated,
                                      });
                                      showToast('Set as primary cover image.');
                                    }}
                                  >
                                    <Star size={12} />
                                  </button>
                                )}

                                {idx > 0 && (
                                  <button
                                    type="button"
                                    className={styles.galleryActionBtn}
                                    title="Move Left"
                                    onClick={() => {
                                      const updated = [...currentImgs];
                                      const temp = updated[idx];
                                      updated[idx] = updated[idx - 1];
                                      updated[idx - 1] = temp;
                                      setEditingProduct({
                                        ...editingProduct,
                                        image: updated[0] || '',
                                        images: updated,
                                      });
                                    }}
                                  >
                                    <ArrowLeft size={12} />
                                  </button>
                                )}

                                {idx < currentImgs.length - 1 && (
                                  <button
                                    type="button"
                                    className={styles.galleryActionBtn}
                                    title="Move Right"
                                    onClick={() => {
                                      const updated = [...currentImgs];
                                      const temp = updated[idx];
                                      updated[idx] = updated[idx + 1];
                                      updated[idx + 1] = temp;
                                      setEditingProduct({
                                        ...editingProduct,
                                        image: updated[0] || '',
                                        images: updated,
                                      });
                                    }}
                                  >
                                    <ArrowRight size={12} />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className={`${styles.galleryActionBtn} ${styles.galleryActionBtnDanger}`}
                                  title="Delete photo from product"
                                  onClick={() => {
                                    const updated = currentImgs.filter((_, i) => i !== idx);
                                    setEditingProduct({
                                      ...editingProduct,
                                      image: updated[0] || '',
                                      images: updated,
                                    });
                                    showToast('Photo removed from gallery.');
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Upload PDF */}
              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>PDF Datasheet / Lab Guide URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProduct.pdf || ''}
                    placeholder="docs/datasheets/manual.pdf or /uploads/..."
                    onChange={(e) => setEditingProduct({ ...editingProduct, pdf: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: uploadingPdf ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      padding: '8px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {uploadingPdf ? (
                      <Loader2 size={14} className={styles.spin} />
                    ) : (
                      <Upload size={14} />
                    )}
                    {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={uploadingPdf}
                      style={{ display: 'none' }}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).value = '';
                      }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingPdf(true);
                          const url = await handleFileUpload(file);
                          setUploadingPdf(false);
                          if (url) {
                            setEditingProduct({ ...editingProduct, pdf: url });
                            showToast('PDF Datasheet uploaded successfully!');
                          }
                        }
                      }}
                    />
                  </label>

                  {editingProduct.pdf && (
                    <a
                      href={formatMediaUrl(editingProduct.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="secondary"
                      style={{
                        fontSize: '12px',
                        padding: '8px 12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <ExternalLink size={13} /> Test PDF
                    </a>
                  )}
                </div>
              </div>

              <div
                className={styles.fullCol}
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setSelectedProduct(editingProduct)}
                  style={{ borderRadius: '10px', padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Eye size={15} /> Preview Specs Modal
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingProduct(null)}
                  disabled={isSaving}
                  style={{ borderRadius: '10px', padding: '10px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary"
                  disabled={isSaving}
                  style={{
                    borderRadius: '10px',
                    padding: '10px 22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className={styles.spin} /> Saving to Cloud...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRACTICAL EDIT MODAL */}
      {editingPractical && (
        <div className={styles.adminModalBackdrop} onClick={() => setEditingPractical(null)}>
          <div className={styles.adminModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.adminModalHead}>
              <h3>Edit Practical Lab Experiment</h3>
              <button
                type="button"
                className={styles.adminModalClose}
                onClick={() => setEditingPractical(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePractical} className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Experiment Title *</label>
                <input
                  type="text"
                  value={editingPractical.title}
                  placeholder="e.g. Ultrasonic Sonar Distance Measurement"
                  onChange={(e) =>
                    setEditingPractical({ ...editingPractical, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Difficulty Level</label>
                <select
                  value={editingPractical.level}
                  onChange={(e) =>
                    setEditingPractical({ ...editingPractical, level: e.target.value })
                  }
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Estimated Duration</label>
                <input
                  type="text"
                  value={editingPractical.time}
                  onChange={(e) =>
                    setEditingPractical({ ...editingPractical, time: e.target.value })
                  }
                  placeholder="e.g. 25 min"
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Linked Microcontroller / Hardware Board</label>
                <select
                  value={editingPractical.product}
                  onChange={(e) =>
                    setEditingPractical({ ...editingPractical, product: e.target.value })
                  }
                >
                  {catalog.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Experiment Goal / Objective *</label>
                <textarea
                  rows={2}
                  value={editingPractical.goal}
                  placeholder="Describe the primary learning objective and circuit telemetry result..."
                  onChange={(e) =>
                    setEditingPractical({ ...editingPractical, goal: e.target.value })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Step-by-step Procedures (separate items with semicolon ; or newlines) *</label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(editingPractical.steps)
                      ? editingPractical.steps.join('; ')
                      : editingPractical.steps
                  }
                  placeholder="Connect VCC to 5V; Connect GND to Ground; Wire TRIG to D9 and ECHO to D10; Upload sonar sketch"
                  onChange={(e) =>
                    setEditingPractical({
                      ...editingPractical,
                      steps: e.target.value.split(/[;\n]/).map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Lab Image URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingPractical.images?.[0] || ''}
                    placeholder="images/components/p04-1.jpg or /uploads/..."
                    onChange={(e) =>
                      setEditingPractical({
                        ...editingPractical,
                        images: e.target.value ? [e.target.value] : [],
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).value = '';
                      }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingPractical({
                              ...editingPractical,
                              images: [url, ...(editingPractical.images || []).filter((u) => u !== url)],
                            });
                            showToast('Lab photo uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Practical Image Preview */}
                <div className={styles.imagePreviewSection} style={{ marginTop: '10px' }}>
                  {editingPractical.images?.[0] ? (
                    <img
                      src={formatMediaUrl(editingPractical.images[0])}
                      alt="Practical Preview"
                      className={styles.imagePreviewThumb}
                    />
                  ) : (
                    <div className={styles.imagePreviewPlaceholder}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <b>Lab Photo Preview:</b>{' '}
                    {editingPractical.images?.[0]
                      ? 'Live preview active.'
                      : 'No lab image attached. Upload or paste a URL above.'}
                  </div>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Lab Sheet PDF URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingPractical.pdf || ''}
                    placeholder="docs/practicals/lab.pdf or /uploads/..."
                    onChange={(e) => setEditingPractical({ ...editingPractical, pdf: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).value = '';
                      }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingPractical({ ...editingPractical, pdf: url });
                            showToast('Lab PDF uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div
                className={styles.fullCol}
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingPractical(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Experiment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT EDIT MODAL */}
      {editingProject && (
        <div className={styles.adminModalBackdrop} onClick={() => setEditingProject(null)}>
          <div className={styles.adminModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.adminModalHead}>
              <h3>Edit Robotics & IoT Blueprint</h3>
              <button
                type="button"
                className={styles.adminModalClose}
                onClick={() => setEditingProject(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Project Title *</label>
                <input
                  type="text"
                  value={editingProject.title}
                  placeholder="e.g. Autonomous Obstacle Avoidance 4WD Rover"
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Linked Microcontroller Board</label>
                <select
                  value={editingProject.product}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, product: e.target.value })
                  }
                >
                  {catalog.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Hardware Bill of Materials (BOM) *</label>
                <input
                  type="text"
                  value={editingProject.kit}
                  onChange={(e) => setEditingProject({ ...editingProject, kit: e.target.value })}
                  placeholder="e.g. 4WD Chassis + Arduino UNO + L298N + HC-SR04"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Summary / Abstract *</label>
                <textarea
                  rows={2}
                  value={editingProject.summary}
                  placeholder="Overview of the autonomous robot behavior and navigation algorithm..."
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>What You Learn *</label>
                <input
                  type="text"
                  value={editingProject.learn}
                  onChange={(e) => setEditingProject({ ...editingProject, learn: e.target.value })}
                  placeholder="Sensors • Motor PWM • Real-time Decision Tree Architecture"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Upgrade & Extension Ideas</label>
                <input
                  type="text"
                  value={editingProject.upgrade}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, upgrade: e.target.value })
                  }
                  placeholder="Add Bluetooth override, OLED HUD telemetry, etc."
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Project Blueprint Image URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProject.images?.[0] || ''}
                    placeholder="images/components/p21-kit.jpg or /uploads/..."
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        images: e.target.value ? [e.target.value] : [],
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload Blueprint Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).value = '';
                      }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProject({
                              ...editingProject,
                              images: [url, ...(editingProject.images || []).filter((u) => u !== url)],
                            });
                            showToast('Project photo uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Project Image Preview */}
                <div className={styles.imagePreviewSection} style={{ marginTop: '10px' }}>
                  {editingProject.images?.[0] ? (
                    <img
                      src={formatMediaUrl(editingProject.images[0])}
                      alt="Project Preview"
                      className={styles.imagePreviewThumb}
                    />
                  ) : (
                    <div className={styles.imagePreviewPlaceholder}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <b>Blueprint Preview:</b>{' '}
                    {editingProject.images?.[0]
                      ? 'Live preview active.'
                      : 'No project image attached. Upload or paste a URL above.'}
                  </div>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Blueprint PDF URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProject.pdf || ''}
                    placeholder="docs/projects/blueprint.pdf or /uploads/..."
                    onChange={(e) => setEditingProject({ ...editingProject, pdf: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).value = '';
                      }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProject({ ...editingProject, pdf: url });
                            showToast('Blueprint PDF uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div
                className={styles.fullCol}
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUOTE EDIT MODAL */}
      {editingQuote && (
        <div className={styles.adminModalBackdrop} onClick={() => setEditingQuote(null)}>
          <div className={styles.adminModal} style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.adminModalHead}>
              <h3>Edit Quote</h3>
              <button
                type="button"
                className={styles.adminModalClose}
                onClick={() => setEditingQuote(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} style={{ display: 'grid', gap: '14px' }}>
              <div className={styles.formGroup}>
                <label>Quote Text *</label>
                <textarea
                  rows={3}
                  value={editingQuote.text}
                  onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Author / Speaker *</label>
                <input
                  type="text"
                  value={editingQuote.author}
                  onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                  required
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button type="button" className="secondary" onClick={() => setEditingQuote(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DATABASE DIAGNOSTICS & SETUP MODAL */}
      {showDbModal && (
        <div className={styles.adminModalBackdrop} onClick={() => setShowDbModal(false)}>
          <div
            className={styles.adminModal}
            style={{ maxWidth: '620px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.adminModalHead}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} color="#0872c9" />
                <h3>Database Engine & Cloud Status</h3>
              </div>
              <button
                type="button"
                className={styles.adminModalClose}
                onClick={() => setShowDbModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: dbStatus.mongoConnected ? '#dcfce7' : '#fef9c3',
                  border: `1px solid ${dbStatus.mongoConnected ? '#86efac' : '#fde047'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: dbStatus.mongoConnected ? '#16a34a' : '#ca8a04',
                    }}
                  ></span>
                  {dbStatus.mongoConnected
                    ? 'MongoDB Atlas Cloud Connected & Synchronized'
                    : 'Local Persistent Storage Engine Active (Cloud IP Whitelist Pending)'}
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                  {dbStatus.mongoConnected
                    ? 'All product modifications, starter kits, practicals, blueprints, and quotes are being saved directly into your MongoDB Atlas cloud collections.'
                    : 'Your catalog data is 100% saved and persisted locally in src/data/catalog.json. To enable live sync with MongoDB Atlas, ensure your current IP address is whitelisted in MongoDB Atlas Network Access.'}
                </p>
              </div>

              {!dbStatus.mongoConnected && (
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12.5px',
                  }}
                >
                  <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#0f172a' }}>
                    ⚡ How to allow MongoDB Atlas connections:
                  </h4>
                  <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6', color: '#475569' }}>
                    <li>Log in to your <b>cloud.mongodb.com</b> dashboard.</li>
                    <li>Go to <b>Security → Network Access</b> in the left sidebar.</li>
                    <li>Click <b>Add IP Address</b> and choose <b>Allow Access from Anywhere</b> (<code>0.0.0.0/0</code>) or add your current IP.</li>
                    <li>Click <b>Confirm</b> and wait 30 seconds for Atlas to update.</li>
                  </ol>
                </div>
              )}

              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#0f172a' }}>
                  📊 Database Collections & Tables Overview:
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                      {catalog.products.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>products</div>
                  </div>
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                      {catalog.practicals.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>practicals (labs)</div>
                  </div>
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                      {catalog.projects.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>projects (blueprints)</div>
                  </div>
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                      {catalog.quotes.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>quotes</div>
                  </div>
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                      {inquiries.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>inquiries (leads)</div>
                  </div>
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                      Ready
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>company & auth</div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: '10px',
                  paddingTop: '14px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleResetDatabase(false)}
                  disabled={isResetting || isSyncing}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RotateCcw size={13} className={isResetting ? styles.spin : ''} />
                  {isResetting ? 'Resetting...' : 'Reset & Re-seed All Tables'}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setShowDbModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="primary"
                    onClick={async () => {
                      await handleManualSync();
                      await fetchDbStatus();
                    }}
                    disabled={isSyncing}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={14} className={isSyncing ? styles.spin : ''} />
                    Test & Sync Database
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Specs Preview Modal mounted globally for Admin */}
      <ProductModal />
    </div>
  );
}
