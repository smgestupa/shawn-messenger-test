require("dotenv").config();

const handleSetupProfileAPI = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const params = new URLSearchParams({
                get_started: JSON.stringify({ payload: "GET_STARTED" }),
                persistent_menu: JSON.stringify([
                    {
                        locale: "default",
                        composer_input_disabled: false,
                        call_to_actions: [
                            {
                                type: "postback",
                                title: "Talk to an agent",
                                payload: "CARE_HELP"
                            },
                            {
                                type: "postback",
                                title: "Outfit suggestions",
                                payload: "CURATION"
                            },
                            {
                                type: "web_url",
                                title: "Shop now",
                                url: "https://google.com",
                                webview_height_ratio: "full"
                            },
                        ]
                    }
                ]),
                whitelisted_domains: JSON.stringify([
                    "https://shawn-messenger-test.onrender.com"
                ]),
                access_token: process.env.PAGE_ACCESS_TOKEN
            });
        
            const req = await fetch(`https://graph.facebook.com/v14.0/me/messenger_profile?${params.toString()}`, {
                method: "POST"
            });

            if (req.status === 200) {
                resolve("Done!");
            } else {
                reject("Something went wrong when sending messages!");
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    handleSetupProfileAPI
};