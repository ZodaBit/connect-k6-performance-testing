// services/transactionService.js
import { check } from "k6";
import { getRandomAccountAndBank, getRandomGuestAccountAndBank } from "../helpers/utils.js";
import { bankTransferPayload, guestBankTransferPayload } from "../payloads/transferOtherBank.js";
import { getRequest, postRequest, getRequestParams, safeParse, getRequestInvoice } from "../helpers/httpApiUtils.js";

// 🔍 Account and Lookup
export function accountLookup(token) {
  const { accountNumber, bankCode } = getRandomAccountAndBank();
  const res = postRequest("/member-transactions/otherbank/account-enquiry", { accountNumber, bankCode }, token);
  const body = safeParse(res.body);
  check(res, {
    "✅ Account lookup succeeded": (r) => [200, 201].includes(r.status),
  });
}

// 💸 Bank Transfer
export function bankTransferFn(token) {
  const payload = bankTransferPayload();
  const res = postRequest("/member-transactions/otherbank/transfer-to-bank", payload, token);
  const body = safeParse(res.body);
  const data = body?.data || {};
  const success = body?.message === "Transaction created successfully.";
  check(res, {
    "✅ Bank transfer succeeded": (r) => [200, 201].includes(r.status),
    [`✅ Bank transfer result: ${success ? "✅ SUCCESS" : "❌ FAIL"}`]: () => success,
  });
  return data;
}

// 🔐 OTP & Payment
export function confirmPayment(token, transactionType, billRefNo, PIN) {
  const payload = { transactionType, billRefNo, PIN };
  const res = postRequest("/member-transactions/confirm-payment", payload, token);
  check(res, {
    "✅ Payment confirmed": (r) => [200, 201].includes(r.status),
  });
}

export function resendOtp(token, billRefNo) {
  const res = postRequest("/member-transactions/transfer/resend-otp", { billRefNo, otpFor: "bank_transfer" }, token);
  check(res, {
    "✅ Resend OTP succeeded": (r) => [200, 201].includes(r.status),
  });
}

export function verifyOtp(token, billRefNo, otpCode) {
  const payload = { billRefNo, otpFor: "bank_transfer", otpCode };
  const res = postRequest("/member-transactions/transfer/verify-otp", payload, token);
  check(res, {
    "✅ OTP verify succeeded": (r) => [200, 201].includes(r.status),
  });
}

// 🧾 Invoice & Notification
export function generateInvoice(billRefId, token) {
  const res = getRequestInvoice(billRefId, "invoices", token);
  const body = safeParse(res.body);
  check(res, {
    "✅ Invoice generated": (r) => [200, 201].includes(r.status),
    "✅ Valid PDF link": () => body?.invoiceURL?.endsWith(".pdf"),
  });
}

export function invoiceNotification(billRefId, token) {
  const res = getRequestInvoice(billRefId, "invoices/notification", token);
  const headers = res.headers;
  check(res, {
    "✅ Status is 200": (r) => r.status === 200,
    "✅ Content-Type is PDF": () => headers["Content-Type"].includes("application/pdf"),
    "✅ PDF is not empty": () => parseInt(headers["Content-Length"] || "0") > 0,
  });
}

// 🔄 Wallet
export function loadToWallet(token, amount) {
  const res = postRequest("/member-transactions/wallet/load-to-wallet", { amount }, token);
  const body = safeParse(res.body);
  const data = body?.data || {};
  check(res, {
    "✅ Load to wallet succeeded": (r) => [200, 201].includes(r.status),
    "✅ Correct amount loaded": () => data?.billAmount === amount,
  });
}

export function walletToWalletTransfer(token, email, amount, currency) {
  const payload = { beneficiaryEmail: email, amount, currency, transactionType: "wallet_transfer" };
  const res = postRequest("/member-transactions/wallet/wallet-to-wallet-transfer", payload, token);
  const body = safeParse(res.body);
  const data = body?.data || {};
  check(res, {
    "✅ Wallet transfer succeeded": (r) => [200, 201].includes(r.status),
    "✅ Correct amount": () => data?.billAmount === amount,
  });
  return data;
}

// 🔎 Transaction
export function fetchTransactionDetail(id, token) {
  const res = getRequest(id, "member-transactions", token);
  const body = safeParse(res.body);
  const data = body?.data || {};
  check(res, {
    "✅ Transaction fetched": (r) => [200, 201].includes(r.status),
    "✅ ID matches": () => data?.id === id,
  });
  return data;
}

export function fetchTransactionPaginate(params, token) {
  const res = getRequestParams(params, token);
  const body = safeParse(res.body);
  check(res, {
    "✅ Transactions list fetched": (r) => [200, 201].includes(r.status),
    "✅ Non-empty list": () => Array.isArray(body?.data?.docs) && body.data.docs.length > 0,
  });
}

// 👤 User
export function fetchUserDetail(userId, token) {
  const res = getRequest(userId, "members", token);
  const body = safeParse(res.body);
  const wallets = body?.wallets || [];
  check(res, {
    "✅ User detail fetched": (r) => [200, 201].includes(r.status),
    "✅ ETB wallet exists": () => wallets.some((w) => w.currency === "ETB"),
    "✅ USD wallet exists": () => wallets.some((w) => w.currency === "USD"),
  });
  return {
    etbBalance: wallets.find((w) => w.currency === "ETB")?.balance || 0,
    usdBalance: wallets.find((w) => w.currency === "USD")?.balance || 0,
  };
}

// 💱 Currency
export function changeToBirr(token, amount, currency) {
  const res = postRequest("/member-transactions/wallet/change-to-birr", { amount, currency }, token);
  const body = safeParse(res.body);
  const data = body?.data || {};
  check(res, {
    "✅ Converted to Birr": (r) => [200, 201].includes(r.status),
    [`✅ Conversion output: ${data?.paidAmount}`]: () => !!data?.paidAmount,
  });
  return data;
}

// 👤 Guest
export function guestAccountLookUp() {
  const { accountNumber, bankCode } = getRandomGuestAccountAndBank();
  const res = postRequest("/member-transactions/otherbank/guest-account-enquiry", { accountNumber, bankCode });
  const body = safeParse(res.body);
  check(res, {
    "✅ Guest Account lookup succeeded": (r) => [200, 201].includes(r.status),
  });
}

export function guestBankTransfer() {
  const payload = guestBankTransferPayload();
  const res = postRequest("/member-transactions/otherbank/guest-load-from-card", payload);
  const body = safeParse(res.body);
  const data = body?.data || {};
  check(res, {
    "✅ Guest Bank transfer succeeded": (r) => [200, 201].includes(r.status),
    [`✅ Result: ${body?.message}`]: () => body?.message === "Transaction generated successfully.",
  });
  return data;
}
