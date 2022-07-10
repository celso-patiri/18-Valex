import { Request } from "express";
import { z } from "zod";

export const makePurchaseSchema = z.object({
  cardId: z.number(),
  password: z.string().min(4),
  businessId: z.number(),
  amount: z.number().gt(0),
});

export const onlinePurchaseSchema = z.object({
  cardId: z.number(),
  number: z.string(),
  name: z.string(),
  expirationDate: z.string(),
  securityCode: z.string(),
  businessId: z.number(),
  amount: z.number().gt(0),
});

export interface MakePurchaseReq extends Request {
  body: {
    cardId: number;
    password: string;
    businessId: number;
    amount: number;
  };
}

export interface OnlinePurchaseReq extends Request {
  body: {
    cardId: number;
    number: string;
    name: string;
    expirationDate: string;
    securityCode: string;
    businessId: number;
    amount: number;
  };
}
