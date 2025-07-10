import { createUser, verifyUser, setOrResetPin, login, loadMondy } from "../services/userService.js";
import { bankTransferFn, confirmPayment } from "../services/transactionService.js";

function createAndLoginUser() {
  let { token, otp } = createUser();
  ({ token } = verifyUser(token, otp));
  const { device_uuid, login_pin } = setOrResetPin(token);
  const loginResult = login(token, device_uuid, login_pin);
  return { token: loginResult.token, device_uuid, login_pin, user_id: loginResult.id };
}

export function setup() {
  const flow = __ENV.K6_FLOW;

  if (flow === "userLogin") {
    return {};
  }

  const user = createAndLoginUser();
  //this if we want to make the get list  of transaction to pass dymanic data listTransaction.js  basically sender name and transaction id
  if (flow === "listTransaction") {
    loadMondy(user.token, "ETB", 5000);
    const result = bankTransferFn(user.token);
    confirmPayment(user.token, result.transactionType, result.billRefNo, user.login_pin, null);
    return {
      ...user,
      transactionType: result.transactionType,
      senderName: result.senderName,
      transaction_id: result.id,
    };
  }

  return user;
}
