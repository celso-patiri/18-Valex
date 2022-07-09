import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UnprocessableEntityException } from "../../common/exceptions/http-exceptions";

export default function validateBodySchema(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
    next();
  };
}
