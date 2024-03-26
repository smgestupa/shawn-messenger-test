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

// Initialize persistent menu
(async function() {
    try {
        const params = new URLSearchParams({
            get_started: {
                payload: "GET_STARTED"
            },
            persistent_menu: JSON.stringify([
                {
                    locale: "default",
                    composer_input_disabled: false,
                    call_to_actions: [
                        {
                            type: "web_url",
                            title: "Send an inquiry",
                            url: "https://shawn-messenger-test.onrender.com/get-inquiry",
                            webview_height_ratio: "tall",
                            messenger_extensions: true
                        }
                    ]
                }
            ]),
            whitelisted_domains: JSON.stringify([
                "https://shawn-messenger-test.onrender.com"
            ]),
            access_token: process.env.PAGE_ACCESS_TOKEN
        });
        
        await fetch(`https://graph.facebook.com/v14.0/me/messenger_profile?${params.toString()}`, {
            method: "POST"
        });
    
        console.log("Successfully initialized persistent menu.");
    } catch (error) {
        console.error(error);
    }
})();

app.listen(PORT, () => {
    console.log(`Application is running at port ${PORT}.`);
});