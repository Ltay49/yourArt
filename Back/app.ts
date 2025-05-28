import express from "express";
import cors from "cors";
import { getApi, getUser, addArtwork, removeArtwork} from "./controllers/app.controller";

const app = express();

app.get("/api", getApi);

app.use(cors());
app.use(express.json()); // ✅ Essential for parsing JSON

app.get("/api/userProfile/:username", getUser);
app.post('/api/userProfile/:username/collection' ,addArtwork)

app.delete("/api/userProfile/:username/collection/:artTitle", removeArtwork);


export default app;