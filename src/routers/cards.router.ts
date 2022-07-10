import { Router } from "express";
import cardsController from "../controllers/cards.controller";
import validadeApiKeyHeader from "../middleware/auth/apiKeyHeader";
import verifyCardIsValid from "../middleware/cards/verifyCard";
import validateBody from "../middleware/validation/zod";
import {
  activateCardSchema,
  passwordBodySchema,
  createCardSchema,
  rechargeCardSchema,
} from "../schemas/cards/requests";

const router = Router();

router.post(
  "/cards",
  validadeApiKeyHeader,
  validateBody(createCardSchema),
  cardsController.createCard,
);

router.post(
  "/cards/:id/recharge",
  validadeApiKeyHeader,
  validateBody(rechargeCardSchema),
  verifyCardIsValid,
  cardsController.rechargeCard,
);

router.post(
  "/cards/:id/activate",
  validateBody(activateCardSchema),
  verifyCardIsValid,
  cardsController.activateCard,
);

router.post(
  "/cards/:id/block",
  validateBody(passwordBodySchema),
  verifyCardIsValid,
  cardsController.blockCard,
);

router.post(
  "/cards/:id/unblock",
  validateBody(passwordBodySchema),
  verifyCardIsValid,
  cardsController.unblockCard,
);

export default router;
