const handleSetupProfileAPI = () => {
    return new Promise((resolve, reject) => {
        try {
            const params = new URLSearchParams({
                get_started: { payload: "GET_STARTED" },
                persistent_menu: {
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
                            url: "https://shattereddisk.github.io/rickroll/rickroll.mp4",
                            webview_height_ratio: "full"
                        },
                    ]
                },
                access_token: process.env.PAGE_ACCESS_TOKEN
            });
        
            const req = fetch(`https://graph.facebook.com/v14.0/me/messenger_profile?${params.toString()}`, {
                method: "POST"
            });

            if (req.status === 200) {
                resolve("Done!");
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default handleSetupProfileAPI;