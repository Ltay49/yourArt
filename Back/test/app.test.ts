import { initializeConnection, closeConnection } from "../db/connect";
import { MONGODB_URI, DATABASE_NAME } from "../db/config";
import { Db } from "mongodb";
import request from "supertest";
import app from "../app";
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