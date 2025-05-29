import { initializeConnection, closeConnection } from "../db/connect";
import { MONGODB_URI, DATABASE_NAME } from "../db/config";
import { Db } from "mongodb";
import request from "supertest";
import app from '../app'
import { seeding } from "../db/seed";

import {
    userProfile
} from "../data/testdata/profile"

let testDb: Db;

beforeAll(async () => {
  const { db } = await initializeConnection(MONGODB_URI, DATABASE_NAME);
  if (!db) {
    throw new Error("Failed to initialize the database");
  }
  testDb = db;

  await seeding(
 userProfile
 );

});

afterAll(async () => {
  await closeConnection();
});

  describe("API Health Check", () => {
    test("should return a 200 status code for the root endpoint", async () => {
      const response = await request(app).get("/api");
      expect(response.status).toBe(200);
    });
  });
  
  describe("GET: Returns user information", () => {
    test("should return the userProfile by username", async () => {
      const response = await request(app).get("/api/userProfile/Jimmy123");

      expect(response.status).toBe(200);
      console.log(response.body)
      expect(response.body).toMatchObject({
        firstname: "James",
        surname: "Harrington",
        username: "Jimmy123",
        email: "lewistaylor01@outlook.com",
        collection: [
          {
            collection: "The Art Institute of Chicago",
            artTitle: "Song Of The Lark",
            artist: "Jules Breton",
            imageUrl:
              "https://www.artic.edu/iiif/2/48b2de88-ba73-8e19-f448-d1cef4a1c847/full/843,/0/default.jpg",
          },
        ],
      });
    });
    test("POST: Adds a userProfile", async () => {
      const userDetails = {
        firstname: "Gary",
        surname: "Singleton",
        username: "GazzaSing8386",
        email: "lewistaylor01@outlook.com",
      };
      const response = await request(app)
        .post("/api/userProfile") 
        .send(userDetails)      
        .expect(201);             
    
      expect(response.body).toMatchObject(userDetails);
    });
  });

  describe("Adds to collection of user", () => {
    test("should return add ", async () => {
      const artwork = 
        {
          collection: "The Art Institute of Chicago",
          artTitle: "Water Lilies",
          artist: "Claude Monet",
          imageUrl:
            "https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg",
        }
      const response = await request(app)
      .post("/api/userProfile/Jimmy123/collection")
      .send(artwork)
      .expect(201)
      expect(response.body).toMatchObject({
        firstname: "James",
        surname: "Harrington",
        username: "Jimmy123",
        email: "lewistaylor01@outlook.com",
        collection: [
          {
            collection: "The Art Institute of Chicago",
            artTitle: "Song Of The Lark",
            artist: "Jules Breton",
            imageUrl:
              "https://www.artic.edu/iiif/2/48b2de88-ba73-8e19-f448-d1cef4a1c847/full/843,/0/default.jpg",
          },
          {
            collection: "The Art Institute of Chicago",
            artTitle: "Water Lilies",
            artist: "Claude Monet",
            imageUrl:
              "https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg",
          }
        ],
      })   
    });
  });
  
  describe("DELETE: will remove artwork from user's collection", () => {
    test("removes artwork from collection by title", async () => {
      const response = await request(app)
        .delete("/api/userProfile/Jimmy123/collection/Water%20Lilies") // encode the space
        .expect(200);
  
      expect(response.body).toMatchObject({
        message: "Artwork removed"
      });
    });
  });
  
  

  // PASSWORD