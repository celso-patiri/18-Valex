import { Router } from "express";
import purchasesController from "../controllers/purchases.controller";
import verifyCardIsValidByBody from "../middleware/cards/verifyCardByBody";
import validateBody from "../middleware/validation/zod";
import { makePurchaseSchema, onlinePurchaseSchema } from "../schemas/purchase/requests";

const router = Router();

router.post(
  "/purchase",
  validateBody(makePurchaseSchema),
  verifyCardIsValidByBody,
  purchasesController.makePurchase,
);

router.post(
  "/purchase/online",
  validateBody(onlinePurchaseSchema),
  verifyCardIsValidByBody,
  purchasesController.makeOnlinePurchase,
);

export default router;
