import { group, sleep } from "k6";
import {
  fetchUserDetail,
  changeToBirr,
  confirmPayment,
  fetchTransactionDetail,
  invoiceNotification,
  generateInvoice,
} from "../../services/transactionService.js";
import { loadMondy } from "../../services/userService.js";

export function currencyConversion({ token, login_pin, user_id }) {
  group("🔐 Convert USD to ETB Flow", () => {
    group("🔍 User Info ", () => {
      //accountLookup(token);
      fetchUserDetail(user_id, token);
    });

    group("💰 Load USD to Wallet", () => {
      loadMondy(token, "USD", 5000);
      const balances = fetchUserDetail(user_id, token);
      console.log("📊 After loading USD:", {
        ETB: balances.etbBalance,
        USD: balances.usdBalance,
      });
    });

    group("💸 Currency Conversion: USD ➡️ ETB", () => {
      const conversion = changeToBirr(token, 5, "USD");
      confirmPayment(token, conversion.transactionType, conversion.billRefNo, login_pin, null);
      fetchTransactionDetail(conversion.id, token);
      invoiceNotification(conversion.billRefNo, token);
      generateInvoice(conversion.billRefNo, token);
    });

    sleep(1); // Simulate think time
  });
}
