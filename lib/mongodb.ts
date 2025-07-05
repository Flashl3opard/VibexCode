  import { MongoClient } from 'mongodb';

  interface MongoCache {
    conn: MongoClient | null;
    promise: Promise<MongoClient> | null;
  }

  const globalWithMongo = globalThis as typeof globalThis & {
    mongo?: MongoCache;
  };

  const cached: MongoCache = globalWithMongo.mongo ?? {
    conn: null,
    promise: null,
  };

  globalWithMongo.mongo = cached;

  export async function connectToDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      const uri = "mongodb+srv://agrawalmrinal21:bkIRryqZyWVoIW5h@vibexcode.zg2l2ek.mongodb.net/?retryWrites=true&w=majority&appName=VibeXCode";
      const client = new MongoClient(uri);
      cached.promise = client.connect();
    }

    cached.conn = await cached.promise;
    return cached.conn;
  }
