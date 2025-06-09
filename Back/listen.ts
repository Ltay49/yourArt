import app from "./app"; 
import { initializeConnection } from "./db/connect"; 
import { MONGODB_URI, DATABASE_NAME } from "./db/config";

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
    process.exit(1);
  }
};

startServer();
