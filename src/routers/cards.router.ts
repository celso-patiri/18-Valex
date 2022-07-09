import { Router } from "express";
import cardsController from "../controllers/cards.controller";
import validadeApiKeyHeader from "../middleware/auth/apiKeyHeader";
import verifyCardIsValid from "../middleware/cards/verifyCard";
import validateBody from "../middleware/validation/zod";
import { activateCardSchema, createCardSchema } from "../schemas/cards/requests";

const router = Router();

router.post(
  "/cards",
  validadeApiKeyHeader,
  validateBody(createCardSchema),
  cardsController.createCard,
);

router.post(
  "/cards/:id/activate",
  validateBody(activateCardSchema),
  verifyCardIsValid,
  cardsController.activateCard,
);

export default router;
