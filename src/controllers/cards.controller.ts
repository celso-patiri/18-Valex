import { Request, Response } from "express";
import employeesService from "../services/employees.service";
import cardsService from "../services/cards.service";

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await employeesService.findById(employeeId);
  await employeesService.verifyCardTypeIsAvailable(type, employeeId);

  const newCard = await cardsService.createCard(type, employee);
  console.log(newCard);

  res.sendStatus(201);
};

export default {
  createCard,
};
