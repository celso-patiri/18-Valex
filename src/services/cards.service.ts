import { ForbiddenException, UnauthorizedException } from "../exceptions/http-exceptions";
import * as cardsRepository from "../repositories/cardRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargesRepository from "../repositories/rechargeRepository";
import { Card, TransactionTypes } from "../schemas/cards/types";
import { Employee } from "../schemas/employee/types";
import employeesService from "./employees.service";
import cryptr from "../utils/cryptr.utils";
import * as faker from "../utils/faker.utils";
import * as utils from "../utils/cards.utils";

const createCard = async (type: TransactionTypes, employee: Employee) => {
  const cvc = faker.generateSecurityCode();
  await cardsRepository.insert({
    employeeId: employee.id,
    number: faker.generateCardNumber(),
    cardholderName: utils.formatCardholderName(employee.fullName),
    securityCode: cryptr.encrypt(cvc),
    expirationDate: utils.getExpirationDate(),
    password: undefined,
    isVirtual: false,
    isBlocked: false,
    type,
  });
  return { cvc };
};

const createVirtualCard = async (originalCard: Card) => {
  const employee = await employeesService.findById(originalCard.employeeId);

  const cvc = faker.generateSecurityCode();
  await cardsRepository.insert({
    employeeId: employee.id,
    number: faker.generateCardNumber(),
    cardholderName: utils.formatCardholderName(employee.fullName),
    securityCode: cryptr.encrypt(cvc),
    expirationDate: utils.getExpirationDate(),
    password: originalCard.password,
    originalCardId: originalCard.id,
    isVirtual: true,
    isBlocked: false,
    type: originalCard.type,
  });
  return { cvc };
};

const findById = async (cardId: number) => cardsRepository.findById(cardId);

const verifyCardExpiration = async (card: Card) => {
  const { month: currentMonth, year: currentYear } = utils.getCurrentYearAndMonth();
  const [month, year] = card.expirationDate.split("/");

  if (+currentYear > +year || (+currentYear === +year && +currentMonth > +month))
    throw new ForbiddenException("Card is expired");
};

const validadeSecurityCode = (cvc: string, encryptedCvc: string) => {
  const decryptedCvc = cryptr.decrypt(encryptedCvc);
  if (cvc != decryptedCvc) throw new UnauthorizedException("Invalid CVC");
};

const registerPassword = async (cardId: number, password: string) => {
  await cardsRepository.update(cardId, { password: cryptr.encrypt(password) });
};

const validatePassword = (password: string, encryptedPassword?: string) => {
  if (!encryptedPassword) throw new ForbiddenException("Card is not activated");
  if (password != cryptr.decrypt(encryptedPassword))
    throw new UnauthorizedException("Invalid password");
};

const updateBlockedStatus = async (cardId: number, block: boolean) => {
  await cardsRepository.update(cardId, { isBlocked: block });
};

const rechardCard = async (cardId: number, amount: number) => {
  await rechargesRepository.insert({ cardId, amount });
};

const getBalance = async (cardId: number) => {
  const recharges = await rechargesRepository.findByCardId(cardId);
  const transactions = await paymentRepository.findByCardId(cardId);

  const balance = utils.calculateBalance(recharges, transactions);

  return { balance, transactions, recharges };
};

const validateCardDetails = async (
  number: string,
  cardholderName: string,
  expirationDate: string,
) => {
  const card = await cardsRepository.findByCardDetails(number, cardholderName, expirationDate);
  if (!card) throw new ForbiddenException("Invalid card details");
};

const deleteVirtualCard = async (cardId: number) => await cardsRepository.remove(cardId);

export default {
  createCard,
  findById,
  verifyCardExpiration,
  validadeSecurityCode,
  registerPassword,
  validatePassword,
  updateBlockedStatus,
  rechardCard,
  getBalance,
  validateCardDetails,
  createVirtualCard,
  deleteVirtualCard,
};
