import { Collection } from "mongodb";
import { initializeConnection, getDb } from "../db/connect";
import { MONGODB_URI, DATABASE_NAME } from "../db/config";
import { Profile } from "../data/testdata/types"

export const fetchUserProfile = async (
    username: string
): Promise<Profile | null> => {
    try {
        await initializeConnection(MONGODB_URI, DATABASE_NAME);
        const db = getDb();

        const collection: Collection<Profile> = db.collection("Profile");

        const userProfile = await collection.findOne({ username: username });

        return userProfile;
    } catch (err) {
        console.error("Error fetching player stats:", err);
        throw err;
    }
};

export const addToCollection = async (
    username: string,
    artwork: object
  ): Promise<Profile | null> => {
    try {
      await initializeConnection(MONGODB_URI, DATABASE_NAME);
      const db = getDb();
  
      const collection: Collection<Profile> = db.collection("Profile");
  
      // Update the user's document by pushing to the collection array
      const result = await collection.findOneAndUpdate(
        { username }, // Find user by username
        { $push: { collection: artwork } }, // Add new artwork to collection array
        { returnDocument: "after" } // Return the updated document
      );
  
      return result
    } catch (err) {
      console.error("Error updating user collection:", err);
      throw err;
    }
  };

  export const removeArtworkFromCollection = async (
    username: string,
    artTitle: string
  ): Promise<boolean> => {
    const db = getDb();
    const collection: Collection<Profile> = db.collection("Profile");
  
    const result = await collection.updateOne(
      { username },
      { $pull: { collection: { artTitle } } }
    );
  
    return result.modifiedCount > 0;
  };