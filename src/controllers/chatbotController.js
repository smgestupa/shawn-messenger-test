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
            // console.log(webhook_event);

            const sender_psid = webhook_event.sender.id;
            // console.log(`Sender PSID: ${sender_psid}`);
            
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
            "text": `You sent the message: ${received_message.text}. Now send me an image!`
        };
    } else if (received_message.attachments) {
        const attachment_url = received_message.attachments[0].payload.url;

        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Choose Yes if it's correct, otherwise No.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes",
                                "payload": "yes"
                            },
                            {
                                "type": "postback",
                                "title": "No",
                                "payload": "no"
                            }
                        ]
                    }]
                }
            }
        };
    }

    callSendAPI(sender_psid, response);
};

// Handle `messaging_postbacks` events
const handlePostback = (sender_psid, received_message) => {
    let response;

    const payload = received_message.payload;
    if (payload === "yes") {
        response = {
            "text": "Thanks!"
        };
    } else if (payload === "no") {
        response = {
            "text": "Womp womp! Try sending another image."
        };
    }

    callSendAPI(sender_psid, response);
};

// Send response messages via the Send API
const callSendAPI = async (sender_psid, received_message) => {
    console.log(received_message);
    console.log(`https://graph.facebook.com/v14.0/me/messages?recipient={'id': '${sender_psid}'}&messaging_type=RESPONSE&message=${received_message}&access_token=${process.env.PAGE_ACCESS_TOKEN}`);

    const req = fetch(`https://graph.facebook.com/v14.0/me/messages?recipient={'id': '${sender_psid}'}&messaging_type=RESPONSE&message=${received_message}&access_token=${process.env.PAGE_ACCESS_TOKEN}`, 
    {
        method: "POST"
    });

    if (req.status === 200) {
        console.log("Message sent!");
    } else {
        console.error("Something went wrong when sending messages!");
    }
};

export default {
    getHomepage,
    getWebhook,
    postWebhook
}