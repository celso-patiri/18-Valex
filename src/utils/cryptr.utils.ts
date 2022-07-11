import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET + "");

export default cryptr;
