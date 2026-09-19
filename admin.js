const DATA_KEY = 'cl_admin_data_v1';
const AUTH_KEY = 'cl_admin_auth_v2';
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_RECOVERY_CODE = 'CREATIVE-LEARNING-RESET';
const CATALOG_VERSION = 2;

const $ = (s) => document.querySelector(s);
let data = {
  catalogVersion: CATALOG_VERSION,
  company: {
    name: 'Creative Learning',
    tagline: 'Education can Transform a Nation',
    phone: '+91 97140 45096',
    whatsapp: '+91 97140 45096',
    email: 'vhp10995@gmail.com',
    heroImage: 'images/source-pages/page-01.jpg'
  },
  products: Array.isArray(window.CREATIVE_LEARNING_PRODUCTS) ? window.CREATIVE_LEARNING_PRODUCTS : [],
  learningMedia: { components: {}, kits: {}, practical: {}, projects: {} },
  learningContent: { practical: {}, projects: {} },
  quotes: [{ id: 'q-1', text: 'The future belongs to people who build what they imagine.', author: 'Creative Learning' }],
  heroQuoteId: 'q-1'
};

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

const DEFAULT_PRACTICAL_EDITORS = [
  {key:'ultrasonic-distance-lab',title:'Ultrasonic Distance Lab',product:'p02-1',level:'Beginner',time:'25 min',goal:'Understand distance sensing and threshold logic.',steps:'Wire VCC, GND and TRIG/ECHO; Read the distance value; Set a near/far LED or buzzer rule'},
  {key:'soil-moisture-test',title:'Soil Moisture Test',product:'p02-2',level:'Beginner',time:'30 min',goal:'Learn how an analog sensor becomes a useful decision.',steps:'Insert the probe in dry soil; Read the analog value; Compare dry vs. wet readings'},
  {key:'temperature-monitoring',title:'Temperature Monitoring',product:'p02-3',level:'Beginner',time:'25 min',goal:'Convert sensor readings into a meaningful temperature display.',steps:'Connect the analog temperature sensor; Read the voltage; Calibrate and display temperature'}
];
const DEFAULT_PROJECT_EDITORS = [
  {key:'obstacle-avoiding-robot',title:'Obstacle Avoiding Robot',product:'p02-1',kit:'Ultrasonic + motors + driver',summary:'A mobile robot that measures distance and changes direction when an obstacle is detected.',learn:'Sensors • motor control • decision making',upgrade:'Add Bluetooth manual override and an OLED status screen.'},
  {key:'smart-plant-watering',title:'Smart Plant Watering',product:'p02-2',kit:'Smart irrigation sensors + pump',summary:'Automate watering using soil moisture feedback and a pump/relay control stage.',learn:'Sensing • automation • control',upgrade:'Add a water-flow sensor and phone alerts.'},
  {key:'wireless-appliance-controller',title:'Wireless Appliance Controller',product:'p02-3',kit:'Arduino + relay module',summary:'Build a simple controller that switches a low-voltage load safely.',learn:'Control logic • switching • prototyping',upgrade:'Add a wireless module and browser dashboard.'}
];
function ensureLearningContent(){
  data.learningContent=data.learningContent||{practical:{},projects:{}};
  data.learningContent.practical=data.learningContent.practical||{};
  data.learningContent.projects=data.learningContent.projects||{};
  if(!data.learningContentSeeded){
    if(Object.keys(data.learningContent.practical).length===0) DEFAULT_PRACTICAL_EDITORS.forEach(x=>data.learningContent.practical[x.key]={...x});
    if(Object.keys(data.learningContent.projects).length===0) DEFAULT_PROJECT_EDITORS.forEach(x=>data.learningContent.projects[x.key]={...x});
    data.learningContentSeeded=true;
  }
}

function save() {
  ensureQuotes();
  data.catalogVersion = CATALOG_VERSION;
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save quota note:', err);
  }
}

function compressImageForAdmin(file, maxDimension = 1400, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const isImg = (file.type && file.type.startsWith('image/')) || /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(file.name || '');
    if (!isImg) {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      const cleanup = () => { try { URL.revokeObjectURL(url); } catch (_) {} };
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          if (!w || !h) { cleanup(); return resolve(''); }
          if (w > maxDimension || h > maxDimension) {
            if (w > h) { h = Math.round((h * maxDimension) / w); w = maxDimension; }
            else { w = Math.round((w * maxDimension) / h); h = maxDimension; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) { cleanup(); return resolve(''); }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          cleanup();
          resolve(dataUrl);
        } catch (e) {
          cleanup();
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
          reader.readAsDataURL(file);
        }
      };
      img.onerror = () => {
        cleanup();
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(file);
      };
      img.src = url;
    } catch (_) {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.readAsDataURL(file);
    }
  });
}

async function uploadOrCompressImage(file) {
  if (!file) return '';
  const compressed = await compressImageForAdmin(file);
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const result = await res.json();
      const url = result?.url || (Array.isArray(result?.urls) && result.urls[0]);
      if (url) return url;
    }
  } catch (_) {}
  return compressed;
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY) || 'null');
    if (saved?.catalogVersion === CATALOG_VERSION) {
      data = {
        ...data, ...saved,
        catalogVersion: CATALOG_VERSION,
        company: { ...data.company, ...(saved.company || {}) },
        learningMedia: { components: {}, kits: {}, practical: {}, projects: {}, ...(saved.learningMedia || {}) },
        learningContent: { practical: {}, projects: {}, ...(saved.learningContent || {}) },
        quotes: Array.isArray(saved.quotes) ? saved.quotes : (saved.quote?.text ? [{ id: 'q-1', text: saved.quote.text, author: saved.quote.author || 'Creative Learning' }] : data.quotes),
        heroQuoteId: saved.heroQuoteId || (Array.isArray(saved.quotes) && saved.quotes[0]?.id) || '',
        learningContentSeeded: true
      };
    } else if (saved) {
      // New catalogue version: keep company settings and media where possible,
      // but reset the catalogue/learning items to the requested 3+3+3+3 seed.
      data.company = { ...data.company, ...(saved.company || {}) };
      data.learningMedia = { components: {}, kits: {}, practical: {}, projects: {}, ...(saved.learningMedia || {}) };
      data.catalogVersion = CATALOG_VERSION;
      data.learningContentSeeded = false;
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
    ensureLearningContent();
  } catch (_) {}
}

async function hash(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function ensureAuth() {
  let auth = null;
  try { auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (_) {}
  if (auth?.passwordHash && auth?.recoveryHash) return auth;
  auth = {
    passwordHash: await hash(DEFAULT_PASSWORD),
    recoveryHash: await hash(DEFAULT_RECOVERY_CODE),
    initializedAt: new Date().toISOString()
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  return auth;
}

async function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (_) { return null; }
}

function setStatus(selector, message, kind = '') {
  const el = $(selector);
  if (!el) return;
  el.textContent = message;
  el.className = `form-status ${kind}`.trim();
}

function showApp() {
  $('#login').hidden = true;
  $('#app').hidden = false;
  ensureLearningContent();
  fillCompany();
  renderQuoteEditors();
  renderProducts();
  renderLearningEditors();
}

function ensureQuotes(){
  if(Array.isArray(data.quotes)) return;
  data.quotes = data.quote?.text ? [{id:'q-1', text:data.quote.text, author:data.quote.author||'Creative Learning'}] : [];
  delete data.quote;
}

function renderQuoteEditors(){
  ensureQuotes();
  renderHeroQuoteSelector();
  const list=$('#quoteEditorList');
  if(!list) return;
  if(!data.quotes.length){
    list.innerHTML='<div class=\"quote-empty\">No quotes yet. Add your first quote above.</div>';
    return;
  }
  list.innerHTML=data.quotes.map((q,i)=>`
    <article class=\"quote-editor-card\" data-quote-id=\"${esc(q.id)}\">
      <div class=\"quote-editor-head\"><div><span class=\"quote-number\">QUOTE ${String(i+1).padStart(2,'0')}</span><h3>Quote ${i+1}</h3></div><button type=\"button\" class=\"danger-outline remove-quote\" data-id=\"${esc(q.id)}\">Remove</button></div>
      <div class=\"quote-form-grid\">
        <label>Quote text<textarea data-field=\"text\" rows=4>${esc(q.text)}</textarea></label>
        <label>Author<input data-field=\"author\" value=\"${esc(q.author||'')}\" placeholder=\"Author name"></label>
      </div>
      <div class=\"product-footer-actions quote-actions\"><button type=\"button\" class=\"primary-btn save-quote\" data-id=\"${esc(q.id)}\">Save quote</button><span class=\"status quote-item-status\" aria-live=\"polite\"></span></div>
    </article>`).join('');
}


function renderHeroQuoteSelector(){
  const select=$('#heroQuoteSelect');
  if(!select) return;
  ensureQuotes();
  const current=String(data.heroQuoteId||'');
  select.innerHTML='<option value="">Auto-select a saved quote</option>'+data.quotes.map((q,i)=>`<option value="${esc(q.id)}">Quote ${String(i+1).padStart(2,'0')} — ${esc((q.text||'').slice(0,70))}</option>`).join('');
  select.value=data.quotes.some(q=>String(q.id)===current)?current:'';
}
function saveHeroQuoteSelection(){
  const select=$('#heroQuoteSelect');
  if(!select) return;
  data.heroQuoteId=select.value||'';
  save();
  setStatus('#heroQuoteStatus','✓ Hero quote updated','success');
}

function addQuote(){
  const text=$('#newQuoteText')?.value.trim();
  const author=$('#newQuoteAuthor')?.value.trim() || 'Creative Learning';
  if(!text){ setStatus('#quoteStatus','Quote text is required.','error'); return; }
  data.quotes = Array.isArray(data.quotes) ? data.quotes : [];
  const newQuote={id:'q-'+Date.now().toString(36),text,author};
  data.quotes.push(newQuote);
  if(!data.heroQuoteId) data.heroQuoteId=newQuote.id;
  save();
  $('#newQuoteText').value=''; $('#newQuoteAuthor').value='';
  renderQuoteEditors();
  setStatus('#quoteStatus','✓ Added & published','success');
}

function saveQuoteItem(id, card){
  const q=data.quotes.find(x=>x.id===id); if(!q) return;
  q.text=card.querySelector('[data-field=\"text\"]').value.trim();
  q.author=card.querySelector('[data-field=\"author\"]').value.trim() || 'Creative Learning';
  if(!q.text){ setStatus(card.querySelector('.quote-item-status'),'Quote text is required.','error'); return; }
  save();
  setStatus(card.querySelector('.quote-item-status'),'✓ Saved','success');
}

function removeQuote(id){
  const q=data.quotes.find(x=>x.id===id); if(!q) return;
  data.quotes=data.quotes.filter(x=>x.id!==id);
  if(data.heroQuoteId===id) data.heroQuoteId=data.quotes[0]?.id||'';
  save(); renderQuoteEditors(); setStatus('#quoteStatus','✓ Removed & published','success');
}

function fillCompany() {
  Object.entries(data.company).forEach(([k, v]) => {
    const el = $('#' + k);
    if (el) el.value = v;
  });
}

function productImagePreview(p) {
  const fallback = p.image || (p.page ? `images/source-pages/page-${String(p.page).padStart(2,'0')}.jpg` : '');
  return fallback ? `<img src="${esc(fallback)}" alt="${esc(p.name)}" onerror="this.onerror=null;this.parentElement.classList.add('empty');this.remove()">` : '<span>No image</span>';
}

function renderProducts() {
  const q = $('#search').value.trim().toLowerCase();
  const list = data.products.filter((p) => [p.name, p.category, p.description, p.id].join(' ').toLowerCase().includes(q));
  $('#products').innerHTML = list.map((p) => `
    <article class="product product-card-admin" data-product-card="${esc(p.id)}">
      <div class="product-admin-head">
        <div class="product-title-wrap">
          <div class="admin-product-thumb">${productImagePreview(p)}</div>
          <div>
            <b>${esc(p.name)}</b>
            <span>${esc(p.id)}${p.category ? ` • ${esc(p.category)}` : ''}</span>
          </div>
        </div>
        <button class="danger-outline remove-product" data-id="${esc(p.id)}" type="button">Remove product</button>
      </div>

      <div class="product-fields">
        <label>Name<input data-k="name" value="${esc(p.name)}"></label>
        <label>SKU<input data-k="sku" value="${esc(p.sku || `CL-${String(p.id).toUpperCase()}`)}" placeholder="e.g. CL-P25"></label>
        <label>Category<input data-k="category" value="${esc(p.category)}"></label>
        <label class="wide">Description<textarea data-k="description">${esc(p.description)}</textarea></label>
        <label>Price<input data-k="price" value="${esc(p.price)}"></label>
        <label>Image path<input data-k="image" value="${esc(p.image)}"></label>
        <label class="wide">Specifications<textarea data-k="specifications">${esc(p.specifications)}</textarea></label>
        <label class="wide">Applications<textarea data-k="applications">${esc(p.applications)}</textarea></label>
      </div>

      <div class="product-image-tools product-image-tools-multi">
        <div>
          <strong>Product images</strong>
          <small>Upload multiple JPG, PNG or WebP images. All selected images appear on the website in a horizontal gallery.</small>
        </div>
        <div class="image-tool-actions">
          <label class="upload-btn">＋ Add images<input class="product-image-file" data-id="${esc(p.id)}" type="file" accept="image/*" multiple hidden></label>
          <button class="secondary-btn remove-image" data-id="${esc(p.id)}" type="button">Remove all images</button>
        </div>
      </div>
      <div class="product-image-gallery-admin">
        ${(productImages(p).length ? productImages(p).map((src, i) => `<div class="admin-media-thumb"><img src="${esc(src)}" alt="${esc(p.name)} image ${i+1}"><button type="button" class="remove-product-image" data-id="${esc(p.id)}" data-index="${i}" aria-label="Remove image">×</button></div>`).join('') : '<span class="media-empty">No product images uploaded.</span>')}
      </div>

      <div class="product-footer-actions">
        <button class="save-product primary-btn" data-id="${esc(p.id)}" type="button">Save changes</button>
        <span id="status-${esc(p.id)}" class="status" aria-live="polite"></span>
      </div>
    </article>`).join('') || '<div class="empty-state-card"><strong>No products found</strong><span>Try another search or add a new product.</span></div>';

  document.querySelectorAll('.save-product').forEach((btn) => btn.onclick = () => saveProduct(btn.dataset.id));
  document.querySelectorAll('.remove-product').forEach((btn) => btn.onclick = () => removeProduct(btn.dataset.id));
  document.querySelectorAll('.product-image-file').forEach((input) => input.onchange = () => handleProductImages(input.dataset.id, [...(input.files || [])]));
  document.querySelectorAll('.remove-image').forEach((btn) => btn.onclick = () => removeProductImage(btn.dataset.id));
  document.querySelectorAll('.remove-product-image').forEach((btn) => btn.onclick = () => removeSingleProductImage(btn.dataset.id, Number(btn.dataset.index)));
}

function saveProduct(id) {
  const p = data.products.find((x) => x.id === id);
  const button = document.querySelector(`.save-product[data-id="${CSS.escape(id)}"]`);
  if (!p || !button) return;
  const card = button.closest('.product');
  card.querySelectorAll('[data-k]').forEach((el) => p[el.dataset.k] = el.value);
  save();
  setStatus(`#status-${CSS.escape(id)}`, 'Saved successfully ✓', 'success');
  renderProducts();
  const status = document.querySelector(`#status-${CSS.escape(id)}`);
  if (status) { status.textContent = 'Saved successfully ✓'; status.className = 'status success'; setTimeout(() => status.textContent = '', 1800); }
}

async function readImageAsDataUrl(file) {
  return await uploadOrCompressImage(file);
}

function productImages(p) {
  const list = Array.isArray(p?.images) ? p.images.filter(Boolean) : [];
  if (list.length) return list;
  return p?.image ? [p.image] : [];
}

async function handleProductImages(id, files) {
  if (!files || !files.length) return;
  try {
    const p = data.products.find((x) => x.id === id);
    if (!p) return;
    const images = productImages(p).slice();
    for (const file of files) {
      const url = await uploadOrCompressImage(file);
      if (url) images.push(url);
    }
    p.images = images;
    p.image = images[0] || '';
    save();
    renderProducts();
  } catch (e) {
    console.error(e);
    alert(e.message || 'Unable to upload images.');
  }
}

function removeSingleProductImage(id, index) {
  const p = data.products.find((x) => x.id === id);
  if (!p) return;
  const images = productImages(p).slice();
  images.splice(index, 1);
  p.images = images;
  p.image = images[0] || '';
  save();
  renderProducts();
}

function removeProductImage(id) {
  const p = data.products.find((x) => x.id === id);
  if (!p) return;
  p.images = [];
  p.image = '';
  save();
  renderProducts();
}

function removeProduct(id) {
  const p = data.products.find((x) => x.id === id);
  if (!p) return;
  if (!confirm(`Remove “${p.name}” from the website catalogue? This cannot be undone from this browser.`)) return;
  data.products = data.products.filter((x) => x.id !== id);
  save();
  renderProducts();
  renderComponentList();
  fetch('/api/products?id=' + encodeURIComponent(id), { method: 'DELETE' }).catch(() => {});
}

function resetNewProductForm() {
  $('#addProductForm').reset();
  newProductImageData = '';
  $('#newProductImagePreview').className = 'image-preview empty';
  $('#newProductImagePreview').innerHTML = '<span>Product image</span>';
  $('#removeNewProductImageBtn').hidden = true;
  setStatus('#addProductStatus', '');
}

let newProductImageData = '';

async function handleNewProductImage(file) {
  if (!file) return;
  try {
    newProductImageData = await readImageAsDataUrl(file);
    $('#newProductImagePreview').className = 'image-preview';
    $('#newProductImagePreview').innerHTML = `<img src="${esc(newProductImageData)}" alt="New product preview">`;
    $('#removeNewProductImageBtn').hidden = false;
  } catch (e) {
    setStatus('#addProductStatus', e.message || 'Unable to upload image.', 'error');
  }
}

$('#addProductBtn').onclick = () => {
  $('#addProductPanel').hidden = false;
  $('#newProductId').focus();
};

$('#closeAddProductBtn').onclick = resetNewProductForm;
$('#cancelAddProductBtn').onclick = resetNewProductForm;
$('#newProductImageFile').onchange = (e) => handleNewProductImage(e.target.files?.[0]);
$('#removeNewProductImageBtn').onclick = () => {
  newProductImageData = '';
  $('#newProductImageFile').value = '';
  $('#newProductImagePreview').className = 'image-preview empty';
  $('#newProductImagePreview').innerHTML = '<span>Product image</span>';
  $('#removeNewProductImageBtn').hidden = true;
};

$('#addProductForm').onsubmit = (e) => {
  e.preventDefault();
  const id = $('#newProductId').value.trim();
  const name = $('#newProductName').value.trim();
  const category = $('#newProductCategory').value.trim();
  const description = $('#newProductDescription').value.trim();
  if (!id || !name || !category || !description) return setStatus('#addProductStatus', 'Please complete ID, name, category and description.', 'error');
  if (data.products.some((p) => String(p.id).toLowerCase() === id.toLowerCase())) return setStatus('#addProductStatus', 'That Product ID / SKU already exists.', 'error');

  data.products.push({
    id, name, category, page: '',
    description,
    specifications: $('#newProductSpecifications').value.trim(),
    applications: $('#newProductApplications').value.trim(),
    image: newProductImageData,
    price: $('#newProductPrice').value.trim() || 'Contact for price',
    sku: $('#newProductSku').value.trim() || `CL-${id.toUpperCase()}`
  });
  save();
  renderProducts();
  renderComponentList();
  setStatus('#addProductStatus', `${name} added successfully ✓`, 'success');
  setTimeout(resetNewProductForm, 900);
};

async function login(password) {
  const auth = await ensureAuth();
  if (await hash(password) === auth.passwordHash) {
    sessionStorage.setItem('cl_admin_session', '1');
    showApp();
    setStatus('#loginStatus', '');
    return true;
  }
  setStatus('#loginStatus', 'Incorrect admin password.', 'error');
  return false;
}

$('#loginForm').onsubmit = async (e) => {
  e.preventDefault();
  await login($('#password').value);
};

$('#forgotBtn').onclick = () => {
  $('#resetPanel').hidden = false;
  $('#recoveryCode').focus();
  setStatus('#loginStatus', '');
};

$('#closeResetBtn').onclick = () => {
  $('#resetPanel').hidden = true;
  $('#resetForm').reset();
  setStatus('#resetStatus', '');
};

$('#resetForm').onsubmit = async (e) => {
  e.preventDefault();
  const recovery = $('#recoveryCode').value.trim();
  const next = $('#newPassword').value;
  const confirm = $('#confirmPassword').value;
  const auth = await ensureAuth();
  if (!recovery || !next || !confirm) return setStatus('#resetStatus', 'Please complete all fields.', 'error');
  if (next.length < 8) return setStatus('#resetStatus', 'New password must be at least 8 characters.', 'error');
  if (next !== confirm) return setStatus('#resetStatus', 'Passwords do not match.', 'error');
  if (await hash(recovery) !== auth.recoveryHash) return setStatus('#resetStatus', 'Invalid recovery code.', 'error');
  auth.passwordHash = await hash(next);
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  $('#resetForm').reset();
  $('#resetPanel').hidden = true;
  setStatus('#loginStatus', 'Password reset successfully. You can now log in.', 'success');
};

$('#securityForm').onsubmit = async (e) => {
  e.preventDefault();
  const current = $('#currentPassword').value;
  const next = $('#changePassword').value;
  const confirm = $('#changePasswordConfirm').value;
  const recovery = $('#changeRecovery').value.trim();
  const auth = await getAuth();
  if (!auth) return setStatus('#securityStatus', 'Security settings are unavailable. Reload the page.', 'error');
  if (await hash(current) !== auth.passwordHash) return setStatus('#securityStatus', 'Current password is incorrect.', 'error');
  if (next && next.length < 8) return setStatus('#securityStatus', 'New password must be at least 8 characters.', 'error');
  if (next && next !== confirm) return setStatus('#securityStatus', 'New passwords do not match.', 'error');
  if (recovery && recovery.length < 8) return setStatus('#securityStatus', 'Recovery code must be at least 8 characters.', 'error');
  if (!next && !recovery) return setStatus('#securityStatus', 'Enter a new password or a new recovery code.', 'error');
  if (next) auth.passwordHash = await hash(next);
  if (recovery) auth.recoveryHash = await hash(recovery);
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  $('#securityForm').reset();
  setStatus('#securityStatus', '✓ Saved', 'success');
};

$('#saveCompany').onclick = () => {
  ['name', 'tagline', 'phone', 'whatsapp', 'email'].forEach((k) => data.company[k] = $('#' + k).value);
  save();
  setStatus('#companyStatus', '✓ Saved', 'success');
};

function slugify(value){return String(value||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function addKitFromForm(){
  const f=$('#addKitForm'); if(!f)return; const fd=new FormData(f); const name=String(fd.get('name')||'').trim();
  if(!name)return setStatus('#kitAddStatus','Kit name is required.','error');
  const base=slugify(name)||'kit'; let id='kit-'+base, n=2; while(data.products.some(p=>p.id===id))id=`kit-${base}-${n++}`;
  data.products.push({id,name,category:'Starter Kits',page:0,description:String(fd.get('description')||'').trim(),specifications:String(fd.get('specifications')||'').trim(),applications:String(fd.get('applications')||'').trim(),image:'',images:[],price:String(fd.get('price')||'Contact for price').trim()||'Contact for price',sku:String(fd.get('sku')||`CL-${id.toUpperCase()}`).trim()});
  save(); f.reset(); $('#addKitPanel').hidden=true; setStatus('#kitAddStatus','Kit added ✓','success'); renderLearningEditors(); renderProducts(); renderComponentList();
}
function addPracticalFromForm(){
  const f=$('#addPracticalForm'); const fd=new FormData(f); const title=String(fd.get('title')||'').trim(); if(!title)return setStatus('#practicalAddStatus','Practical name is required.','error');
  const base=slugify(title)||'practical'; let key=base,n=2; while(data.learningContent.practical[key])key=`${base}-${n++}`;
  data.learningContent.practical[key]={key,title,product:String(fd.get('product')||'').trim(),sku:String(fd.get('sku')||'').trim(),level:String(fd.get('level')||'Beginner').trim(),time:String(fd.get('time')||'30 min').trim(),goal:String(fd.get('goal')||'').trim(),steps:String(fd.get('steps')||'').trim()};
  save(); f.reset(); $('#addPracticalPanel').hidden=true; setStatus('#practicalAddStatus','Practical added ✓','success'); renderLearningEditors();
}
function addProjectFromForm(){
  const f=$('#addProjectForm'); const fd=new FormData(f); const title=String(fd.get('title')||'').trim(); if(!title)return setStatus('#projectAddStatus','Project name is required.','error');
  const base=slugify(title)||'project'; let key=base,n=2; while(data.learningContent.projects[key])key=`${base}-${n++}`;
  data.learningContent.projects[key]={key,title,product:String(fd.get('product')||'').trim(),sku:String(fd.get('sku')||'').trim(),kit:String(fd.get('kit')||'').trim(),summary:String(fd.get('summary')||'').trim(),learn:String(fd.get('learn')||'').trim(),upgrade:String(fd.get('upgrade')||'').trim()};
  save(); f.reset(); $('#addProjectPanel').hidden=true; setStatus('#projectAddStatus','Project added ✓','success'); renderLearningEditors();
}
$('#search').oninput = renderProducts;

function activateTab(name) {
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    const active = panel.id === `tab-${name}`;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
  if (name === 'components') renderComponentList();
  if (name === 'media') renderLearningMedia();
  if (name === 'learning-editors') renderLearningEditors();
}

document.querySelectorAll('.admin-tab').forEach((tab) => {
  tab.onclick = () => activateTab(tab.dataset.tab);
});


function editorMedia(kind,key){
  return mediaBucket(kind,key);
}
function renderEditorMedia(kind,key,title){
  const m=editorMedia(kind,key);
  const thumbs=m.images.length?m.images.map((src,i)=>`<div class="admin-media-thumb"><img src="${esc(src)}" alt="${esc(title)} image ${i+1}"><button type="button" class="remove-editor-image" data-kind="${esc(kind)}" data-key="${esc(key)}" data-index="${i}" aria-label="Remove image">×</button></div>`).join(''):'<span class="media-empty">No images uploaded.</span>';
  const pdf=m.pdf?'<span class="pdf-attached">PDF attached ✓</span>':'<span class="media-empty">No PDF attached.</span>';
  return `<div class="product-image-tools product-image-tools-multi"><div><strong>Images & PDF</strong><small>Upload up to 8 images and 1 PDF. These files are used only for this item.</small></div><div class="image-tool-actions"><label class="upload-btn">＋ Add images<input class="editor-image-input" data-kind="${esc(kind)}" data-key="${esc(key)}" type="file" accept="image/*" multiple hidden></label><label class="upload-btn">＋ Add PDF<input class="editor-pdf-input" data-kind="${esc(kind)}" data-key="${esc(key)}" type="file" accept="application/pdf" hidden></label>${m.pdf?`<button type="button" class="secondary-btn remove-editor-pdf" data-kind="${esc(kind)}" data-key="${esc(key)}">Remove PDF</button>`:''}</div></div><div class="product-image-gallery-admin">${thumbs}</div><div class="media-pdf-status">${pdf}</div>`;
}
function renderKitEditor(p){
  const key=p.id;
  return `<article class="product product-card-admin learning-editor" data-kind="kits" data-key="${esc(key)}"><div class="product-admin-head"><div class="product-title-wrap"><div class="admin-product-thumb">${productImagePreview(p)}</div><div><b>${esc(p.name)}</b><span>${esc(p.id)} • Kit</span></div></div><button class="danger-outline remove-learning-kit" data-id="${esc(key)}" type="button">Remove kit</button></div><div class="product-fields"><label>Name<input data-k="name" value="${esc(p.name)}"></label><label>SKU<input data-k="sku" value="${esc(p.sku || `CL-${String(p.id).toUpperCase()}`)}" placeholder="CL-KIT-001"></label><label>Category<input data-k="category" value="${esc(p.category||'Starter Kits')}"></label><label>Description<textarea data-k="description">${esc(p.description)}</textarea></label><label>Price<input data-k="price" value="${esc(p.price||'Contact for price')}"></label><label class="wide">Specifications<textarea data-k="specifications">${esc(p.specifications)}</textarea></label><label class="wide">Applications<textarea data-k="applications">${esc(p.applications)}</textarea></label></div>${renderEditorMedia('kits',key,p.name)}<div class="product-footer-actions"><button class="save-learning-kit primary-btn" data-id="${esc(key)}" type="button">Save kit changes</button><span class="status" id="kit-status-${esc(key)}"></span></div></article>`;
}
function renderPracticalEditor(x){
  return `<article class="product product-card-admin learning-editor" data-kind="practical" data-key="${esc(x.key)}"><div class="product-admin-head"><div class="product-title-wrap"><div><b>${esc(x.title)}</b><span>${esc(x.key)} • Practical</span></div></div><button class="danger-outline remove-learning-practical" data-key="${esc(x.key)}" type="button">Remove practical</button></div><div class="product-fields"><label>Name<input data-k="title" value="${esc(x.title)}"></label><label>Level<input data-k="level" value="${esc(x.level)}"></label><label>Time<input data-k="time" value="${esc(x.time)}"></label><label>SKU<input data-k="sku" value="${esc(x.sku || '')}" placeholder="CL-PRAC-001"></label><label>Product ID / SKU<input data-k="product" value="${esc(x.product)}"></label><label class="wide">Description / Goal<textarea data-k="goal">${esc(x.goal)}</textarea></label><label class="wide">Steps<textarea data-k="steps">${esc(x.steps)}</textarea></label></div>${renderEditorMedia('practical',x.key,x.title)}<div class="product-footer-actions"><button class="save-learning-practical primary-btn" data-key="${esc(x.key)}" type="button">Save practical changes</button><span class="status" id="practical-status-${esc(x.key)}"></span></div></article>`;
}
function renderProjectEditor(x){
  return `<article class="product product-card-admin learning-editor" data-kind="projects" data-key="${esc(x.key)}"><div class="product-admin-head"><div class="product-title-wrap"><div><b>${esc(x.title)}</b><span>${esc(x.key)} • Project</span></div></div><button class="danger-outline remove-learning-project" data-key="${esc(x.key)}" type="button">Remove project</button></div><div class="product-fields"><label>Name<input data-k="title" value="${esc(x.title)}"></label><label>SKU<input data-k="sku" value="${esc(x.sku || '')}" placeholder="CL-PRAC-001"></label><label>Product ID / SKU<input data-k="product" value="${esc(x.product)}"></label><label class="wide">Kit / Hardware<textarea data-k="kit">${esc(x.kit)}</textarea></label><label class="wide">Description<textarea data-k="summary">${esc(x.summary)}</textarea></label><label class="wide">What you learn<textarea data-k="learn">${esc(x.learn)}</textarea></label><label class="wide">Upgrade / Next step<textarea data-k="upgrade">${esc(x.upgrade)}</textarea></label></div>${renderEditorMedia('projects',x.key,x.title)}<div class="product-footer-actions"><button class="save-learning-project primary-btn" data-key="${esc(x.key)}" type="button">Save project changes</button><span class="status" id="project-status-${esc(x.key)}"></span></div></article>`;
}
function renderLearningEditors(){
  ensureLearningContent();
  const kits=$('#kitEditorList'), practical=$('#practicalEditorList'), projects=$('#projectEditorList');
  if(!kits||!practical||!projects) return;
  const kitQ=($('#kitEditorSearch')?.value||'').trim().toLowerCase();
  const practicalQ=($('#practicalEditorSearch')?.value||'').trim().toLowerCase();
  const projectQ=($('#projectEditorSearch')?.value||'').trim().toLowerCase();
  const match=(values,q)=>!q||values.join(' ').toLowerCase().includes(q);
  kits.innerHTML=data.products.filter(p=>p.category==='Starter Kits'&&match([p.name,p.id,p.description],kitQ)).map(renderKitEditor).join('')||'<div class="media-empty">No kits found.</div>';
  practical.innerHTML=Object.values(data.learningContent.practical).filter(x=>match([x.title,x.key,x.product,x.goal],practicalQ)).map(renderPracticalEditor).join('')||'<div class="media-empty">No practicals found.</div>';
  projects.innerHTML=Object.values(data.learningContent.projects).filter(x=>match([x.title,x.key,x.product,x.summary,x.learn],projectQ)).map(renderProjectEditor).join('')||'<div class="media-empty">No projects found.</div>';
  ['kitEditorSearch','practicalEditorSearch','projectEditorSearch'].forEach(id=>{
    const el=$('#'+id); if(el && !el.dataset.bound){el.dataset.bound='1';el.addEventListener('input',renderLearningEditors);}
  });
  document.querySelectorAll('.save-learning-kit').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.id, p=data.products.find(x=>x.id===id), card=btn.closest('.learning-editor'); if(!p||!card)return;
    card.querySelectorAll('[data-k]').forEach(el=>p[el.dataset.k]=el.value); save(); renderLearningEditors();
    const status=document.querySelector(`#kit-status-${CSS.escape(id)}`);
    if(status){status.textContent='✓ Saved';status.className='status success';setTimeout(()=>status.textContent='',1800);}
  });
  document.querySelectorAll('.save-learning-practical').forEach(btn=>btn.onclick=()=>{
    const key=btn.dataset.key, x=data.learningContent.practical[key], card=btn.closest('.learning-editor'); if(!x||!card)return;
    card.querySelectorAll('[data-k]').forEach(el=>x[el.dataset.k]=el.value); save(); renderLearningEditors();
    const status=document.querySelector(`#practical-status-${CSS.escape(key)}`);
    if(status){status.textContent='✓ Saved';status.className='status success';setTimeout(()=>status.textContent='',1800);}
  });
  document.querySelectorAll('.save-learning-project').forEach(btn=>btn.onclick=()=>{
    const key=btn.dataset.key, x=data.learningContent.projects[key], card=btn.closest('.learning-editor'); if(!x||!card)return;
    card.querySelectorAll('[data-k]').forEach(el=>x[el.dataset.k]=el.value); save(); renderLearningEditors();
    const status=document.querySelector(`#project-status-${CSS.escape(key)}`);
    if(status){status.textContent='✓ Saved';status.className='status success';setTimeout(()=>status.textContent='',1800);}
  });
  document.querySelectorAll('.editor-image-input').forEach(input=>input.onchange=()=>handleEditorImages(input.dataset.kind,input.dataset.key,[...(input.files||[])]));
  document.querySelectorAll('.editor-pdf-input').forEach(input=>input.onchange=()=>handleMediaPdf(input.dataset.kind,input.dataset.key,input.files?.[0]));
  document.querySelectorAll('.remove-editor-image').forEach(btn=>btn.onclick=()=>{const m=mediaBucket(btn.dataset.kind,btn.dataset.key);m.images.splice(Number(btn.dataset.index),1);save();renderLearningEditors();});
  document.querySelectorAll('.remove-editor-pdf').forEach(btn=>btn.onclick=async()=>{const m=mediaBucket(btn.dataset.kind,btn.dataset.key);await deletePdfBlob(btn.dataset.kind,btn.dataset.key);m.pdf='';save();renderLearningEditors();});
  document.querySelectorAll('.remove-learning-kit').forEach(btn=>btn.onclick=()=>removeLearningKit(btn.dataset.id));
  document.querySelectorAll('.remove-learning-practical').forEach(btn=>btn.onclick=()=>removeLearningPractical(btn.dataset.key));
  document.querySelectorAll('.remove-learning-project').forEach(btn=>btn.onclick=()=>removeLearningProject(btn.dataset.key));
}
function removeLearningKit(id){
  const p=data.products.find(x=>x.id===id); if(!p)return;
  if(!confirm(`Remove “${p.name}” from kits?`))return;
  data.products=data.products.filter(x=>x.id!==id); delete data.learningMedia.kits[id]; save(); renderLearningEditors(); renderProducts(); renderComponentList();
}
function removeLearningPractical(key){
  const x=data.learningContent.practical[key]; if(!x)return;
  if(!confirm(`Remove “${x.title}” from practicals?`))return;
  delete data.learningContent.practical[key]; delete data.learningMedia.practical[key]; save(); renderLearningEditors();
}
function removeLearningProject(key){
  const x=data.learningContent.projects[key]; if(!x)return;
  if(!confirm(`Remove “${x.title}” from projects?`))return;
  delete data.learningContent.projects[key]; delete data.learningMedia.projects[key]; save(); renderLearningEditors();
}

async function handleEditorImages(kind, key, files) {
  try {
    const m = mediaBucket(kind, key);
    for (const file of files) {
      const url = await uploadOrCompressImage(file);
      if (url) m.images.push(url);
    }
    save();
    renderLearningEditors();
  } catch (e) {
    alert(e.message || 'Unable to upload images.');
  }
}

function mediaBucket(kind, key) {
  if (!data.learningMedia) data.learningMedia = { components: {}, kits: {}, practical: {}, projects: {} };
  if (!data.learningMedia[kind]) data.learningMedia[kind] = {};
  if (!data.learningMedia[kind][key]) data.learningMedia[kind][key] = { images: [], pdf: '' };
  const m = data.learningMedia[kind][key];
  m.images = Array.isArray(m.images) ? m.images : [];
  m.pdf = typeof m.pdf === 'string' ? m.pdf : '';
  return m;
}
function readFileAsDataUrl(file, typePrefix) {
  return new Promise((resolve, reject) => {
    if (!file || (typePrefix && !file.type.startsWith(typePrefix))) return reject(new Error(`Please choose a ${typePrefix.replace('/',' ')} file.`));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}
function renderMediaItem(kind, key, title, subtitle) {
  const m = mediaBucket(kind, key);
  const thumbs = m.images.length ? m.images.map((src, i) => `<div class="media-thumb"><img src="${esc(src)}" alt="Media ${i+1}"><button type="button" class="remove-media-image" data-kind="${esc(kind)}" data-key="${esc(key)}" data-index="${i}" aria-label="Remove image">×</button></div>`).join('') : '<div class="media-empty">No additional images uploaded.</div>';
  const pdf = m.pdf ? `<div class="media-pdf"><span>PDF attached</span><button type="button" class="secondary-btn remove-media-pdf" data-kind="${esc(kind)}" data-key="${esc(key)}">Remove PDF</button></div>` : '<div class="media-empty">No PDF attached.</div>';
  return `<article class="media-item">
    <div class="media-item-head"><div><b>${esc(title)}</b><span>${esc(subtitle || key)}</span></div>
      <div class="media-actions">
        <label class="media-upload">＋ Add images<input class="media-image-input" data-kind="${esc(kind)}" data-key="${esc(key)}" type="file" accept="image/*" multiple></label>
        <label class="media-upload">＋ Add PDF<input class="media-pdf-input" data-kind="${esc(kind)}" data-key="${esc(key)}" type="file" accept="application/pdf"></label>
      </div>
    </div>
    <div class="media-thumbs">${thumbs}</div>${pdf}
  </article>`;
}
function renderLearningMedia() {
  const componentList = $('#componentMediaList'), kitList = $('#kitMediaList'), practicalList = $('#practicalMediaList'), projectList = $('#projectMediaList');
  if (!componentList) return;
  const q = id => ($('#'+id)?.value || '').trim().toLowerCase();
  const matches = (values, query) => !query || values.join(' ').toLowerCase().includes(query);

  const cq=q('componentMediaSearch');
  componentList.innerHTML = data.products.filter(p => p.category !== 'Starter Kits' && matches([p.name,p.id,p.category,p.description],cq)).map(p => renderMediaItem('components', p.id, p.name, `${p.id} • ${p.category || 'Component'}`)).join('') || '<div class="media-empty">No components found.</div>';

  const kq=q('kitMediaSearch');
  kitList.innerHTML = data.products.filter(p => p.category === 'Starter Kits' && matches([p.name,p.id,p.category,p.description],kq)).map(p => renderMediaItem('kits', p.id, p.name, `${p.id} • Starter Kit`)).join('') || '<div class="media-empty">No kits found.</div>';

  const practical = [
    ['Ultrasonic Distance Lab','ultrasonic-distance-lab'],['Soil Moisture Test','soil-moisture-test'],['Temperature Monitoring','temperature-monitoring'],
    ['IR Object Detection','ir-object-detection'],['Motor Speed Control','motor-speed-control'],['Wireless Control Starter','wireless-control-starter']
  ];
  const pq=q('practicalMediaSearch');
  practicalList.innerHTML = practical.filter(([title,key])=>matches([title,key,'practical'],pq)).map(([title,key]) => renderMediaItem('practical', key, title, 'Practical learning activity')).join('') || '<div class="media-empty">No practicals found.</div>';

  const projects = [
    ['Obstacle Avoiding Robot','obstacle-avoiding-robot'],['Smart Plant Watering','smart-plant-watering'],
    ['Wireless Appliance Controller','wireless-appliance-controller'],['Mini Line-Following Robot','mini-line-following-robot'],
    ['Digital Temperature Station','digital-temperature-station'],['Color Detection Experiment','color-detection-experiment']
  ];
  const xq=q('projectMediaSearch');
  projectList.innerHTML = projects.filter(([title,key])=>matches([title,key,'project'],xq)).map(([title,key]) => renderMediaItem('projects', key, title, 'Project')).join('') || '<div class="media-empty">No projects found.</div>';

  document.querySelectorAll('.media-image-input').forEach(input => input.onchange = () => handleMediaImages(input.dataset.kind, input.dataset.key, [...(input.files || [])]));
  document.querySelectorAll('.media-pdf-input').forEach(input => input.onchange = () => handleMediaPdf(input.dataset.kind, input.dataset.key, input.files?.[0]));
  document.querySelectorAll('.remove-media-image').forEach(btn => btn.onclick = () => {
    const m = mediaBucket(btn.dataset.kind, btn.dataset.key); m.images.splice(Number(btn.dataset.index), 1); save(); renderLearningMedia();
  });
  document.querySelectorAll('.remove-media-pdf').forEach(btn => btn.onclick = async () => {
    const m = mediaBucket(btn.dataset.kind, btn.dataset.key); await deletePdfBlob(btn.dataset.kind,btn.dataset.key); m.pdf = ''; save(); renderLearningMedia(); renderLearningEditors();
  });
  ['componentMediaSearch','kitMediaSearch','practicalMediaSearch','projectMediaSearch'].forEach(id=>{
    const el=$('#'+id); if(el && !el.dataset.bound){el.dataset.bound='1';el.addEventListener('input',renderLearningMedia);}
  });
}
async function handleMediaImages(kind, key, files) {
  try {
    const m = mediaBucket(kind, key);
    for (const file of files) {
      const url = await uploadOrCompressImage(file);
      if (url) m.images.push(url);
    }
    save();
    renderLearningMedia();
  } catch (e) {
    alert(e.message || 'Unable to upload images.');
  }
}
function openMediaDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open('creative_learning_media_v1',1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('pdfs'))req.result.createObjectStore('pdfs');};
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
async function storePdfBlob(kind,key,file){
  const db=await openMediaDb();
  await new Promise((resolve,reject)=>{const tx=db.transaction('pdfs','readwrite');tx.objectStore('pdfs').put(file,`${kind}:${key}`);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  db.close();
  return `idb-pdf:${kind}:${key}`;
}
async function deletePdfBlob(kind,key){
  try{const db=await openMediaDb();await new Promise((resolve,reject)=>{const tx=db.transaction('pdfs','readwrite');tx.objectStore('pdfs').delete(`${kind}:${key}`);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();}catch(e){}
}

async function handleMediaPdf(kind, key, file) {
  try {
    if (!file) return;
    if (file.type !== 'application/pdf') throw new Error('Please choose a PDF file.');
    if (file.size > 25 * 1024 * 1024) throw new Error('The PDF must be 25 MB or smaller.');
    const m = mediaBucket(kind, key);
    m.pdf = await storePdfBlob(kind,key,file);
    save(); renderLearningMedia(); renderLearningEditors();
  } catch (e) { alert(e.message || 'Unable to upload PDF.'); }
}

function clearComponentForm() {
  $('#addComponentForm').reset();
  setStatus('#componentStatus', '');
}

function renderComponentList() {
  const q = $('#componentSearch').value.trim().toLowerCase();
  const list = data.products.filter((p) => [p.name, p.category, p.id].join(' ').toLowerCase().includes(q));
  $('#componentList').innerHTML = list.map((p) => `
    <div class="component-row">
      <div class="component-row-main">
        <b>${esc(p.name)}</b>
        <span>${esc(p.id)}${p.category ? ` • ${esc(p.category)}` : ''}</span>
      </div>
      <button class="remove-component" data-id="${esc(p.id)}" type="button">Remove</button>
    </div>`).join('') || '<p class="component-empty">No components found.</p>';
  document.querySelectorAll('.remove-component').forEach((btn) => {
    btn.onclick = () => removeComponent(btn.dataset.id);
  });
}

function removeComponent(id) {
  const product = data.products.find((p) => p.id === id);
  if (!product) return;
  if (!confirm(`Remove “${product.name}” from the website catalogue?`)) return;
  data.products = data.products.filter((p) => p.id !== id);
  save();
  renderComponentList();
  renderProducts();
  setStatus('#componentStatus', `${product.name} removed ✓`, 'success');
}

$('#addComponentForm').onsubmit = (e) => {
  e.preventDefault();
  const id = $('#componentId').value.trim();
  const name = $('#componentName').value.trim();
  const category = $('#componentCategory').value.trim();
  const description = $('#componentDescription').value.trim();
  if (!id || !name || !category || !description) return setStatus('#componentStatus', 'Please complete ID, name, category and description.', 'error');
  if (data.products.some((p) => String(p.id).toLowerCase() === id.toLowerCase())) return setStatus('#componentStatus', 'That ID / SKU already exists.', 'error');
  data.products.push({
    id, name, category, page: '', description,
    specifications: $('#componentSpecifications').value.trim(),
    applications: $('#componentApplications').value.trim(),
    image: $('#componentImage').value.trim(),
    price: $('#componentPrice').value.trim()
  });
  save();
  renderComponentList();
  renderProducts();
  $('#addComponentForm').reset();
  setStatus('#componentStatus', `${name} added ✓`, 'success');
};

$('#clearComponentBtn').onclick = clearComponentForm;
$('#componentSearch').oninput = renderComponentList;
$('#logoutBtn').onclick = () => { sessionStorage.removeItem('cl_admin_session'); location.reload(); };
$('#exportBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'creative-learning-site-data.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

(async function init() {
  loadData();
  await ensureAuth();
  if (sessionStorage.getItem('cl_admin_session') === '1') showApp();
})();


$('#addKitBtn')?.addEventListener('click',()=>$('#addKitPanel').hidden=false); $('#cancelAddKitBtn')?.addEventListener('click',()=>$('#addKitPanel').hidden=true); $('#addKitForm')?.addEventListener('submit',e=>{e.preventDefault();addKitFromForm();}); $('#addPracticalBtn')?.addEventListener('click',()=>$('#addPracticalPanel').hidden=false); $('#cancelAddPracticalBtn')?.addEventListener('click',()=>$('#addPracticalPanel').hidden=true); $('#addPracticalForm')?.addEventListener('submit',e=>{e.preventDefault();addPracticalFromForm();}); $('#addProjectBtn')?.addEventListener('click',()=>$('#addProjectPanel').hidden=false); $('#cancelAddProjectBtn')?.addEventListener('click',()=>$('#addProjectPanel').hidden=true); $('#addProjectForm')?.addEventListener('submit',e=>{e.preventDefault();addProjectFromForm();});

$('#addQuote')?.addEventListener('click',addQuote);
$('#heroQuoteSave')?.addEventListener('click',saveHeroQuoteSelection);
$('#quoteEditorList')?.addEventListener('click',e=>{
  const saveBtn=e.target.closest('.save-quote');
  if(saveBtn){ const card=saveBtn.closest('.quote-editor-card'); saveQuoteItem(saveBtn.dataset.id,card); return; }
  const removeBtn=e.target.closest('.remove-quote');
  if(removeBtn){ removeQuote(removeBtn.dataset.id); }
});
