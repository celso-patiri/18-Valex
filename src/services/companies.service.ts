import * as companiesRepository from "../repositories/companyRepository";

const findByApiKey = async (apiKey: string) =>
  await companiesRepository.findByApiKey(apiKey);

export default {
  findByApiKey,
};
