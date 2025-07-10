import { getFakeName } from "../helpers/faker.js";
import { getRandomAccountAndBank,getRandomGuestAccountAndBank } from "../helpers/utils.js";

export function bankTransferPayload() {
  const { firstName, middleName, lastName } = getFakeName();
  const { accountNumber, bankCode, bankName } = getRandomAccountAndBank();

  return {
    beneficiaryAccountNo: accountNumber,
    beneficiaryName: `${firstName} ${middleName}`, // full name if needed
    amount: 4,
    currency: "ETB",
    bankName: bankName,
    bankCode: bankCode,
    transactionType: "bank_transfer",
    senderName: `${lastName}`, // or just lastName if that's the intention
  };
}

export function guestBankTransferPayload() {
  const { firstName, middleName, lastName } = getFakeName();
  const { accountNumber, bankCode, bankName } = getRandomGuestAccountAndBank();

  return {
    beneficiaryAccountNo: accountNumber,
    beneficiaryName: `${firstName} ${middleName}`, // full name if needed
    amount: 4,
    currency: "ETB",
    bankName: bankName,
    bankCode: bankCode,
    transactionType: "bank_transfer",
    senderName: `${lastName}`, // or just lastName if that's the intention
  };
}
