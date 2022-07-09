export interface Card {
  id: number;
  employeeId: number;
  number: string;
  cardholderName: string;
  securityCode: string;
  expirationDate: string;
  password?: string;
  isVirtual: boolean;
  originalCardId?: number;
  isBlocked: boolean;
  type: TransactionTypes;
}

export enum TransactionTypesEnum {
  groceries = "groceries",
  restaurants = "restaurants",
  transport = "transport",
  education = "education",
  health = "health",
}

export type TransactionTypes = "groceries" | "restaurant" | "transport" | "education" | "health";
