require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web.js";

const app = express();
const PORT = process.env.PORT ?? 8080;

// Configure to use `body-parser` to POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure view engine
viewEngine(app);

// Initialize web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(`Application is running at port ${PORT}.`);
});