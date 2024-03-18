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
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);

            const sender_psid = webhook_event.sender.id;
            console.log(`Sender PSID: ${sender_psid}`);
            
            // Check if the event is a message or postback
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        
        res.status(200).send("EVENT_RECEIVED");
    } else {
        // Returns an 404 HTTP code if not from a page subscription
        res.sendStatus(404); // 404 means Not Found
    }
}

// Handle `messages` events
const handleMessage = (sender_psid, received_message) => {
    let response;

    if (received_message.text) {
        response = {
            text: `You sent the message: ${received_message.text}. Now send me an image!`
        };
    }

    callSendAPI(sender_psid, response);
};

// Handle `messaging_postbacks` events
const handlePostback = (sender_psid, received_message) => {

};

// Send response messages via the Send API
const callSendAPI = async (sender_psid, received_message) => {
    const req = fetch(`https://graph.facebook.com/v19.0/me/messages
    ?recipient={'id': '${sender_psid}'}
    &messaging_type=RESPONSE
    &message={'text': '${received_message}'}
    &access_token=${process.env.PAGE_ACCESS_TOKEN}`, 
    {
        method: "POST",
        body: requestBody
    });

    if (req.status === 200) {
        console.log("Message sent!");
    } else {
        console.error("Unable to send messages.");
    }
};

export default {
    getHomepage,
    getWebhook,
    postWebhook
}