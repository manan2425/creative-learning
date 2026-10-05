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
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<{ client: MongoClient; db: Db }> | undefined;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  const promise = (async () => {
    try {
      const client = new MongoClient(uri, {
        maxPoolSize: 50,
        minPoolSize: 5,
        maxIdleTimeMS: 120000,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });
      await client.connect();
      const db = client.db(dbName);
      return { client, db };
    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas:', error);
      global._mongoClientPromise = undefined;
      throw error;
    }
  })();

  global._mongoClientPromise = promise;
  return promise;
}


