import { Router } from "express";
import { createUser, getUser, loginUser} from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate, userSchema, loginSchema } from "../../middleware/validation.middleware";

const router = Router();

router.post("/register", validate(userSchema), createUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/:id", authenticate, getUser)

export default router;