import { Request, Response } from "express";
import { z } from "zod";
import { Card, TransactionTypes, TransactionTypesEnum } from "./types";

export const createCardSchema = z.object({
  employeeId: z.number(),
  type: z.nativeEnum(TransactionTypesEnum),
});

export const activateCardSchema = z.object({
  cvc: z.number(),
  password: z.string().min(4),
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

export interface ActivateCardRequest extends CardIdRequest {
  body: {
    cvc: string;
    password: string;
  };
}

export interface ValidCardRes extends Response {
  locals: {
    card: Card;
  };
}
