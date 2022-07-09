import { faker } from "@faker-js/faker";
import { TransactionTypes } from "../schemas/cards";
import { Employee } from "../schemas/employee";
import * as cardsRepository from "../repositories/cardRepository";
import Lodash from "lodash";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET + "");

const randomNumber = (max: number) => faker.datatype.number({ max }).toString();
const formatNumberToNDigits = (number: string, n: number) => Lodash.padStart(number, n, "0"); //Fills left side of number with 0s if neceessary

const fourDigits = () => formatNumberToNDigits(randomNumber(9999), 4);
const generateCardNumber = () => `${fourDigits()} ${fourDigits()} ${fourDigits()} ${fourDigits()}`;
const generateSecurityCode = () => formatNumberToNDigits(randomNumber(999), 3);

const formatCardholderName = (fullName: string) => {
  const names = fullName.split(" ");
  let formattedName = names[0];
  for (let i = 1; i < names.length - 1; i++)
    formattedName = formattedName.concat(" " + names[i].charAt(0));
  formattedName = formattedName.concat(" " + names[names.length - 1]);
  return formattedName.toUpperCase();
};

const getExpirationDate = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const yearMonthDay = date.split("-");

  const year = +yearMonthDay[0].slice(2);
  const month = yearMonthDay[1];
  return `${month}/${year + 5}`;
};

const createCard = async (type: TransactionTypes, employee: Employee) => {
  await cardsRepository.insert({
    employeeId: employee.id,
    number: generateCardNumber(),
    cardholderName: formatCardholderName(employee.fullName),
    securityCode: cryptr.encrypt(generateSecurityCode()),
    expirationDate: getExpirationDate(),
    password: undefined,
    isVirtual: false,
    isBlocked: true,
    type,
  });
};

export default {
  createCard,
};
