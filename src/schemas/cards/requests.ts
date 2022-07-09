import { z } from "zod";
import { cardTypes } from ".";

export const createCardSchema = z.object({
  employeeId: z.number(),
  type: z.nativeEnum(cardTypes),
});
