import { group, sleep } from "k6";
import {
  accountLookup,
  bankTransferFn,
  confirmPayment,
  fetchUserDetail,
  fetchTransactionDetail,
  invoiceNotification,
  generateInvoice,
} from "../../services/transactionService.js";

import { loadMondy } from "../../services/userService.js";

export function bankTransfer({ token, login_pin, user_id }) {
  group("🔐 Bank Transfer Flow", () => {
    group("🔍 User detail and Account Lookup", () => {
      accountLookup(token);
      fetchUserDetail(user_id, token);
    });

    group("💰 Load Money to Wallet", () => {
      loadMondy(token, "ETB", 5000);
      const resut = fetchUserDetail(user_id, token);
      console.log("after load", resut.etbBalance, resut.usdBalance);
    });

    group("💸 Bank Transfer", () => {
      const result = bankTransferFn(token);
      confirmPayment(token, result.transactionType, result.billRefNo, login_pin, null);
      fetchTransactionDetail(result.id, token);
      invoiceNotification(result.billRefNo, token);
      generateInvoice(result.billRefNo, token);
    });

    sleep(1);
  });
}
