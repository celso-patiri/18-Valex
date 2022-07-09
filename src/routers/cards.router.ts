import { Router } from "express";
import CardsController from "../controllers/cards.controller";
import validadeApiKeyHeader from "../middleware/auth/apiKeyHeader";
import validateBody from "../middleware/validation/zod";
import { createCardSchema } from "../schemas/cards/requests";

const router = Router();

router.post(
  "/cards",
  validadeApiKeyHeader,
  validateBody(createCardSchema),
  CardsController.createCard,
);

router.post("/cards/:id/activate");

export default router;
