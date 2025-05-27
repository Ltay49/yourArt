import express from "express";
import cors from "cors";
import { getApi, getUser, addArtwork } from "./controllers/app.controller";

const app = express();

app.get("/api", getApi);

app.use(cors());
app.use(express.json()); // ✅ Essential for parsing JSON

app.get("/api/userProfile/:username", getUser);
app.post('/api/userProfile/:username/collection' ,addArtwork)

export default app;