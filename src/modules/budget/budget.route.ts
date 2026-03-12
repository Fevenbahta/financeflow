
import { Router } from "express";
import * as controller from "./budget.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate, budgetSchema, purchaseCheckSchema } from "../../middleware/validation.middleware";

const router = Router();

router.post("/", authenticate, validate(budgetSchema), controller.createBudget);
router.get("/", authenticate, controller.getBudgets);
router.get("/analyze", authenticate, controller.analyze);
router.post("/check-purchase", authenticate, validate(purchaseCheckSchema), controller.checkPurchase);
router.put("/:id", authenticate, validate(budgetSchema.pick({ percentage: true })), controller.updateBudget);
router.delete("/:id", authenticate, controller.deleteBudget);

export default router;

