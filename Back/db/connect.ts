import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export const initializeConnection = async (uri: string, dbName: string) => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connection successful");
  } else {
    console.log("MongoDB connection already established.");
  }
  return { client, db };
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("Database not initialized. Call `initializeConnection` first.");
  }
  return db;
};

export const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null; 
    db = null;
    console.log("MongoDB connection closed.");
  }
};

