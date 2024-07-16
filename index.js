import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { initApp } from "./src/utils/initApp.js";

const app = express();

initApp(app, express);
