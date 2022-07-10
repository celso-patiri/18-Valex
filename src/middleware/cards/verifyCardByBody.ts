import { NextFunction, Response } from "express";
import { NotFoundException } from "../../common/exceptions/http-exceptions";
import { CardIdBodyReq } from "../../schemas/cards/requests";
import cardsService from "../../services/cards.service";

export default async function verifyCardIsValidByBody(
  req: CardIdBodyReq,
  res: Response,
  next: NextFunction,
) {
  const { cardId } = req.body;

  const card = await cardsService.findById(+cardId);
  if (!card) throw new NotFoundException("Card is not registered");

  await cardsService.verifyCardExpiration(card);

  res.locals.card = card;
  next();
}

export const teste = () => verifyCardIsValidByBody;
