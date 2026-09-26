/**
 * Creative Learning - Data Export and Download Utilities
 * Supports generating formatted CSVs, JSON Master Backups, and 1-Click "Download All"
 */

import { Product, RoboticsKit, PracticalExperiment, EngineeringProject, StoreSettings } from '@/types';

// Helper to escape values for RFC 4180 CSV standard
export function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  const stringValue = String(value);
  // If string contains quotes, commas, newlines, wrap in quotes and escape internal quotes
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

// Browser file download trigger
export function triggerFileDownload(content: string, fileName: string, mimeType: string = 'text/csv;charset=utf-8;') {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 1. Export Products to CSV
export function exportProductsToCSV(products: Product[]) {
  const headers = [
    'id', 'sku', 'name', 'category', 'price', 'originalPrice', 'hidePrice', 
    'rating', 'reviewsCount', 'inStock', 'stockQuantity', 'voltage', 'image', 
    'shortDescription', 'description', 'specs', 'pinout', 'datasheetUrl', 'createdAt'
  ];

  const rows = products.map((p) => [
    escapeCsvCell(p.id),
    escapeCsvCell(p.sku),
    escapeCsvCell(p.name),
    escapeCsvCell(p.category),
    escapeCsvCell(p.price),
    escapeCsvCell(p.originalPrice || ''),
    escapeCsvCell(p.hidePrice ? 'true' : 'false'),
    escapeCsvCell(p.rating || 4.8),
    escapeCsvCell(p.reviewsCount || 0),
    escapeCsvCell(p.inStock ? 'true' : 'false'),
    escapeCsvCell(p.stockQuantity ?? 100),
    escapeCsvCell(p.voltage || ''),
    escapeCsvCell(p.image || ''),
    escapeCsvCell(p.shortDescription || ''),
    escapeCsvCell(p.description || ''),
    escapeCsvCell(p.specs ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('; ') : ''),
    escapeCsvCell(p.pinout ? p.pinout.join('; ') : ''),
    escapeCsvCell(p.pdfUrl || p.datasheetUrl || ''),
    escapeCsvCell(p.createdAt || new Date().toISOString())
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  triggerFileDownload(csvContent, `products_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
}

// 2. Export Robotics Starter Kits to CSV
export function exportKitsToCSV(kits: RoboticsKit[]) {
  const headers = [
    'id', 'title', 'subtitle', 'difficulty', 'ageRange', 'price', 'originalPrice', 
    'hidePrice', 'rating', 'reviewsCount', 'image', 'badge', 'features', 'bomList', 
    'learningOutcomes', 'buildTimeHours', 'codeLanguage', 'manualUrl', 'createdAt'
  ];

  const rows = kits.map((k) => [
    escapeCsvCell(k.id),
    escapeCsvCell(k.title),
    escapeCsvCell(k.subtitle || ''),
    escapeCsvCell(k.difficulty || 'Beginner'),
    escapeCsvCell(k.ageRange || ''),
    escapeCsvCell(k.price),
    escapeCsvCell(k.originalPrice || ''),
    escapeCsvCell(k.hidePrice ? 'true' : 'false'),
    escapeCsvCell(k.rating || 4.9),
    escapeCsvCell(k.reviewsCount || 0),
    escapeCsvCell(k.image || ''),
    escapeCsvCell(k.badge || ''),
    escapeCsvCell(k.features ? k.features.join('; ') : ''),
    escapeCsvCell(k.bomList ? k.bomList.map(b => `${b.item}: ${b.qty}`).join('; ') : ''),
    escapeCsvCell(k.learningOutcomes ? k.learningOutcomes.join('; ') : ''),
    escapeCsvCell(k.buildTimeHours || 2),
    escapeCsvCell(k.codeLanguage ? k.codeLanguage.join('; ') : ''),
    escapeCsvCell(k.pdfUrl || k.manualUrl || ''),
    escapeCsvCell(k.createdAt || new Date().toISOString())
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  triggerFileDownload(csvContent, `starter_kits_${new Date().toISOString().slice(0, 10)}.csv`);
}

// 3. Export Engineering Projects to CSV
export function exportProjectsToCSV(projects: EngineeringProject[]) {
  const headers = [
    'id', 'title', 'category', 'difficulty', 'estimatedCost', 'hidePrice', 
    'rating', 'reviewsCount', 'image', 'description', 'highlights', 'bom', 
    'cadModelAvailable', 'gerberAvailable', 'circuitTopology', 'pdfUrl', 'createdAt'
  ];

  const rows = projects.map((proj) => [
    escapeCsvCell(proj.id),
    escapeCsvCell(proj.title),
    escapeCsvCell(proj.category || 'Robotics & Automation'),
    escapeCsvCell(proj.difficulty || 'Intermediate'),
    escapeCsvCell(proj.estimatedCost || 0),
    escapeCsvCell(proj.hidePrice ? 'true' : 'false'),
    escapeCsvCell(proj.rating || 4.9),
    escapeCsvCell(proj.reviewsCount || 0),
    escapeCsvCell(proj.image || ''),
    escapeCsvCell(proj.description || ''),
    escapeCsvCell(proj.highlights ? proj.highlights.join('; ') : ''),
    escapeCsvCell(proj.bom ? proj.bom.map(b => `${b.name}: ${b.qty} (₹${b.unitPrice || 0})`).join('; ') : ''),
    escapeCsvCell(proj.cadModelAvailable ? 'true' : 'false'),
    escapeCsvCell(proj.gerberAvailable ? 'true' : 'false'),
    escapeCsvCell(proj.circuitTopology || ''),
    escapeCsvCell(proj.pdfUrl || ''),
    escapeCsvCell(proj.createdAt || new Date().toISOString())
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  triggerFileDownload(csvContent, `engineering_projects_${new Date().toISOString().slice(0, 10)}.csv`);
}

// 4. Export Practicals to CSV
export function exportPracticalsToCSV(practicals: PracticalExperiment[]) {
  const headers = [
    'id', 'title', 'level', 'topic', 'durationMin', 'description', 'objective', 
    'requiredComponents', 'troubleshootingTips', 'pdfUrl', 'createdAt'
  ];

  const rows = practicals.map((p) => [
    escapeCsvCell(p.id),
    escapeCsvCell(p.title),
    escapeCsvCell(p.level || 'Beginner'),
    escapeCsvCell(p.topic || ''),
    escapeCsvCell(p.durationMin || 30),
    escapeCsvCell(p.description || ''),
    escapeCsvCell(p.objective || ''),
    escapeCsvCell(p.requiredComponents ? p.requiredComponents.map(c => `${c.name}: ${c.qty}`).join('; ') : ''),
    escapeCsvCell(p.troubleshootingTips ? p.troubleshootingTips.join('; ') : ''),
    escapeCsvCell(p.pdfUrl || ''),
    escapeCsvCell(p.createdAt || new Date().toISOString())
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  triggerFileDownload(csvContent, `guided_practicals_${new Date().toISOString().slice(0, 10)}.csv`);
}

// 5. Export Orders to CSV
export function exportOrdersToCSV(orders: any[]) {
  const headers = [
    'orderId', 'createdAt', 'status', 'totalAmount', 'paymentMethod', 
    'customerName', 'customerPhone', 'customerCity', 'customerAddress', 
    'customerPincode', 'itemsCount', 'orderItemsSummary', 'customerNotes'
  ];

  const rows = orders.map((o) => {
    const cust = o.customer || {};
    const items = o.items || [];
    const itemsSummary = items.map((it: any) => `${it.name} (x${it.quantity || 1} @ ₹${it.price || 0})`).join('; ');

    return [
      escapeCsvCell(o.orderId || o.id || ''),
      escapeCsvCell(o.createdAt || ''),
      escapeCsvCell(o.status || 'Pending'),
      escapeCsvCell(o.totalAmount || 0),
      escapeCsvCell(cust.paymentMethod || o.paymentMethod || 'WhatsApp Pay / UPI'),
      escapeCsvCell(cust.name || o.customerName || ''),
      escapeCsvCell(cust.phone || o.phone || ''),
      escapeCsvCell(cust.city || o.city || ''),
      escapeCsvCell(cust.address || o.address || ''),
      escapeCsvCell(cust.pincode || o.pincode || ''),
      escapeCsvCell(items.length),
      escapeCsvCell(itemsSummary),
      escapeCsvCell(cust.notes || o.notes || '')
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  triggerFileDownload(csvContent, `whatsapp_orders_${new Date().toISOString().slice(0, 10)}.csv`);
}

// 6. Export Full JSON Master Backup
export function exportAllDataJSON(data: {
  products: Product[];
  kits: RoboticsKit[];
  projects: EngineeringProject[];
  practicals: PracticalExperiment[];
  orders: any[];
  categories: string[];
  settings: StoreSettings;
}) {
  const masterPayload = {
    exportedAt: new Date().toISOString(),
    storeName: data.settings?.storeName || 'Creative Learning',
    whatsappNumber: data.settings?.whatsappNumber || '+919714045096',
    metadata: {
      totalProducts: data.products.length,
      totalKits: data.kits.length,
      totalProjects: data.projects.length,
      totalPracticals: data.practicals.length,
      totalOrders: data.orders.length,
      totalCategories: data.categories.length,
    },
    products: data.products,
    kits: data.kits,
    projects: data.projects,
    practicals: data.practicals,
    orders: data.orders,
    categories: data.categories,
    settings: data.settings,
  };

  const jsonString = JSON.stringify(masterPayload, null, 2);
  triggerFileDownload(
    jsonString, 
    `creative_learning_master_backup_${new Date().toISOString().slice(0, 10)}.json`, 
    'application/json;charset=utf-8;'
  );
}

// 7. 1-Click "Download All Things" (Full JSON Master Backup + CSVs for each entity)
export function downloadAllThings(data: {
  products: Product[];
  kits: RoboticsKit[];
  projects: EngineeringProject[];
  practicals: PracticalExperiment[];
  orders: any[];
  categories: string[];
  settings: StoreSettings;
}) {
  // 1. Download Master JSON first
  exportAllDataJSON(data);

  // 2. Download CSVs with small stagger intervals so browser saves each file without collision
  setTimeout(() => exportProductsToCSV(data.products), 300);
  setTimeout(() => exportKitsToCSV(data.kits), 600);
  setTimeout(() => exportProjectsToCSV(data.projects), 900);
  setTimeout(() => exportPracticalsToCSV(data.practicals), 1200);
  if (data.orders && data.orders.length > 0) {
    setTimeout(() => exportOrdersToCSV(data.orders), 1500);
  }
}
