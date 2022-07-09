import { z } from "zod";
import { TransactionTypes } from ".";

export const createCardSchema = z.object({
  employeeId: z.number(),
  type: z.nativeEnum(TransactionTypes),
});
