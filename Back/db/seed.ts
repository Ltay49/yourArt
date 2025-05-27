import { getDb, initializeConnection, closeConnection } from "./connect";
import { userProfile } from "../data/testdata/profile";
import { MONGODB_URI, DATABASE_NAME } from "./config";

console.log("Starting the seeding process...");

export async function seeding(profile: any): Promise<void> {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    console.log("Connected to database:", db.databaseName);

    const collections = [
      { name: "Profile", data: profile },
    ];

    for (const { name, data } of collections) {
      const collection = db.collection(name);
      await collection.deleteMany({});
      console.log(`${name} collection cleared.`);
      console.log("Seeding data:", data);
      await collection.insertMany(data);
      console.log(`${name} collection seeded with ${data.length} records.`);
    }
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  } finally {
    await closeConnection();
  }
}

// ✅ Run seeding immediately if script is executed directly
seeding(userProfile);
