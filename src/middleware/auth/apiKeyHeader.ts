import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../../exceptions/http-exceptions";
import companiesService from "../../services/companies.service";

export default async function validadeApiKeyHeader(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) throw new UnauthorizedException("API key is required");

  const company = await companiesService.findByApiKey(apiKey);
  if (!company) throw new UnauthorizedException("Invalid API key");

  next();
}
