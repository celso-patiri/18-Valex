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

export const virtualCardSchema = z.object({
  id: z.number(),
  password: z.string().min(4),
});

export interface CreateCardRequest extends Request {
  body: {
    employeeId: number;
    type: TransactionTypes;
  };
}

type IdParams = { [key: string]: string } & { id: number };

export interface CardIdParamReq extends Request {
  params: IdParams;
}

export interface CardIdBodyReq extends Request {
  body: {
    cardId: number;
  };
}

export interface ActivateCardReq extends CardIdParamReq {
  body: {
    cvc: string;
    password: string;
  };
}

export interface PasswordBodyReq extends CardIdParamReq {
  body: {
    password: string;
  };
}

export interface RechargeCardReq extends CardIdParamReq {
  body: {
    amount: number;
  };
}

export interface ValidCardRes extends Response {
  locals: {
    card: Card;
  };
}

export interface VirtualCardReq extends Request {
  body: {
    cardId: number;
    password: string;
  };
}
