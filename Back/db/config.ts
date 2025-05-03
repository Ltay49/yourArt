import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.local" : ".env.development";
dotenv.config({ path: envFile });
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("DATABASE_NAME:", process.env.DATABASE_NAME);


export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
export const DATABASE_NAME = process.env.DATABASE_NAME || "defaultDB";
export const PORT = process.env.PORT || 5000;