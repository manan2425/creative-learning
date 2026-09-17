import { MongoClient, Db } from 'mongodb';

const options = {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
  socketTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://mananpatel448_db_user:vAtpX9yemnMy9NM9@cluster0.0ucha5x.mongodb.net/creative_learning?retryWrites=true&w=majority';
  if (!uri) return null;

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDb(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) return null;
  try {
    const connectedClient = await promise;
    const dbName = process.env.MONGODB_DB || 'creative_learning';
    return connectedClient.db(dbName);
  } catch (err) {
    console.error('MongoDB Atlas Connection Error:', err);
    return null;
  }
}

export default getClientPromise();
