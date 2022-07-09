import { z } from "zod";
import { TransactionTypesEnum } from ".";

export const createCardSchema = z.object({
  employeeId: z.number(),
  type: z.nativeEnum(TransactionTypesEnum),
});
