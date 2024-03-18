import { Router } from "express";
import chatbotController from "../controllers/chatbotController.js";

const router = Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.getHomepage);
    router.get("/webhook", chatbotController.getWebhook);
    router.get("/setup-profile", chatbotController.getSetupProfile);
    router.post("/webhook", chatbotController.postWebhook);
    router.post("/setup-profile", chatbotController.handleSetupProfile);

    return app.use("/", router);
};

export default initWebRoutes;