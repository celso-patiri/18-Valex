import { Request, Response } from "express";
import { z } from "zod";
import { Card, TransactionTypes, TransactionTypesEnum } from "./types";

export const passwordBodySchema = z.object({
  password: z.string().min(4),
});

export const createCardSchema = z.object({
  employeeId: z.number(),
  type: z.nativeEnum(TransactionTypesEnum),
});

export const activateCardSchema = z.object({
  cvc: z.number(),
  password: z.string().min(4),
});

export const rechargeCardSchema = z.object({
  amount: z.number().gt(0),
});

export interface CreateCardRequest extends Request {
  body: {
    employeeId: number;
    type: TransactionTypes;
  };
}

type IdParams = { [key: string]: string } & { id: number };

export interface CardIdRequest extends Request {
  params: IdParams;
}

export interface ActivateCardReq extends CardIdRequest {
  body: {
    cvc: string;
    password: string;
  };
}

export interface PasswordBodyReq extends CardIdRequest {
  body: {
    password: string;
  };
}

export interface RechargeCardReq extends CardIdRequest {
  body: {
    amount: number;
  };
}

export interface ValidCardRes extends Response {
  locals: {
    card: Card;
  };
}
