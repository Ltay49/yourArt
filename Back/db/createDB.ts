import { Db, MongoClient } from "mongodb";
import {initializeConnection} from "./connect"

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName: string = process.env.DATABASE_NAME || "defaultDB";

export const createDatabase = async (): Promise<{
  db: Db | null;
  client: MongoClient;
}> => {
  const { client, db } = await initializeConnection(uri, dbName);
  return { db, client };
};