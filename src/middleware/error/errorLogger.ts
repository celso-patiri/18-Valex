import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../common/exceptions/http-exceptions";

export default function errorLogger(
  error: HttpException,
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  console.error({
    name: error.name,
    statusCode: error.statusCode,
    response: error.response,
    stack: error.stack,
  });

  next(error);
}
