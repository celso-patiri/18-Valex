import { ForbiddenException } from "../common/exceptions/http-exceptions";
import { ValidCardRes } from "../schemas/cards/requests";
import { MakePurchaseReq, OnlinePurchaseReq } from "../schemas/purchase/requests";
import businessService from "../services/business.service";
import cardsService from "../services/cards.service";
import purchaseService from "../services/purchase.service";

const makePurchase = async (req: MakePurchaseReq, res: ValidCardRes) => {
  const { cardId, password, businessId, amount } = req.body;
  const { card } = res.locals;

  if (card.isBlocked) throw new ForbiddenException("Card is blocked");
  if (card.isVirtual) throw new ForbiddenException("Virtual cards can't be used in POS purchases");

  cardsService.validatePassword(password, card.password);
  await businessService.validateBusinessTransactionType(businessId, card.type);

  await purchaseService.makePurchase(cardId, businessId, amount);
  res.sendStatus(201);
};

const makeOnlinePurchase = async (req: OnlinePurchaseReq, res: ValidCardRes) => {
  const { cardId, number, name, expirationDate, securityCode, businessId, amount } = req.body;
  const { card } = res.locals;

  if (card.isBlocked) throw new ForbiddenException("Card is blocked");

  await cardsService.validateCardDetails(number, name, expirationDate);
  cardsService.validadeSecurityCode(securityCode, card.securityCode);
  await businessService.validateBusinessTransactionType(businessId, card.type);

  await purchaseService.makePurchase(cardId, businessId, amount);
  res.sendStatus(201);
};

export default {
  makePurchase,
  makeOnlinePurchase,
};
