import { NextFunction, Response } from "express";
import { NotFoundException } from "../../exceptions/http-exceptions";
import { CardIdParamReq } from "../../schemas/cards/requests";
import cardsService from "../../services/cards.service";

export default async function verifyCardIsValidByParams(
  req: CardIdParamReq,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  const card = await cardsService.findById(+id);
  if (!card) throw new NotFoundException("Card is not registered");

  await cardsService.verifyCardExpiration(card);

  res.locals.card = card;
  next();
}
