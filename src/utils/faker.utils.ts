import { faker } from "@faker-js/faker";

export const generateCardNumber = () => faker.finance.creditCardNumber("mastercard");
export const generateSecurityCode = () => faker.finance.creditCardCVV();
