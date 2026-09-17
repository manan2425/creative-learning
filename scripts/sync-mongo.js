const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI || 'mongodb+srv://mananpatel448_db_user:vAtpX9yemnMy9NM9@cluster0.0ucha5x.mongodb.net/creative_learning?retryWrites=true&w=majority';
const dataPath = path.join(__dirname, '..', 'src', 'data', 'initialCatalog.json');
const catalogPath = path.join(__dirname, '..', 'src', 'data', 'catalog.json');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function sync() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    tls: true,
  });
  await client.connect();
  const db = client.db('creative_learning');
  const collection = db.collection('catalog');

  await collection.updateOne(
    { _id: 'main_catalog' },
    { $set: { _id: 'main_catalog', data: data, updatedAt: new Date() } },
    { upsert: true }
  );

  fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Success! Seeded MongoDB Atlas with:`);
  console.log(` - ${data.products.length} Products & Starter Kits`);
  console.log(` - ${data.practicals.length} Guided Practicals`);
  console.log(` - ${data.projects.length} Engineering Blueprints / Projects`);
  console.log(` - ${data.quotes.length} Quotes`);
  console.log(` - Company config: ${data.company.name}`);

  await client.close();
}

sync().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
