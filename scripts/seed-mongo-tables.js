const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://mananpatel448_db_user:vAtpX9yemnMy9NM9@cluster0.0ucha5x.mongodb.net/creative_learning?retryWrites=true&w=majority';
const dbName = process.env.MONGODB_DB || 'creative_learning';

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'catalog.json');
const initialPath = path.join(__dirname, '..', 'src', 'data', 'initialCatalog.json');

const rawData = fs.existsSync(catalogPath)
  ? fs.readFileSync(catalogPath, 'utf-8')
  : fs.readFileSync(initialPath, 'utf-8');

const data = JSON.parse(rawData);

async function seedTables() {
  console.log('⚡ Initializing MongoDB Tables & Collections...');
  console.log(`📡 Connecting to cluster: ${uri.split('@')[1] || 'Atlas'}...`);

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');
    const db = client.db(dbName);

    // 1. PRODUCTS TABLE
    console.log(`\n📦 Seeding 'products' table (${data.products.length} items)...`);
    const prodCol = db.collection('products');
    await prodCol.createIndex({ id: 1 }, { unique: true });
    await prodCol.createIndex({ category: 1 });
    await prodCol.createIndex({ sku: 1 });

    for (const p of data.products) {
      await prodCol.updateOne(
        { id: p.id },
        { $set: { ...p, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(` ✓ 'products' table ready with ${data.products.length} documents.`);

    // 2. PRACTICALS TABLE
    console.log(`\n🧪 Seeding 'practicals' table (${data.practicals.length} items)...`);
    const pracCol = db.collection('practicals');
    await pracCol.createIndex({ key: 1 }, { unique: true });
    for (const pr of data.practicals) {
      await pracCol.updateOne(
        { key: pr.key },
        { $set: { ...pr, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(` ✓ 'practicals' table ready with ${data.practicals.length} documents.`);

    // 3. PROJECTS TABLE
    console.log(`\n🚀 Seeding 'projects' table (${data.projects.length} items)...`);
    const projCol = db.collection('projects');
    await projCol.createIndex({ key: 1 }, { unique: true });
    for (const pj of data.projects) {
      await projCol.updateOne(
        { key: pj.key },
        { $set: { ...pj, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(` ✓ 'projects' table ready with ${data.projects.length} documents.`);

    // 4. QUOTES TABLE
    console.log(`\n💬 Seeding 'quotes' table (${data.quotes.length} items)...`);
    const quotesCol = db.collection('quotes');
    await quotesCol.createIndex({ id: 1 }, { unique: true });
    for (const q of data.quotes) {
      await quotesCol.updateOne(
        { id: q.id },
        { $set: { ...q, isHero: q.id === data.heroQuoteId, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(` ✓ 'quotes' table ready with ${data.quotes.length} documents.`);

    // 5. COMPANY CONFIG TABLE
    console.log(`\n🏢 Seeding 'company' table...`);
    const companyCol = db.collection('company');
    await companyCol.updateOne(
      { _id: 'company_config' },
      { $set: { _id: 'company_config', ...data.company, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(` ✓ 'company' table ready for ${data.company.name}.`);

    // 6. COMPOSITE CATALOG TABLE
    console.log(`\n📚 Seeding 'catalog' composite table...`);
    const catalogCol = db.collection('catalog');
    await catalogCol.updateOne(
      { _id: 'main_catalog' },
      { $set: { _id: 'main_catalog', data: data, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(` ✓ 'catalog' main table ready.`);

    // 7. AUTH TABLE
    const crypto = require('crypto');
    const DEFAULT_PASS_HASH = crypto.createHash('sha256').update('admin123').digest('hex');
    const DEFAULT_RECOVERY_HASH = crypto.createHash('sha256').update('CREATIVE-LEARNING-RESET').digest('hex');

    console.log(`\n🔐 Seeding 'auth' table...`);
    const authCol = db.collection('auth');
    await authCol.updateOne(
      { _id: 'admin_credentials' },
      {
        $set: {
          _id: 'admin_credentials',
          passHash: DEFAULT_PASS_HASH,
          recoveryHash: DEFAULT_RECOVERY_HASH,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(` ✓ 'auth' table ready (default password: admin123, recovery: CREATIVE-LEARNING-RESET).`);

    // 8. INQUIRIES TABLE
    const inqCol = db.collection('inquiries');
    await inqCol.createIndex({ createdAt: -1 });
    console.log(` ✓ 'inquiries' table index verified.`);

    console.log('\n========================================');
    console.log('🎉 ALL MONGODB TABLES CREATED & SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log('Collections in Database:');
    console.log(' - products   : Hardware components, MCUs, sensors, starter kits');
    console.log(' - practicals : Step-by-step guided hardware lab schematics');
    console.log(' - projects   : Robotics & IoT capstone engineering blueprints');
    console.log(' - quotes     : Featured vision quotes & inspirational logs');
    console.log(' - company    : Company branding, phone, WhatsApp & email config');
    console.log(' - auth       : Admin security credentials & recovery key');
    console.log(' - inquiries  : Customer quote submissions & cart orders');
    console.log(' - catalog    : Composite catalog root document');
    console.log('========================================\n');
  } catch (err) {
    console.error('\n⚠️ Note: MongoDB Atlas connection could not be established directly from this terminal.');
    console.error('Reason:', err.message);
    console.error('\n👉 To connect MongoDB Atlas:');
    console.error(' 1. Go to cloud.mongodb.com -> Security -> Network Access');
    console.error(' 2. Add IP Address: 0.0.0.0/0 (Allow Access from Anywhere)');
    console.error(' 3. Run this script again: node scripts/seed-mongo-tables.js\n');
  } finally {
    await client.close();
  }
}

seedTables();
