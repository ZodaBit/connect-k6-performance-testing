//defined pair  bank account pairs
const accountBankPairs = [
  //{accountNumber: "01320768688701",bankCode: "231404",bankName: "Awash Bank"},
  {accountNumber: "1000001003",bankCode:"231432",bankName:"TSEHAY BANK"}
];

const guestAccountPairs = [
  {accountNumber: "01320768688701",bankCode: "231404",bankName: "Awash Bank"}
];

export function generateCustomId() {
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
  const randomString = "samusug";
  const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
  return {
    id: `${uuid}-${randomString}-${randomNum}`,
    code: randomNum,
  };
}

export function getRandomGender() {
  return Math.random() > 0.5 ? "male" : "female";
}
export function generateRandomPhoneNumber() {
  return `091${Math.floor(Math.random() * 9000000 + 1000000)}`;
}

export function getRandomAccountAndBank(){
  const index=Math.floor(Math.random()*accountBankPairs.length);
  return accountBankPairs[index];
}

export function getRandomGuestAccountAndBank(){
  const index=Math.floor(Math.random()*guestAccountPairs.length);
  return guestAccountPairs[index];
}