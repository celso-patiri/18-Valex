import { Request, Response } from "express";
import employeesService from "../services/employees.service";
import cardsService from "../services/cards.service";
import { UnauthorizedException } from "../common/exceptions/http-exceptions";
import { ActivateCardRequest, ValidCardRes } from "../schemas/cards/requests";

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await employeesService.findById(employeeId);
  await employeesService.verifyCardTypeIsAvailable(type, employeeId);

  const newCard = await cardsService.createCard(type, employee);
  res.status(201).send(newCard);
};

const activateCard = async (req: ActivateCardRequest, res: ValidCardRes) => {
  const { id } = req.params;
  const { card } = res.locals;
  const { cvc, password } = req.body;

  if (card.password) throw new UnauthorizedException("Card is already activated");

  cardsService.validadeSecurityCode(cvc, card.securityCode);
  cardsService.registerPassword(id, password);

  res.sendStatus(204);
};

export default {
  createCard,
  activateCard,
};
