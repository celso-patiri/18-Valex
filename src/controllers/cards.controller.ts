import { Request, Response } from "express";
import employeesService from "../services/employees.service";

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await employeesService.findById(employeeId);
  await employeesService.verifyCardTypeIsAvailable(type, employeeId);

  res.sendStatus(203);
};

export default {
  createCard,
};
