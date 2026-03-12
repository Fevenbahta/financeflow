import express from "express";
import * as controller from "./account.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate, accountSchema } from "../../middleware/validation.middleware";

const router = express.Router();

router.post("/", authenticate, validate(accountSchema), controller.createAccount);
router.get("/", authenticate, controller.getAccounts);

export default router;