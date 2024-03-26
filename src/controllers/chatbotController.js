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

const getInquiryForm = (req, res) => {
    return res.render("inquiry-form.ejs");
}

const postInquiryForm = async (req, res) => {
    const { senderPsid, requestBody } = req.body; 

    const response = {
        text: `Your inquiry has been successfuly sent!\\n\\nContact Name: ${requestBody["contact-name"]}\\nCompany Name: ${requestBody["company-name"]}\\nCompany Email: ${requestBody["company-email"]}\\nMobile Number: ${requestBody["mobile-number"]}\\nType of Inquiry: ${requestBody["inquiry-type"]}\\nMessage: ${requestBody["message"]}`
    };

    console.log(response);

    await callSendAPI(senderPsid, response);
};

// Handle `messaging_postbacks` events
const handlePostback = async (sender_psid, received_message) => {
    const payload = received_message.payload;
    let response;

    switch (payload) {
        case "GET_STARTED":
            response = {
                text: "Welcome to Computrade Technology Philippines! How may we help you?"
            };
            break;
    };

    await callSendAPI(sender_psid, response);
};

// Send response messages via the Send API
const callSendAPI = async (sender_psid, received_message) => {
    const params = new URLSearchParams({
        recipient: JSON.stringify({ id: sender_psid }),
        messaging_type: "RESPONSE",
        message: JSON.stringify(received_message),
        access_token: process.env.PAGE_ACCESS_TOKEN
    });

    console.log(`https://graph.facebook.com/v14.0/me/messages?${params.toString()}`);

    const req = await fetch(`https://graph.facebook.com/v14.0/me/messages?${params.toString()}`, 
    {
        method: "POST"
    });
    const res = await req.json();

    if (req.status === 200) {
        console.log("Message successfully sent!");
    } else {
        console.error(JSON.stringify(res));
        // console.log(`https://graph.facebook.com/v14.0/me/messages?${params.toString()}`);
    }
};

export default {
    getHomepage,
    getWebhook,
    getInquiryForm,
    postWebhook,
    postInquiryForm
}