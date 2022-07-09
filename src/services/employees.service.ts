import { ForbiddenException } from "../common/exceptions/http-exceptions";
import * as employeesRepository from "../repositories/employeeRepository";
import * as cardsRepository from "../repositories/cardRepository";
import { TransactionTypes } from "../schemas/cards";

const findById = async (id: number) => {
  const employee = await employeesRepository.findById(id);
  if (!employee) throw new ForbiddenException("Employee not registered");

  return employee;
};

const verifyCardTypeIsAvailable = async (
  type: TransactionTypes,
  employeeId: number
) => {
  const card = await cardsRepository.findByTypeAndEmployeeId(type, employeeId);
  if (card)
    throw new ForbiddenException(`Employee already has card of type ${type}`);
};

export default {
  findById,
  verifyCardTypeIsAvailable,
};
