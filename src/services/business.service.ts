import { ForbiddenException, NotFoundException } from "../common/exceptions/http-exceptions";
import * as businessRepository from "../repositories/businessRepository";
import { TransactionTypes } from "../schemas/cards/types";

const validateBusinessTransactionType = async (businessId: number, type: TransactionTypes) => {
  const business = await businessRepository.findById(businessId);

  if (!business) throw new NotFoundException("Business not registered");

  if (type !== business.type)
    throw new ForbiddenException("Business does not accept transaction type");
};

export default {
  validateBusinessTransactionType,
};
