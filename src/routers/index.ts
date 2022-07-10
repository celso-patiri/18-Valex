import { Request, Response, Router } from "express";
import CardsRouter from "./cards.router";
import PurchaseRouter from "./purchase.router";

const router = Router();

router.get("/", (_req: Request, res: Response) => res.status(200).send("Hello from Valex"));

router.use(CardsRouter);
router.use(PurchaseRouter);

export default router;
