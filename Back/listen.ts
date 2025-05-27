import app from "./app"; // Import the Express app from app.ts
import { initializeConnection } from "./db/connect"; // MongoDB connection logic
import { MONGODB_URI, DATABASE_NAME } from "./db/config"; // Environment variables for MongoDB URI and DB name

const { PORT = 4000 } = process.env;

const startServer = async () => {
  try {
    console.log("Starting server...");

    // Connect to MongoDB
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    console.log("Connected to MongoDB");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    }).on("error", (err) => {
      console.error("Error occurred while starting the server:", err);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process if there is an error
  }
};

startServer(); // Call the startServer function
