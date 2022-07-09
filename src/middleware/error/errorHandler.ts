import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../common/exceptions/http-exceptions";

export default function errorHandler(
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(error.statusCode || 500).send(error);
}
