'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Product, PracticalActivity, Project, Quote, CompanyConfig } from '@/types';
import styles from './admin.module.css';
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
  Inbox,
  RefreshCw,
  Database,
  FileText,
  Image as ImageIcon,
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

  // Modals & Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPractical, setEditingPractical] = useState<PracticalActivity | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyConfig>(catalog.company);
  const [toastMessage, setToastMessage] = useState('');
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  // File upload handler helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
    return null;
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshCatalog();
    showToast('Catalog refreshed from MongoDB Atlas online!');
    setIsSyncing(false);
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

  const starterKits = catalog.products.filter(
    (p) => p.category.includes('Kit') || p.id.includes('kit') || p.category === 'Starter Kits'
  );

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
            <div style={{ fontSize: '11px', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ff9d', display: 'inline-block' }}></span>
              MongoDB Atlas Cloud Connected
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
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
            <RefreshCw size={13} className={isSyncing ? 'spin' : ''} /> Sync Cloud
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
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
                  Add new hardware modules, update specifications, upload photos and attach PDF datasheets.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '10px' }}
                onClick={() =>
                  setEditingProduct({
                    id: `p-${Date.now().toString().slice(-4)}`,
                    name: '',
                    category: 'Boards',
                    description: '',
                    specifications: '',
                    applications: '',
                    price: 'Contact for price',
                    sku: `CL-P${Date.now().toString().slice(-4)}`,
                    images: [],
                  })
                }
              >
                <Plus size={16} /> Add New Component
              </button>
            </div>

            {/* Products Table */}
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>PDF Datasheet</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.products.map((p) => {
                    const img = p.images?.[0] || p.image || '/images/branding/creative-learning-logo.png';
                    return (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={img.startsWith('/') ? img : `/${img}`}
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
                          <b>{p.name}</b>
                        </td>
                        <td>
                          <span className="tag" style={{ fontSize: '11px' }}>{p.category}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{p.sku || p.id}</td>
                        <td>{p.price}</td>
                        <td>{p.pdf ? '✓ Attached' : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionEdit}`}
                              onClick={() => setEditingProduct({ ...p })}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) {
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
                style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '10px' }}
                onClick={() =>
                  setEditingProduct({
                    id: `kit-${Date.now().toString().slice(-4)}`,
                    name: '',
                    category: 'Starter Kits',
                    description: '',
                    specifications: '',
                    applications: '',
                    price: 'Contact for price',
                    sku: `CL-KIT-${Date.now().toString().slice(-4)}`,
                    images: [],
                  })
                }
              >
                <Plus size={16} /> Add New Starter Kit
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Kit Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>PDF Manual</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {starterKits.map((kit) => {
                    const img =
                      kit.images?.[0] ||
                      kit.image ||
                      '/images/branding/creative-learning-logo.png';
                    return (
                      <tr key={kit.id}>
                        <td>
                          <img
                            src={img.startsWith('/') ? img : `/${img}`}
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
                          <b>{kit.name}</b>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{kit.sku || kit.id}</td>
                        <td>{kit.price}</td>
                        <td>{kit.pdf ? '✓ Attached' : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionEdit}`}
                              onClick={() => setEditingProduct({ ...kit })}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                              onClick={() => {
                                if (confirm(`Delete ${kit.name}?`)) {
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
                <h3 style={{ margin: 0, fontSize: '20px' }}>Practical Experiments</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Manage guided hardware labs, time duration, learning goals, and step-by-step circuit procedures.
                </p>
              </div>

              <button
                type="button"
                className="primary"
                style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '10px' }}
                onClick={() =>
                  setEditingPractical({
                    key: `prac-${Date.now().toString().slice(-4)}`,
                    title: '',
                    product: catalog.products[0]?.id || 'p02-1',
                    level: 'Beginner',
                    time: '25 min',
                    goal: '',
                    steps: [],
                  })
                }
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
                        <b>{prac.title}</b>
                      </td>
                      <td>
                        <span className="tag" style={{ fontSize: '11px' }}>{prac.level}</span>
                      </td>
                      <td>{prac.time}</td>
                      <td>{catalog.products.find((p) => p.id === prac.product)?.name || prac.product}</td>
                      <td style={{ maxWidth: '300px', fontSize: '12px' }}>{prac.goal}</td>
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
                              if (confirm(`Delete practical ${prac.title}?`)) {
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
                style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '10px' }}
                onClick={() =>
                  setEditingProject({
                    key: `proj-${Date.now().toString().slice(-4)}`,
                    title: '',
                    product: catalog.products[0]?.id || 'p02-1',
                    kit: '',
                    summary: '',
                    learn: '',
                    upgrade: '',
                  })
                }
              >
                <Plus size={16} /> Add New Project
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Hardware Kit</th>
                    <th>Summary</th>
                    <th>PDF Blueprint</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.projects.map((proj) => (
                    <tr key={proj.key}>
                      <td>
                        <b>{proj.title}</b>
                      </td>
                      <td style={{ fontSize: '12px' }}>{proj.kit}</td>
                      <td style={{ maxWidth: '340px', fontSize: '12px' }}>{proj.summary}</td>
                      <td>{proj.pdf ? '✓ Attached' : '—'}</td>
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
                              if (confirm(`Delete project ${proj.title}?`)) {
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
                style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '10px' }}
                onClick={() =>
                  setEditingQuote({
                    id: `q-${Date.now().toString().slice(-4)}`,
                    text: '',
                    author: 'Creative Learning',
                  })
                }
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
                        <td style={{ fontStyle: 'italic' }}>“{q.text}”</td>
                        <td>{q.author}</td>
                        <td>
                          {isHero ? (
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                              }}
                            >
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

              <button
                type="button"
                onClick={fetchInquiries}
                disabled={loadingInquiries}
                className="secondary"
                style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={loadingInquiries ? 'spin' : ''} /> Refresh Leads
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <Inbox size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 700 }}>No inquiries recorded in MongoDB yet.</p>
                <p style={{ fontSize: '12px', margin: '4px 0 0' }}>When visitors submit quote requests or orders on the storefront, they will show up here.</p>
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
                      <th>College / Org</th>
                      <th>Inquiry / Cart Items</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq, idx) => (
                      <tr key={inq._id || idx}>
                        <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent'}
                        </td>
                        <td><b>{inq.name || 'Anonymous'}</b></td>
                        <td>
                          {inq.phone ? (
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#0872c9', fontWeight: 700 }}
                            >
                              {inq.phone}
                            </a>
                          ) : '—'}
                        </td>
                        <td>{inq.email || '—'}</td>
                        <td>{inq.college || '—'}</td>
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
                        <td style={{ fontSize: '12px', maxWidth: '200px' }}>{inq.message || '—'}</td>
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
            <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>Company Information & Contact</h3>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>
              These details are reflected across the header, footer, WhatsApp links, and enquiry forms.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCompany(companyForm);
                showToast('Company information saved to MongoDB Atlas successfully!');
              }}
              className={styles.formGrid}
            >
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
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px', padding: '12px 20px' }}
                >
                  <Save size={16} /> Save Company Settings to Cloud
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* PRODUCT / KIT EDIT MODAL */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div
            className="modal"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>
              {editingProduct.id.includes('kit') || editingProduct.category.includes('Kit')
                ? 'Edit Starter Kit'
                : 'Edit Product / Component'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProduct(editingProduct);
                setEditingProduct(null);
                showToast(`Saved ${editingProduct.name} to MongoDB Atlas!`);
              }}
              className={styles.formGrid}
            >
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  placeholder="Boards, Sensors, Starter Kits, etc."
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>SKU (Stock Identifier)</label>
                <input
                  type="text"
                  value={editingProduct.sku}
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
                <label>Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Specifications (separate items with semicolon ;)</label>
                <textarea
                  rows={3}
                  value={editingProduct.specifications}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, specifications: e.target.value })
                  }
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Applications & Uses (separate with semicolon ;)</label>
                <textarea
                  rows={2}
                  value={editingProduct.applications}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, applications: e.target.value })
                  }
                />
              </div>

              {/* Upload Image */}
              <div className={styles.formGroup}>
                <label>Product Image URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProduct.images?.[0] || editingProduct.image || ''}
                    placeholder="images/components/p02-1.jpg"
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        image: e.target.value,
                        images: [e.target.value],
                      })
                    }
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProduct({
                              ...editingProduct,
                              image: url,
                              images: [url, ...(editingProduct.images || [])],
                            });
                            showToast('Image uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Upload PDF */}
              <div className={styles.formGroup}>
                <label>PDF Datasheet / Manual URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProduct.pdf || ''}
                    placeholder="docs/kits/guide.pdf"
                    onChange={(e) => setEditingProduct({ ...editingProduct, pdf: e.target.value })}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProduct({ ...editingProduct, pdf: url });
                            showToast('PDF uploaded!');
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
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRACTICAL EDIT MODAL */}
      {editingPractical && (
        <div className="modal-backdrop" onClick={() => setEditingPractical(null)}>
          <div
            className="modal"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>Edit Practical Experiment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                savePractical(editingPractical);
                setEditingPractical(null);
                showToast(`Saved ${editingPractical.title} to MongoDB!`);
              }}
              className={styles.formGrid}
            >
              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Experiment Title</label>
                <input
                  type="text"
                  value={editingPractical.title}
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
                <label>Linked Product/Board</label>
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
                <label>Experiment Goal / Objective</label>
                <textarea
                  rows={2}
                  value={editingPractical.goal}
                  onChange={(e) =>
                    setEditingPractical({ ...editingPractical, goal: e.target.value })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Step-by-step Procedures (separate with semicolon ;)</label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(editingPractical.steps)
                      ? editingPractical.steps.join('; ')
                      : editingPractical.steps
                  }
                  onChange={(e) =>
                    setEditingPractical({
                      ...editingPractical,
                      steps: e.target.value.split(';').map((s) => s.trim()),
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Lab Image URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingPractical.images?.[0] || ''}
                    placeholder="images/components/p04-1.jpg"
                    onChange={(e) =>
                      setEditingPractical({
                        ...editingPractical,
                        images: [e.target.value],
                      })
                    }
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingPractical({
                              ...editingPractical,
                              images: [url, ...(editingPractical.images || [])],
                            });
                            showToast('Lab image uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Lab Sheet PDF URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingPractical.pdf || ''}
                    placeholder="docs/practicals/lab.pdf"
                    onChange={(e) => setEditingPractical({ ...editingPractical, pdf: e.target.value })}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
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
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingPractical(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT EDIT MODAL */}
      {editingProject && (
        <div className="modal-backdrop" onClick={() => setEditingProject(null)}>
          <div
            className="modal"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>Edit Robotics & IoT Project</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProject(editingProject);
                setEditingProject(null);
                showToast(`Saved ${editingProject.title} to MongoDB!`);
              }}
              className={styles.formGrid}
            >
              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Linked Board / Starter Kit</label>
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
                <label>Hardware Kit Required</label>
                <input
                  type="text"
                  value={editingProject.kit}
                  onChange={(e) => setEditingProject({ ...editingProject, kit: e.target.value })}
                  placeholder="e.g. 4WD Chassis + Arduino UNO + Ultrasonic"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Summary / Abstract</label>
                <textarea
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>What You Learn</label>
                <input
                  type="text"
                  value={editingProject.learn}
                  onChange={(e) => setEditingProject({ ...editingProject, learn: e.target.value })}
                  placeholder="Sensors • Motor Control • Architecture"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label>Upgrade Ideas</label>
                <input
                  type="text"
                  value={editingProject.upgrade}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, upgrade: e.target.value })
                  }
                  placeholder="Add Bluetooth override, OLED HUD, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Project Blueprint Image URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProject.images?.[0] || ''}
                    placeholder="images/components/p21-kit.jpg"
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        images: [e.target.value],
                      })
                    }
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProject({
                              ...editingProject,
                              images: [url, ...(editingProject.images || [])],
                            });
                            showToast('Project image uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Blueprint PDF URL / Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingProject.pdf || ''}
                    placeholder="docs/projects/blueprint.pdf"
                    onChange={(e) => setEditingProject({ ...editingProject, pdf: e.target.value })}
                  />
                  <label
                    className="secondary"
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Upload size={14} /> Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
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
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUOTE EDIT MODAL */}
      {editingQuote && (
        <div className="modal-backdrop" onClick={() => setEditingQuote(null)}>
          <div
            className="modal"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>Edit Quote</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveQuote(editingQuote);
                setEditingQuote(null);
                showToast('Saved quote to MongoDB!');
              }}
              style={{ display: 'grid', gap: '14px' }}
            >
              <div className={styles.formGroup}>
                <label>Quote Text</label>
                <textarea
                  rows={3}
                  value={editingQuote.text}
                  onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Author</label>
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
                }}
              >
                <button type="button" className="secondary" onClick={() => setEditingQuote(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
