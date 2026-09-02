let products=[];
let cart=JSON.parse(localStorage.getItem("cl_cart")||"{}");
let activeCategory="all";
let adminLearning={practical:{},projects:{}};
let customQuotes=[];

const $=s=>document.querySelector(s);
const grid=$("#productGrid"), kitGrid=$("#kitGrid");

const CATALOG_VERSION=2;
const practicalData=[
  {key:'ultrasonic-distance-lab',title:"Ultrasonic Distance Lab",product:"p02-1",level:"Beginner",time:"25 min",goal:"Understand distance sensing and threshold logic.",steps:["Wire VCC, GND and TRIG/ECHO","Read the distance value","Set a near/far LED or buzzer rule"]},
  {key:'soil-moisture-test',title:"Soil Moisture Test",product:"p02-2",level:"Beginner",time:"30 min",goal:"Learn how an analog sensor becomes a useful decision.",steps:["Insert the probe in dry soil","Read the analog value","Compare dry vs. wet readings"]},
  {key:'temperature-monitoring',title:"Temperature Monitoring",product:"p02-3",level:"Beginner",time:"25 min",goal:"Convert sensor readings into a meaningful temperature display.",steps:["Connect the analog temperature sensor","Read the voltage","Calibrate and display temperature"]}
];
const projectData=[
  {key:'obstacle-avoiding-robot',title:"Obstacle Avoiding Robot",product:"p02-1",kit:"Ultrasonic + motors + driver",summary:"A mobile robot that measures distance and changes direction when an obstacle is detected.",learn:"Sensors • motor control • decision making",upgrade:"Add Bluetooth manual override and an OLED status screen."},
  {key:'smart-plant-watering',title:"Smart Plant Watering",product:"p02-2",kit:"Smart irrigation sensors + pump",summary:"Automate watering using soil moisture feedback and a pump/relay control stage.",learn:"Sensing • automation • control",upgrade:"Add a water-flow sensor and phone alerts."},
  {key:'wireless-appliance-controller',title:"Wireless Appliance Controller",product:"p02-3",kit:"Arduino + relay module",summary:"Build a simple controller that switches a low-voltage load safely.",learn:"Control logic • switching • prototyping",upgrade:"Add a wireless module and browser dashboard."}
];

function loadProducts(){
  products=Array.isArray(window.CREATIVE_LEARNING_PRODUCTS) ? window.CREATIVE_LEARNING_PRODUCTS.map(p=>({...p})) : [];
  try {
    const saved=JSON.parse(localStorage.getItem('cl_admin_data_v1')||'null');
    if(saved?.catalogVersion===CATALOG_VERSION){
      if(Array.isArray(saved.products)) products=saved.products;
      if(saved?.company) applyCompany(saved.company);
      adminLearning={practical:{},projects:{},...(saved?.learningContent||{})};
      customQuotes=Array.isArray(saved?.quotes) ? saved.quotes.filter(q=>q&&q.text) : (saved?.quote?.text ? [{text:saved.quote.text,author:saved.quote.author||'Creative Learning'}] : []);
    } else if(saved?.company) {
      applyCompany(saved.company);
      localStorage.removeItem('cl_admin_data_v1');
    }
  } catch(e) { adminLearning={practical:{},projects:{}}; }
  if(!Object.keys(adminLearning.practical||{}).length) practicalData.forEach(x=>adminLearning.practical[x.key]={...x});
  if(!Object.keys(adminLearning.projects||{}).length) projectData.forEach(x=>adminLearning.projects[x.key]={...x});
  populateFilters(); render(); renderLearning(); updateCart(); initMotion(); initNavigation();
}
function applyCompany(c){
  document.title=(c.name||'Creative Learning')+' | Electronics, Robotics & Projects';
  const brand=document.querySelector('.brand strong'); if(brand) brand.textContent=c.name||brand.textContent;
  const tagline=document.querySelector('.brand span'); if(tagline) tagline.textContent=c.tagline||tagline.textContent;
  const gmailLinks=document.querySelectorAll('.header-contact-actions a.gmail'); gmailLinks.forEach(link=>{link.href='#emailComposer';});
  const footer=document.querySelector('footer'); if(footer){const text=footer.querySelectorAll('div');if(text[1])text[1].textContent=(c.phone||'')+' • '+(c.email||'');}
}
function populateFilters(){
  const cats=[...new Set(products.map(p=>p.category))].sort();
  $("#categorySelect").innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  $("#chips").innerHTML='<button class="chip active" data-cat="all">All</button>'+cats.map(c=>`<button class="chip" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");
  document.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.cat;$("#categorySelect").value=activeCategory;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));render()}));
  $("#categorySelect").addEventListener("change",e=>{activeCategory=e.target.value;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.cat===activeCategory));render()});
  $("#searchInput").addEventListener("input",render);
}
function filtered(){const q=$("#searchInput").value.trim().toLowerCase();return products.filter(p=>(activeCategory==="all"||p.category===activeCategory)&&(!q||[p.name,p.category,p.description,p.specifications,p.applications].join(" ").toLowerCase().includes(q)));}
function render(){
  const list=filtered();$("#resultCount").textContent=list.length;grid.innerHTML=list.map(card).join("");kitGrid.innerHTML=products.filter(p=>p.category==="Starter Kits").map(kitCard).join("");
  document.querySelectorAll("[data-product]").forEach(b=>b.addEventListener("click",()=>openProduct(b.dataset.product,b.dataset.mediaKind||"components",b.dataset.mediaKey||"")));
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add)));
  refreshRevealTargets();
}
function productSku(p){return String(p.sku||`CL-${p.id}`).toUpperCase();}
function card(p){const media=componentMedia(p),imgs=media.images||productImages(p);return `<article class="product-card reveal"><div class="product-body"><div class="catalogue-media">${mediaGallery(media,imgs[0]||'',p.name)}</div><span class="tag">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p><div class="sku-line">SKU: ${escapeHtml(productSku(p))}</div><div class="product-meta"><span class="price">${escapeHtml(p.price)}</span><span>Ready to build</span></div><div class="card-actions"><button data-product="${p.id}">Details</button><button class="add" data-add="${p.id}">Add to cart</button></div></div></article>`;}
function kitCard(p){const media=kitMedia(p),imgs=media.images||productImages(p);return `<article class="kit-card reveal"><div class="kit-body"><div class="catalogue-media">${mediaGallery(media,imgs[0]||'',p.name)}</div><span class="tag">Learning Kit</span><div class="sku-line">SKU: ${escapeHtml(productSku(p))}</div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p><button data-product="${p.id}" data-media-kind="kits">View kit details</button></div></article>`;}
function productByRef(ref){return products.find(p=>p.id===ref)||products.find(p=>p.id===ref?.replace('-kit',''));}
function slugKey(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/,'');}
function siteMedia(kind,key){
  try{
    const saved=JSON.parse(localStorage.getItem('cl_admin_data_v1')||'null');
    const m=saved?.learningMedia?.[kind]?.[key];
    const custom={images:Array.isArray(m?.images)?m.images.filter(x=>typeof x==='string'):[],pdf:typeof m?.pdf==='string'?m.pdf:''};
    return custom;
  }catch(e){return {images:[],pdf:''};}
}
function productImages(p){
  const images=Array.isArray(p?.images)?p.images.filter(Boolean):[];
  return images.length?images:(p?.image?[p.image]:[]);
}
function sourcePageImage(p){
  const page=Number(p?.page||0);
  return page?`images/source-pages/page-${String(page).padStart(2,'0')}.jpg`:'';
}
function mergeMedia(kind,key,p,extraImages=[]){
  const saved=siteMedia(kind,key);
  const base=extraImages.filter(Boolean);
  const custom=[...(saved.images||[])].filter(Boolean);
  // Uploaded images replace the default catalogue/source-page images.
  // PDFs are shown ONLY when an Admin-uploaded PDF exists.
  const images=custom.length ? [...new Set(custom)] : [...new Set(base)];
  return {images,pdf:saved.pdf||''};
}
function mediaGallery(media, mainImage, label, embedPdf=false, showPdf=true){
  const customImages=Array.isArray(media?.images)?media.images.filter(Boolean):[];
  const images=customImages.length?customImages:[mainImage].filter(Boolean);
  if(!images.length && !media?.pdf) return '';
  const safeLabel=escapeHtml(label||'Media');
  const main=images[0]||'';
  return `<div class="media-gallery" aria-label="${safeLabel} media gallery">
    ${images.length?`<div class="media-main-wrap"><button class="media-main-open" type="button" data-image-open="${escapeHtml(main)}" aria-label="Open ${safeLabel} image"><img class="media-main-image" src="${main}" alt="${safeLabel} main image" loading="lazy"></button><span class="media-count">${images.length} images</span></div><div class="media-strip" role="list">${images.map((src,i)=>`<button class="media-thumb ${i===0?'active':''}" type="button" data-gallery-src="${escapeHtml(src)}" aria-label="Show ${safeLabel} image ${i+1}"><img src="${src}" alt="${safeLabel} image ${i+1}" loading="lazy"></button>`).join('')}</div>`:''}
    <div class="media-actions-row">
      ${showPdf&&media?.pdf?`<button type="button" class="media-pdf-link" data-pdf-src="${escapeHtml(media.pdf)}"><span class="pdf-icon">PDF</span> View product PDF</button>`:''}
      ${showPdf&&embedPdf&&media?.pdf?`<button type="button" class="media-pdf-inline" data-pdf-src="${escapeHtml(media.pdf)}">Open PDF preview</button>`:''}
    </div>
  </div>`;
}
function componentMedia(p){
  return mergeMedia('components',p.id,p,[...productImages(p),sourcePageImage(p)]);
}
function kitMedia(p){
  return mergeMedia('kits',p.id,p,[...productImages(p),sourcePageImage(p)]);
}
function practicalMedia(key){
  const item=(adminLearning.practical||{})[key]||practicalData.find(x=>x.key===key);
  const p=productByRef(item?.product);
  return mergeMedia('practical',key,p,[...(p?productImages(p):[]),...(p?[sourcePageImage(p)]:[])]);
}
function projectMedia(key){
  const item=(adminLearning.projects||{})[key]||projectData.find(x=>x.key===key);
  const p=productByRef(item?.product);
  return mergeMedia('projects',key,p,[...(p?productImages(p):[]),...(p?[sourcePageImage(p)]:[])]);
}
function renderLearning(){
  const practicalGrid=$("#practicalGrid"), projectGrid=$("#projects-grid");
  const practicalList=Object.values(adminLearning.practical||{}).length?Object.values(adminLearning.practical):practicalData;
  const projectList=Object.values(adminLearning.projects||{}).length?Object.values(adminLearning.projects):projectData;
  practicalGrid.innerHTML=practicalList.map(x=>{
    const key=x.key||x.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/,'');
    const p=productByRef(x.product),media=practicalMedia(key),imgs=Array.isArray(media.images)&&media.images.length?media.images:productImages(p);
    const steps=Array.isArray(x.steps)?x.steps:String(x.steps||'').split(';').map(s=>s.trim()).filter(Boolean);
    return `<article class="practical-card reveal"><div class="practical-body"><div class="catalogue-media">${mediaGallery(media,imgs[0]||'',x.title)}</div><span class="tag">${escapeHtml(x.level)} • ${escapeHtml(x.time)}</span>${x.sku?`<div class="sku-line">SKU: ${escapeHtml(x.sku)}</div>`:''}<h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.goal)}</p><div class="detail-list">${steps.map(s=>`<span>${escapeHtml(s)}</span>`).join('')}</div>${p?`<button class="secondary" style="width:100%;margin-top:8px" data-product="${p.id}" data-media-kind="practical" data-media-key="${escapeHtml(key)}">View component</button>`:''}</div></article>`;
  }).join('');
  projectGrid.innerHTML=projectList.map(x=>{
    const key=x.key||x.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/,'');
    const p=productByRef(x.product),media=projectMedia(key),imgs=Array.isArray(media.images)&&media.images.length?media.images:productImages(p);
    return `<article class="project-card reveal"><div class="project-body"><div class="catalogue-media">${mediaGallery(media,imgs[0]||'',x.title)}</div><span class="tag">PROJECT</span>${x.sku?`<div class="sku-line">SKU: ${escapeHtml(x.sku)}</div>`:''}<h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.summary)}</p><div class="detail-list"><span>${escapeHtml(x.kit)}</span><span>${escapeHtml(x.learn)}</span></div><p><strong>Upgrade:</strong> ${escapeHtml(x.upgrade)}</p><button class="primary" style="width:100%;margin-top:4px" data-product="${p?.id||''}" data-media-kind="projects" data-media-key="${escapeHtml(key)}">Open component details</button></div></article>`;
  }).join('');
  document.querySelectorAll("[data-product]").forEach(b=>b.addEventListener("click",()=>openProduct(b.dataset.product,b.dataset.mediaKind||"components",b.dataset.mediaKey||"")));
  refreshRevealTargets();
}
function openProduct(id,mediaKind='components',mediaKey=''){
  const p=products.find(x=>x.id===id);if(!p)return;
  let media=componentMedia(p);
  if(mediaKind==='kits') media=kitMedia(p);
  if(mediaKind==='practical') media=practicalMedia(mediaKey||p.name);
  if(mediaKind==='projects') media=projectMedia(mediaKey||p.name);
  const imgs=Array.isArray(media.images)&&media.images.length?media.images:productImages(p);
  const fallback=imgs[0]||'';
  $("#productModalContent").innerHTML=`<div class="product-detail"><div>${mediaGallery(media,fallback,p.name,false,false)}</div><div class="detail"><span class="tag">${escapeHtml(p.category)}</span><h2>${escapeHtml(p.name)}</h2><p class="sku-line">SKU: ${escapeHtml(productSku(p))}</p><p>${escapeHtml(p.description)}</p><h4>Specifications</h4><ul>${String(p.specifications||'').split(";").map(x=>`<li>${escapeHtml(x.trim())}</li>`).join("")}</ul><h4>Applications</h4><ul>${String(p.applications||'').split(";").map(x=>`<li>${escapeHtml(x.trim())}</li>`).join("")}</ul><p><b>${escapeHtml(p.price)}</b> • Contact for availability</p><button class="primary add add-animated" data-add="${p.id}">Add to cart</button></div></div>`;
  $("#productModal").classList.add("open");$("#productModalContent [data-add]").addEventListener("click",()=>{addToCart(id);$("#productModal").classList.remove("open")});
}
function addToCart(id){if(!id)return;cart[id]=(cart[id]||0)+1;saveCart();updateCart();openCart()}

function getOrderEntries(){
  return Object.entries(cart).map(([id,q])=>({p:products.find(x=>x.id===id),q})).filter(x=>x.p && x.q>0);
}
function downloadOrderExcel(customer={}){
  const entries=getOrderEntries();
  if(!entries.length){alert("Please add at least one product to the cart.");return;}
  const escCell=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const rows=entries.map(x=>`<tr><td>${escCell(x.p.name)}</td><td>${escCell(productSku(x.p))}</td><td>${escCell(x.p.category)}</td><td>${x.q}</td><td>${escCell(x.p.price)}</td></tr>`).join("");
  const info=`<tr><th>Customer</th><td>${escCell(customer.name||"")}</td><th>Phone / WhatsApp</th><td colspan="2">${escCell(customer.phone||"")}</td></tr>
<tr><th>Email</th><td>${escCell(customer.email||"")}</td><th>Delivery Address</th><td colspan="2">${escCell(customer.address||"")}</td></tr>
<tr><th>Notes</th><td colspan="4">${escCell(customer.notes||"")}</td></tr>`;
  const html=`<html><head><meta charset="utf-8"></head><body><h2>Creative Learning Order</h2><table border="1">${info}<tr><th>Product</th><th>SKU</th><th>Category</th><th>Quantity</th><th>Price</th></tr>${rows}</table></body></html>`;
  const blob=new Blob(["\ufeff",html],{type:"application/vnd.ms-excel"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="creative-learning-order.xls";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function removeFromCart(id){delete cart[id];saveCart();updateCart()}
function changeQty(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];saveCart();updateCart()}
function saveCart(){localStorage.setItem("cl_cart",JSON.stringify(cart))}
function updateCart(){
 const entries=Object.entries(cart).filter(([id,q])=>products.some(p=>p.id===id)&&q>0);const count=entries.reduce((s,[,q])=>s+q,0);$("#cartCount").textContent=count;$("#cartTotalItems").textContent=count;
 if(!entries.length){$("#cartItems").innerHTML='<div class="empty">Your cart is empty.<br>Add components or kits to build an order.</div>';return}
 $("#cartItems").innerHTML=entries.map(([id,q])=>{const p=products.find(x=>x.id===id);return `<div class="cart-row"><img src="${p.image}" alt="" onerror="this.onerror=null;this.src='images/source-pages/page-${String(p.page).padStart(2,'0')}.jpg';"><div><h4>${escapeHtml(p.name)}</h4><p>SKU: ${escapeHtml(productSku(p))}</p><p>${escapeHtml(p.price)}</p><div class="qty"><button data-minus="${id}">−</button><b>${q}</b><button data-plus="${id}">+</button></div></div><button class="close" style="position:static" data-remove="${id}">×</button></div>`}).join("");
 document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeFromCart(b.dataset.remove));
}
function openCart(){$("#cartDrawer").classList.add("open")};function closeCart(){$("#cartDrawer").classList.remove("open")};
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function initMotion(){
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
 const header=$("#siteHeader");window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>8),{passive:true});
}
function refreshRevealTargets(){setTimeout(()=>{document.querySelectorAll('.reveal:not(.visible)').forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight*.92)el.classList.add('visible')})},40)}
function initLiveView(){
  const el=$("#liveViewCount"); if(!el)return;
  const update=()=>{const next=Math.floor(28+Math.random()*67);el.textContent=next;el.animate([{opacity:.35,transform:"translateY(4px)"},{opacity:1,transform:"translateY(0)"}],{duration:420,easing:"ease-out"});};
  update(); setInterval(update,60000);
}
function initHeroBrandQuote(){
  const box=document.querySelector('#heroBrandQuote');
  const textEl=document.querySelector('#heroBrandQuoteText');
  const authorEl=document.querySelector('#heroBrandQuoteAuthor');
  if(!box||!textEl||!authorEl)return;
  let quotes=[];
  try{
    const saved=JSON.parse(localStorage.getItem('cl_admin_data_v1')||'null');
    quotes=Array.isArray(saved?.quotes)
      ? saved.quotes.filter(q=>q&&String(q.text||'').trim()).map(q=>({text:String(q.text).trim(),author:String(q.author||'Creative Learning').trim()||'Creative Learning'}))
      : (saved?.quote?.text ? [{text:String(saved.quote.text).trim(),author:String(saved.quote.author||'Creative Learning').trim()||'Creative Learning'}] : []);
  }catch(e){quotes=[];}
  let selectedId='';
  try {
    const saved=JSON.parse(localStorage.getItem('cl_admin_data_v1')||'null');
    selectedId=String(saved?.heroQuoteId||'');
  } catch(e) {}
  const selected=selectedId ? quotes.find(q=>String(q.id)===selectedId) : null;
  const quote=selected || (quotes.length ? quotes[Math.floor(Math.random()*quotes.length)] : {text:'Learning becomes powerful when ideas turn into action.',author:'Creative Learning'});
  textEl.textContent='“'+quote.text+'”';
  authorEl.textContent='— '+quote.author;
  box.classList.remove('is-updating');
  void box.offsetWidth;
  box.classList.add('is-updating');
}

function initInnovationQuotes(){
  // Public-site-only quote renderer. Always reads the latest Admin data directly
  // so quotes cannot disappear because of a stale in-memory value.
  let quotes=[];
  try{
    const saved=JSON.parse(localStorage.getItem('cl_admin_data_v1')||'null');
    quotes=Array.isArray(saved?.quotes)
      ? saved.quotes.filter(q=>q && String(q.text||'').trim()).map(q=>({text:String(q.text).trim(),author:String(q.author||'Creative Learning').trim()||'Creative Learning'}))
      : [];
  }catch(e){ quotes=[]; }

  const gallery=document.querySelector('.quote-gallery-new');
  if(!gallery) return;

  // This renderer can be called more than once (page init + storage sync).
  // Remove the previous public quote cards first so every Admin quote appears
  // exactly once and never gets duplicated after a refresh/sync.
  document.querySelectorAll('.public-quote-moment').forEach(card=>card.remove());

  // Keep the Admin panel untouched. The public site owns this markup.
  gallery.classList.add('quote-gallery-anchor','quotes-ready');
  gallery.innerHTML='';

  const intro=document.createElement('div');
  intro.className='quote-hub-intro';
  intro.innerHTML=`
    <span class="eyebrow">CREATIVE LEARNING • INSPIRATION</span>
    <h2>Ideas worth building.<br><span>Words worth remembering.</span></h2>
    <p>${quotes.length ? 'Every saved quote is published here in a distinct professional style.' : 'Quotes added in Admin will appear here automatically.'}</p>
    <div class="quote-hub-line"><span></span></div>`;
  gallery.appendChild(intro);

  if(!quotes.length){
    gallery.insertAdjacentHTML('beforeend','<div class="quotes-empty-public">No quotes have been published yet.</div>');
    return;
  }

  // Deterministic-but-changing layout: every saved quote is shown exactly once,
  // with a different visual treatment and number position on each page load.
  const seed=Math.floor(Math.random()*1000000);
  const variants=['blue','orange','mint','sand','ink','paper'];
  const shapes=['wide','offset','split','compact'];
  const numPos=['top','side','bottom','corner'];
  const shuffled=quotes.map((q,i)=>({q,i,k:(seed+i*7919)%1000003})).sort((a,b)=>a.k-b.k);
  const anchors=['#products','#practical','#projects','#kits','.contact-section']
    .map(s=>document.querySelector(s)).filter(Boolean);
  // Randomize the section destinations on each page load while keeping every
  // quote unique. Additional quotes remain in the main inspiration area.
  for(let i=anchors.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [anchors[i],anchors[j]]=[anchors[j],anchors[i]];
  }

  shuffled.forEach((entry,position)=>{
    const v=variants[(entry.i+position+seed)%variants.length];
    const shape=shapes[(position+entry.i*2)%shapes.length];
    const side=(position+seed)%2===0?'left':'right';
    const np=numPos[(position*3+entry.i+seed)%numPos.length];
    const article=document.createElement('article');
    article.className=`public-quote-moment quote-moment--${shape} quote-moment--${side} quote-moment--${v}`;
    article.style.setProperty('--quote-delay',`${Math.min(position,10)*70}ms`);
    article.setAttribute('aria-label',`Quote ${String(entry.i+1).padStart(2,'0')}`);
    article.innerHTML=`
      <span class="quote-moment-number quote-number--${np}">${String(entry.i+1).padStart(2,'0')}</span>
      <div class="quote-moment-mark">“</div>
      <div class="quote-moment-copy">
        <span class="quote-moment-kicker">Creative Learning</span>
        <p>“${escapeHtml(entry.q.text)}”</p>
        <div class="quote-moment-author">— ${escapeHtml(entry.q.author)}</div>
      </div>
      <div class="quote-moment-accent" aria-hidden="true"></div>`;

    // First render every quote in the visible quote area, then move some quotes
    // into different website sections so all are visible without duplication.
    if(position < anchors.length){
      const anchor=anchors[position];
      anchor.parentNode.insertBefore(article,anchor);
    }else{
      // Keep remaining unique quotes in the inspiration area, with varied
      // alignment/margins supplied by the quote-moment classes.
      gallery.appendChild(article);
    }
  });

  // Remove the old rotating/live quote if any old markup survived elsewhere.
  const old=document.querySelector('#innovationQuote');
  if(old) old.closest('.quote-live-card')?.remove();
  refreshRevealTargets();
}

// Render after the rest of the public page has initialized as a safety net.
window.addEventListener('DOMContentLoaded',()=>{setTimeout(initHeroBrandQuote,45);setTimeout(initInnovationQuotes,60);});
setTimeout(initInnovationQuotes,120);

window.addEventListener('storage',event=>{
  if(event.key!=='cl_admin_data_v1')return;
  setTimeout(()=>{initHeroBrandQuote();initInnovationQuotes();},20);
});

function initNavigation(){
 const menu=$("#menuToggle"),nav=$("#mainNav");
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
   nav.classList.remove('open');
   menu.setAttribute('aria-expanded','false');
 }));
 const links=[...document.querySelectorAll('.nav-link')];
 const sections=['home','products','practical','projects','kits','why-us','inspiration'].map(id=>document.getElementById(id)).filter(Boolean);
 const setActive=id=>links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+id));
 const obs=new IntersectionObserver(entries=>{
   entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio).forEach(e=>setActive(e.target.id));
 },{rootMargin:'-22% 0px -62% 0px',threshold:[0,.15,.4,.7]});
 sections.forEach(s=>obs.observe(s));
 // A subtle ripple gives every navigation tab the same polished interaction.
 links.forEach(link=>link.addEventListener('pointerdown',e=>{
   const rect=link.getBoundingClientRect();
   const ripple=document.createElement('span');
   ripple.className='nav-ripple';
   ripple.style.left=(e.clientX-rect.left)+'px';
   ripple.style.top=(e.clientY-rect.top)+'px';
   link.appendChild(ripple);
   setTimeout(()=>ripple.remove(),520);
 }));
}
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$("#"+b.dataset.close).classList.remove("open"));
$("#checkoutBtn").onclick=()=>{if(!Object.keys(cart).length){alert("Please add at least one product to the cart.");return}closeCart();$("#checkoutModal").classList.add("open")};
$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const entries=getOrderEntries();
  const lines=entries.map(x=>`• ${x.p.name} — SKU: ${productSku(x.p)} — Qty: ${x.q}`).join("\n");
  const msg=`Hello Creative Learning,\n\nI would like to place an order / request a quote.\n\nCustomer: ${fd.get("name")}\nPhone/WhatsApp: ${fd.get("phone")}\nEmail: ${fd.get("email")||"Not provided"}\nDelivery address: ${fd.get("address")}\nNotes: ${fd.get("notes")||"None"}\n\nProducts:\n${lines}\n\nPlease share availability, final pricing and delivery details. Thank you.`;
  window.open("https://wa.me/919714045096?text="+encodeURIComponent(msg),"_blank");
});
$("#excelBtn").onclick=()=>downloadOrderExcel();
$("#checkoutExcelBtn").onclick=()=>{
  const fd=new FormData($("#checkoutForm"));
  downloadOrderExcel({
    name:fd.get("name"),phone:fd.get("phone"),email:fd.get("email"),
    address:fd.get("address"),notes:fd.get("notes")
  });
};
document.querySelectorAll(".modal-backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)b.classList.remove("open")}));
$("#year").textContent=new Date().getFullYear();loadProducts(); initLiveView(); initHeroBrandQuote(); initInnovationQuotes();


function initEmailComposer(){
  const trigger=$("#headerGmailBtn"), modal=$("#emailComposer"), form=$("#emailComposerForm");
  const subject=$("#emailSubject"), message=$("#emailMessage"), fallback=$("#emailFallbackLink");
  if(!trigger||!modal||!form)return;
  const open=()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");setTimeout(()=>subject?.focus(),50)};
  const close=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")};
  trigger.addEventListener("click",e=>{e.preventDefault();open()});
  modal.querySelectorAll('[data-close="emailComposer"]').forEach(b=>b.addEventListener("click",close));
  modal.addEventListener("click",e=>{if(e.target===modal)close()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))close()});
  const sync=()=>{
    const s=subject.value.trim()||"Creative Learning Enquiry";
    const m=message.value.trim();
    const gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vhp10995%40gmail.com&su="+encodeURIComponent(s)+"&body="+encodeURIComponent(m);
    const mailto="mailto:vhp10995@gmail.com?subject="+encodeURIComponent(s)+"&body="+encodeURIComponent(m);
    fallback.href=mailto;
    return gmail;
  };
  subject.addEventListener("input",sync); message.addEventListener("input",sync);
  form.addEventListener("submit",e=>{e.preventDefault();const url=sync();window.open(url,"_blank","noopener,noreferrer");close()});
  sync();
}

document.addEventListener('DOMContentLoaded', initEmailComposer);


// Interactive media gallery + PDF lightbox
let activePdfObjectUrl='';
function openMediaDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open('creative_learning_media_v1',1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('pdfs'))req.result.createObjectStore('pdfs');};
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
async function getPdfBlobFromDb(token){
  const parts=String(token).replace('idb-pdf:','').split(':');
  if(parts.length<2)return null;
  const db=await openMediaDb();
  const blob=await new Promise((resolve,reject)=>{const tx=db.transaction('pdfs','readonly');const req=tx.objectStore('pdfs').get(`${parts[0]}:${parts.slice(1).join(':')}`);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});
  db.close(); return blob;
}
async function pdfSourceToObjectUrl(src){
  if(!src) return '';
  if(src.startsWith('idb-pdf:')){try{const blob=await getPdfBlobFromDb(src);return blob?URL.createObjectURL(blob):'';}catch(e){return '';}}
  if(src.startsWith('blob:') || src.startsWith('http:') || src.startsWith('https:')) return src;
  try{
    const response=await fetch(src);
    const blob=await response.blob();
    return URL.createObjectURL(blob);
  }catch(e){return src;}
}
function initMediaInteractions(){
  document.addEventListener('click',async e=>{
    const imageOpen=e.target.closest('[data-image-open]');
    if(imageOpen){
      const src=imageOpen.dataset.imageOpen;
      const lightbox=document.querySelector('#imageLightbox');
      const img=lightbox?.querySelector('img');
      if(lightbox&&img&&src){img.src=src;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('media-lightbox-open');}
      return;
    }
    const thumb=e.target.closest('[data-gallery-src]');
    if(thumb){
      const gallery=thumb.closest('.media-gallery');
      const main=gallery?.querySelector('.media-main-image');
      if(main){main.classList.remove('media-swap');void main.offsetWidth;main.src=thumb.dataset.gallerySrc;main.classList.add('media-swap');}
      const opener=gallery?.querySelector('.media-main-open'); if(opener) opener.dataset.imageOpen=thumb.dataset.gallerySrc;
      gallery?.querySelectorAll('.media-thumb').forEach(x=>x.classList.toggle('active',x===thumb));
      return;
    }
    const pdf=e.target.closest('[data-pdf-src]');
    if(pdf){
      const src=pdf.dataset.pdfSrc;
      const lightbox=document.querySelector('#mediaLightbox');
      const frame=lightbox?.querySelector('iframe');
      if(lightbox&&frame&&src){
        if(activePdfObjectUrl)URL.revokeObjectURL(activePdfObjectUrl);
        activePdfObjectUrl=await pdfSourceToObjectUrl(src);
        frame.src=activePdfObjectUrl||src;
        lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('media-lightbox-open');
      }
    }
  });
  document.querySelectorAll('#mediaLightbox [data-close]').forEach(b=>b.addEventListener('click',closeMediaLightbox));
  document.querySelector('#mediaLightbox')?.addEventListener('click',e=>{if(e.target.id==='mediaLightbox')closeMediaLightbox();});
  document.querySelectorAll('#imageLightbox [data-close]').forEach(b=>b.addEventListener('click',closeImageLightbox));
  document.querySelector('#imageLightbox')?.addEventListener('click',e=>{if(e.target.id==='imageLightbox')closeImageLightbox();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMediaLightbox();closeImageLightbox();}});
}
function closeImageLightbox(){const lightbox=document.querySelector('#imageLightbox');if(!lightbox)return;lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');const img=lightbox.querySelector('img');if(img)img.src='';document.body.classList.remove('media-lightbox-open');}
function closeMediaLightbox(){const lightbox=document.querySelector('#mediaLightbox');if(!lightbox)return;lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');const frame=lightbox.querySelector('iframe');if(frame)frame.src='about:blank';if(activePdfObjectUrl){URL.revokeObjectURL(activePdfObjectUrl);activePdfObjectUrl='';}document.body.classList.remove('media-lightbox-open');}
initMediaInteractions();
