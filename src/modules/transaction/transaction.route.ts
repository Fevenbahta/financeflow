import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "./transaction.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate, transactionSchema } from "../../middleware/validation.middleware";

const router = Router();

router.post("/", authenticate, validate(transactionSchema), createTransaction);
router.get("/user/:userId", authenticate, getTransactions);
router.delete("/:id", authenticate, deleteTransaction);
router.put("/:id", authenticate, validate(transactionSchema.partial()), updateTransaction);

export default router;