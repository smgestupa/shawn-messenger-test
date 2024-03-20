require("dotenv").config();

const handleSetupProfileAPI = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const params = new URLSearchParams({
                persistent_menu: JSON.stringify([
                    {
                        locale: "default",
                        composer_input_disabled: false,
                        call_to_actions: [
                            {
                                type: "postback",
                                title: "Notify an agent!",
                                payload: "BTN_TALK_AGENT"
                            },
                            {
                                type: "postback",
                                title: "Send an inquiry",
                                payload: "BTN_SEND_INQUIRY"
                            }
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