import { faker } from "@faker-js/faker";
import { Card, TransactionTypes } from "../schemas/cards/types";
import { Employee } from "../schemas/employee/types";
import * as cardsRepository from "../repositories/cardRepository";
import Lodash from "lodash";
import Cryptr from "cryptr";
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/http-exceptions";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET + "");

const randomNumber = (max: number) => faker.datatype.number({ max }).toString();
const formatNumberToNDigits = (number: string, n: number) => Lodash.padStart(number, n, "0"); //Fills left side of number with 0s if neceessary

const fourDigits = () => formatNumberToNDigits(randomNumber(9999), 4);
const generateCardNumber = () => `${fourDigits()} ${fourDigits()} ${fourDigits()} ${fourDigits()}`;
const generateSecurityCode = () => formatNumberToNDigits(randomNumber(999), 3);

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
    isBlocked: true,
    type,
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

export default {
  createCard,
  findById,
  verifyCardExpiration,
  validadeSecurityCode,
  registerPassword,
};
