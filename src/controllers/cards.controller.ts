import { Response } from "express";
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/http-exceptions";
import {
  ActivateCardReq,
  PasswordBodyReq,
  CreateCardRequest,
  ValidCardRes,
  RechargeCardReq,
  CardIdParamReq,
  VirtualCardReq,
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
  if (card.isVirtual) throw new ForbiddenException("Only non virtual cards can be activated");

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
  if (card.isVirtual) throw new ForbiddenException("Virtual cards cant be recharhed");

  await cardsService.rechardCard(id, amount);
  res.sendStatus(204);
};

const getBalance = async (req: CardIdParamReq, res: Response) => {
  const { id } = req.params;

  const card = await cardsService.findById(id);
  if (!card) throw new NotFoundException("Card not found");

  const result = await cardsService.getBalance(id);
  res.status(200).send(result);
};

const createVirtualCard = async (req: VirtualCardReq, res: ValidCardRes) => {
  const { password } = req.body;
  const { card } = res.locals;

  cardsService.validatePassword(password, card.password);
  const newCard = await cardsService.createVirtualCard(card);

  res.status(201).send(newCard);
};

const deleteVirtualCard = async (req: VirtualCardReq, res: ValidCardRes) => {
  const { password } = req.body;
  const { card } = res.locals;

  cardsService.validatePassword(password, card.password);

  if (!card.isVirtual) throw new ForbiddenException("Only virtual cards can be deleted");
  await cardsService.deleteVirtualCard(card.id);

  res.sendStatus(204);
};

export default {
  createCard,
  activateCard,
  blockCard,
  unblockCard,
  rechargeCard,
  getBalance,
  createVirtualCard,
  deleteVirtualCard,
};
