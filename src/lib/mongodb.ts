import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the MongoClient is not repeated on hot-reloading
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, create a standard client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    const dbName = process.env.MONGODB_DB || 'creative_learning';
    return connectedClient.db(dbName);
  } catch (err) {
    console.error('MongoDB Atlas Connection Error:', err);
    return null;
  }
}

export default clientPromise;
