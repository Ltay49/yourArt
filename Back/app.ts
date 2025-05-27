import express from "express";
import {getApi} from './controllers/app.controller'
import cors from "cors";
const app = express();

export default app;

app.get("/api", getApi)