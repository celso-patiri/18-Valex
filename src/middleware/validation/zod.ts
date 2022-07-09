import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export default function validateBodySchema(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
}
