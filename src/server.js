require("dotenv").config();

import express from "express";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web.js";

const app = express();
const PORT = process.env.PORT ?? 8080;

// Configure view engine
viewEngine(app);

// Initialize web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(`Application is running at port ${PORT}.`);
});