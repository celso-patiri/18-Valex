import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../exceptions/http-exceptions";

interface DynamicLog {
  [key: string]: any;
}

export default function errorLogger(
  error: HttpException,
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  const errorLog: DynamicLog = { name: error.name };

  if (error.message) errorLog.message = error.message;
  if (error.statusCode) errorLog.statusCode = error.statusCode;
  if (error.response) errorLog.response = error.response;
  if (error.stack) errorLog.stack = error.stack;

  console.error(errorLog);

  next(error);
}
