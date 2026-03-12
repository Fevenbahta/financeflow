import { Router } from "express";
import * as controller from "./goal.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate, goalSchema, goalProgressSchema } from "../../middleware/validation.middleware";

const router = Router();

router.post("/", authenticate, validate(goalSchema), controller.createGoal);
router.get("/", authenticate, controller.getGoals);
router.put("/:id", authenticate, validate(goalSchema.partial()), controller.updateGoal);
router.delete("/:id", authenticate, controller.deleteGoal);

export default router;

