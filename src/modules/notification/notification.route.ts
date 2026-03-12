import { Router } from "express";
import * as controller from "./notification.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate, notificationSchema } from "../../middleware/validation.middleware";

const router = Router();

router.post("/", authenticate, validate(notificationSchema), controller.createNotification);
router.get("/", authenticate, controller.getNotifications);


export default router;