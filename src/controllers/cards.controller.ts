import { Request, Response } from "express";

const createCard = (req: Request, res: Response) => {
  res.sendStatus(203);
};

export default {
  createCard,
};
