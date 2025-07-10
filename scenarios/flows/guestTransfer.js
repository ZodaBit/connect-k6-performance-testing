import { guestAccountLookUp, guestBankTransfer } from "../../services/transactionService.js";
import { group, sleep } from "k6";
export function guestTransfer() {
  group("🔐 Guest Bank Transfer Flow", () => {
    group("🔍 User detail and Account Lookup", () => {
      guestAccountLookUp();
      //fetchUserDetail(user_id, token);
    });
    group("💸 Guest Bank Transfer", () => {
      const result = guestBankTransfer();
      //confirmPayment(token, result.transactionType, result.billRefNo, login_pin, null);
      //fetchTransactionDetail(result.id, token);
      // invoiceNotification(result.billRefNo, token);
      // generateInvoice(result.billRefNo, token);
    });

    sleep(1);
  });
}
