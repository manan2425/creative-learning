import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Fix for Node.js 18+ on Windows trying IPv6 for MongoDB SRV records
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore in environments where not supported
}

const uri = process.env.MONGODB_URI || 'mongodb+srv://mananpatel448_db_user:vAtpX9yemnMy9NM9@cluster0.0ucha5x.mongodb.net/creative_learning?retryWrites=true&w=majority';
const dbName = process.env.MONGODB_DB || 'creative_learning';

declare global {
  var _mongoClientPromise: Promise<{ client: MongoClient; db: Db }> | undefined;
}

let cachedPromise: Promise<{ client: MongoClient; db: Db }> | null = global._mongoClientPromise || null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = (async () => {
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxIdleTimeMS: 60000,
      });
      await client.connect();
      const db = client.db(dbName);
      return { client, db };
    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas:', error);
      cachedPromise = null;
      if (global._mongoClientPromise) delete global._mongoClientPromise;
      throw error;
    }
  })();

  if (process.env.NODE_ENV !== 'production') {
    global._mongoClientPromise = cachedPromise;
  }

  return cachedPromise;
}


