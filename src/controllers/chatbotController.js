require("dotenv").config();

import homepageService from "../services/homepageService.js";

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
const handleMessage = async (sender_psid, received_message) => {
    // Always show quick replies during chat
    // if (received_message.text || received_message.attachments) {
    //     const quick_replies = {
    //         text: "",
    //         quick_replies: [
    //             {
    //                 content_type: "text",
    //                 title: "Talk to an agent",
    //                 payload: "BTN_TALK_AGENT"
    //             },
    //             {
    //                 content_type: "text",
    //                 title: "Send inquiry",
    //                 payload: "BTN_SEND_INQUIRY"
    //             }
    //         ]
    //     };

    //     await callSendAPI(sender_psid, quick_replies);
    // }

    // let response;

    // if (received_message.text) {
    //     response = {
    //         text: `You sent the message: ${received_message.text}. Now send me an image!`
    //     };
    // } else if (received_message.attachments) {
    //     const attachment_url = received_message.attachments[0].payload.url;

    //     response = {
    //         attachment: {
    //             type: "template",
    //             payload: {
    //                 template_type: "generic",
    //                 elements: [{
    //                     title: "Is this the right picture?",
    //                     subtitle: "Choose Yes if it's correct, otherwise No.",
    //                     image_url: attachment_url,
    //                     buttons: [
    //                         {
    //                             type: "postback",
    //                             title: "Yes",
    //                             payload: "yes"
    //                         },
    //                         {
    //                             type: "postback",
    //                             title: "No",
    //                             payload: "no"
    //                         }
    //                     ]
    //                 }]
    //             }
    //         }
    //     };
    // }

    // await callSendAPI(sender_psid, response);
};

// Handle `messaging_postbacks` events
const handlePostback = async (sender_psid, received_message) => {
    const payload = received_message.payload;
    let response;

    switch (payload) {
        case "BTN_TALK_AGENT": 
            response = {
                text: "An agent will be here shortly!"
            };
            break;
        case "BTN_SEND_INQUIRY":
            response = {
                text: "*a form should open here*"
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
    }
};

const getSetupProfile = async (req, res) => {
    return res.render("profile.ejs");
};

const handleSetupProfile = async (req, res) => {
    try {
        await homepageService.handleSetupProfileAPI();
        return res.redirect("/");
    } catch (error) {
        console.error(error);
    }
};

export default {
    getHomepage,
    getWebhook,
    postWebhook,
    handleSetupProfile,
    getSetupProfile
}