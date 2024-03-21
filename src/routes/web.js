import { Router } from "express";
import chatbotController from "../controllers/chatbotController.js";

const router = Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.getHomepage);
    router.get("/webhook", chatbotController.getWebhook);
    router.get("/get-inquiry", chatbotController.getInquiryForm);
    router.post("/webhook", chatbotController.postWebhook);

    return app.use("/", router);
};

export default initWebRoutes;