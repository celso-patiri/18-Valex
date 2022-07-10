import { ForbiddenException } from "../common/exceptions/http-exceptions";
import cardsService from "./cards.service";
import * as paymentsRepository from "../repositories/paymentRepository";

const makePurchase = async (cardId: number, businessId: number, amount: number) => {
  const { balance } = await cardsService.getBalance(cardId);

  if (balance < amount) throw new ForbiddenException("Card has insufficient credit for the amount");

  await paymentsRepository.insert({ cardId, businessId, amount });
};

export default {
  makePurchase,
};
