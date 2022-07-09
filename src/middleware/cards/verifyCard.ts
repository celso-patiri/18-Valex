import { NextFunction, Request, Response } from "express";
import { NotFoundException } from "../../common/exceptions/http-exceptions";
import cardsService from "../../services/cards.service";

export default async function verifyCardIsValid(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  const card = await cardsService.findById(+id);
  if (!card) throw new NotFoundException("Card is not registered");

  await cardsService.verifyCardExpiration(card);

  res.locals.card = card;
  next();
}
