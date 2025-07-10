import {
  walletToWalletTransfer,
  confirmPayment,
  fetchTransactionDetail,
  invoiceNotification,
  generateInvoice,
} from "../../services/transactionService.js";
import { memberLookup, loadMondy } from "../../services/userService.js";
import { group, sleep } from "k6";
export function walletTransfer({ token, login_pin }) {
  const email = "roberaensermu@gmail.com";

  group("🔐 Wallet to Wallet Transfer Flow", () => {
    group("🔍 Member Lookup", () => {
      memberLookup(token, { email });
    });

    group("💰 Load Money to Wallet", () => {
      loadMondy(token, "USD", 5000);
    });

    group("💸 Wallet Transfer", () => {
      const result = walletToWalletTransfer(token, email, 70, "USD");
      confirmPayment(token, result.transactionType, result.billRefNo, login_pin, null);
      fetchTransactionDetail(result.id, token);
      invoiceNotification(result.billRefNo, token);
      generateInvoice(result.billRefNo, token);
    });

    sleep(1);
  });
}
