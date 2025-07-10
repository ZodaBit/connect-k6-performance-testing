export { bankTransfer } from "./flows/bankTransfer.js";
export { walletTransfer } from "./flows/walletTransfer.js";
export { currencyConversion } from "./flows/currencyConversion.js";
export { guestTransfer } from "./flows/guestTransfer.js";
export { userLogin } from "./flows/userLogin.js";
export { listTransaction } from "./flows/listTransaction.js";

// import { group, sleep } from "k6";
// import {
//   accountLookup,
//   bankTransfer,
//   confirmPayment,
//   fetchTransactionDetail,
//   invoiceNotification,
//   generateInvoice,
//   walletToWalletTransfer,
//   fetchUserDetail,
//   changeToBirr,
//   guestAccountLookUp,
//   guestBankTransfer,
// } from "../services/transactionService.js";

// import { createUser, verifyUser, setOrResetPin, login, loadMondy, memberLookup } from "../services/userService.js";

// export function setup() {
//   let { token, otp } = createUser();
//   ({ token } = verifyUser(token, otp));
//   let pinSetup = setOrResetPin(token);
//   const { device_uuid, login_pin } = pinSetup;
//   const loginRes = login(token, device_uuid, login_pin);
//   return {
//     token: loginRes.token,
//     device_uuid,
//     login_pin,
//     user_id: loginRes.id,
//   };
// }

// function runBankTransferFlow({ token, login_pin, user_id }) {
//   group("🔐 Bank Transfer Flow", () => {
//     group("🔍 User detail and Account Lookup", () => {
//       accountLookup(token);
//       fetchUserDetail(user_id, token);
//     });

//     group("💰 Load Money to Wallet", () => {
//       loadMondy(token, "ETB", 5000);
//       const resut = fetchUserDetail(user_id, token);
//       console.log("after load", resut.etbBalance, resut.usdBalance);
//     });

//     group("💸 Bank Transfer", () => {
//       const result = bankTransfer(token);
//       confirmPayment(token, result.transactionType, result.billRefNo, login_pin, null);
//       fetchTransactionDetail(result.id, token);
//       invoiceNotification(result.billRefNo, token);
//       generateInvoice(result.billRefNo, token);
//     });

//     sleep(1);
//   });
// }

// function runWalletTransferFlow({ token, login_pin }) {
//   const email = "roberaensermu@gmail.com";

//   group("🔐 Wallet to Wallet Transfer Flow", () => {
//     group("🔍 Member Lookup", () => {
//       memberLookup(token, { email });
//     });

//     group("💰 Load Money to Wallet", () => {
//       loadMondy(token, "USD", 5000);
//     });

//     group("💸 Wallet Transfer", () => {
//       const result = walletToWalletTransfer(token, email, 70, "USD");
//       confirmPayment(token, result.transactionType, result.billRefNo, login_pin, null);
//       fetchTransactionDetail(result.id, token);
//       invoiceNotification(result.billRefNo, token);
//       generateInvoice(result.billRefNo, token);
//     });

//     sleep(1);
//   });
// }

// function runCurrencyConversionToETB({ token, login_pin, user_id }) {
//   group("🔐 Convert USD to ETB Flow", () => {
//     group("🔍 User Info ", () => {
//       //accountLookup(token);
//       fetchUserDetail(user_id, token);
//     });

//     group("💰 Load USD to Wallet", () => {
//       loadMondy(token, "USD", 5000);
//       const balances = fetchUserDetail(user_id, token);
//       console.log("📊 After loading USD:", {
//         ETB: balances.etbBalance,
//         USD: balances.usdBalance,
//       });
//     });

//     group("💸 Currency Conversion: USD ➡️ ETB", () => {
//       const conversion = changeToBirr(token, 5, "USD");
//       confirmPayment(token, conversion.transactionType, conversion.billRefNo, login_pin, null);
//       fetchTransactionDetail(conversion.id, token);
//       invoiceNotification(conversion.billRefNo, token);
//       generateInvoice(conversion.billRefNo, token);
//     });

//     sleep(1); // Simulate think time
//   });
// }

// function runGuestBankTransferFlow() {
//   group("🔐 Guest Bank Transfer Flow", () => {
//     group("🔍 User detail and Account Lookup", () => {
//       guestAccountLookUp();
//       //fetchUserDetail(user_id, token);
//     });
//     group("💸 Guest Bank Transfer", () => {
//       const result = guestBankTransfer();
//       //confirmPayment(token, result.transactionType, result.billRefNo, login_pin, null);
//       //fetchTransactionDetail(result.id, token);
//       // invoiceNotification(result.billRefNo, token);
//       // generateInvoice(result.billRefNo, token);
//     });

//     sleep(1);
//   });
// }

// export default function (data) {
//   const { token, device_uuid, login_pin, user_id } = data;
//   runBankTransferFlow({ token, login_pin, user_id });
//   runWalletTransferFlow({ token, login_pin });
//   runCurrencyConversionToETB({ token, login_pin, user_id });
//   runGuestBankTransferFlow();
// }
