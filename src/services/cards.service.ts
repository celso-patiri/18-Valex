import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/http-exceptions";
import * as cardsRepository from "../repositories/cardRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargesRepository from "../repositories/rechargeRepository";
import { Card, TransactionTypes } from "../schemas/cards/types";
import { Employee } from "../schemas/employee/types";
import employeesService from "./employees.service";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET + "");

const generateCardNumber = () => faker.finance.creditCardNumber("mastercard");
const generateSecurityCode = () => faker.finance.creditCardCVV();

const formatCardholderName = (fullName: string) => {
  const names = fullName.split(" ");
  let formattedName = names[0];

  for (let i = 1; i < names.length - 1; i++) {
    formattedName = formattedName.concat(" " + names[i].charAt(0));
  }

  formattedName = formattedName.concat(" " + names[names.length - 1]);
  return formattedName.toUpperCase();
};

const getCurrentYearAndMonth = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const yearMonthDay = date.split("-");

  const year = +yearMonthDay[0].slice(2);
  const month = yearMonthDay[1];
  return { month, year };
};

const getExpirationDate = () => {
  const { month, year } = getCurrentYearAndMonth();
  return `${month}/${year + 5}`;
};

const createCard = async (type: TransactionTypes, employee: Employee) => {
  const cvc = generateSecurityCode();
  await cardsRepository.insert({
    employeeId: employee.id,
    number: generateCardNumber(),
    cardholderName: formatCardholderName(employee.fullName),
    securityCode: cryptr.encrypt(cvc),
    expirationDate: getExpirationDate(),
    password: undefined,
    isVirtual: false,
    isBlocked: false,
    type,
  });
  return { cvc };
};

const createVirtualCard = async (originalCard: Card) => {
  const employee = await employeesService.findById(originalCard.employeeId);

  const cvc = generateSecurityCode();
  await cardsRepository.insert({
    employeeId: employee.id,
    number: generateCardNumber(),
    cardholderName: formatCardholderName(employee.fullName),
    securityCode: cryptr.encrypt(cvc),
    expirationDate: getExpirationDate(),
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
  const { month: currentMonth, year: currentYear } = getCurrentYearAndMonth();
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

  const totalIncome = recharges
    .map((recharge) => recharge.amount)
    .reduce((sum, amount) => sum + amount, 0);

  const totalExpense = transactions
    .map((transaction) => transaction.amount)
    .reduce((sum, amount) => sum + amount, 0);

  const balance = totalIncome - totalExpense;
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
};
