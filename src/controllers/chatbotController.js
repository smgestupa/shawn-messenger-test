require("dotenv").config();

const getHomepage = (req, res) => {
    return res.send("hello world, world");
};

const getWebhook = (req, res) => {
    const PAGE_VERIFY_TOKEN = process.env.PAGE_VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // If mode and token exists in the query string of the request
    if (mode && token) {
        if (mode === "subscribe" && token === PAGE_VERIFY_TOKEN) {
            console.log("WEBHOOK_VERFIED");
            res.status(200).send(challenge);
        }
    } else {
        // Returns an 403 HTTP code if not from a page subscription
        res.sendStatus(403); // 403 means Forbidden
    }
};

const postWebhook = (req, res) => {
    const body = req.body;

    // If the event is from a page subscription
    if (body.object === "page") {
        body.entry.forEach((entry) => {
            const webhook_event = entry.message[0];
            console.log(webhook_event);

            const sender_psid = webhook_event.sender.id;
            console.log(`Sender PSID: ${sender_psid}`);
        });
        
        res.status(200).send("EVENT_RECEIVED");
    } else {
        // Returns an 404 HTTP code if not from a page subscription
        res.sendStatus(404); // 404 means Not Found
    }
}

export default {
    getHomepage,
    getWebhook,
    postWebhook
}