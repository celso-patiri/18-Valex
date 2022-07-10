import { Response } from "express";
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/http-exceptions";
import {
  ActivateCardReq,
  PasswordBodyReq,
  CreateCardRequest,
  ValidCardRes,
  RechargeCardReq,
} from "../schemas/cards/requests";
import cardsService from "../services/cards.service";
import employeesService from "../services/employees.service";

const createCard = async (req: CreateCardRequest, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await employeesService.findById(employeeId);
  await employeesService.verifyCardTypeIsAvailable(type, employeeId);

  const newCard = await cardsService.createCard(type, employee);
  res.status(201).send(newCard);
};

const activateCard = async (req: ActivateCardReq, res: ValidCardRes) => {
  const { id } = req.params;
  const { card } = res.locals;
  const { cvc, password } = req.body;

  if (card.password) throw new UnauthorizedException("Card is already activated");

  cardsService.validadeSecurityCode(cvc, card.securityCode);
  cardsService.registerPassword(id, password);

  res.sendStatus(204);
};

const blockCard = async (req: PasswordBodyReq, res: ValidCardRes) => {
  const { id } = req.params;
  const { card } = res.locals;
  const { password } = req.body;

  if (card.isBlocked) throw new ForbiddenException("Card is already blocked");
  cardsService.validatePassword(password, card.password);
  await cardsService.updateBlockedStatus(id, true);

  res.sendStatus(204);
};

const unblockCard = async (req: PasswordBodyReq, res: ValidCardRes) => {
  const { id } = req.params;
  const { card } = res.locals;
  const { password } = req.body;

  if (!card.isBlocked) throw new ForbiddenException("Card is not blocked");
  cardsService.validatePassword(password, card.password);

  await cardsService.updateBlockedStatus(id, false);

  res.sendStatus(204);
};

const rechargeCard = async (req: RechargeCardReq, res: ValidCardRes) => {
  const { id } = req.params;
  const { card } = res.locals;
  const { amount } = req.body;

  if (card.isBlocked) throw new ForbiddenException("Card is blocked");
  await cardsService.rechardCard(id, amount);

  res.sendStatus(204);
};

export default {
  createCard,
  activateCard,
  blockCard,
  unblockCard,
  rechargeCard,
};
