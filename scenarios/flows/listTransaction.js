import { group, sleep } from "k6";
import { fetchTransactionPaginate, fetchTransactionDetail } from "../../services/transactionService.js";

export function listTransaction({ token, transactionType, senderName, transaction_id }) {
  group("🔐 Transaction Listing Flow", () => {
    
    group("📄 Fetch Single Transaction Detail", () => {
      fetchTransactionDetail(transaction_id, token);
    });

    group("📄 Fetch Transaction List with Filters", () => {
      const filters = [
        { TransactionType: transactionType },
        { TransactionType: transactionType, senderName },
        { senderName },
      ];

      filters.forEach((params, index) => {
        fetchTransactionPaginate(params, token);
      });
    });

    sleep(1); // Simulate user think time
  });
}
