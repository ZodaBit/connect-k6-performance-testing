// import * as flows from "../scenarios/index.js"; //export all flows from here
// import { getTestOptions } from "../sharedSetup/loadProfiles.js";
// import { setup } from "../sharedSetup/setup.js";
// import { handleSummary } from "../services/reportService.js";

// const testType = __ENV.K6_TEST_TYPE || "smoke";
// const flowName = __ENV.K6_FLOW || "userLogin";
// export const options = getTestOptions(testType);

// export const bankTransfer = flows.bankTransfer;
// export const walletTransfer = flows.walletTransfer;
// export const currencyConversion = flows.currencyConversion;
// export const guestTransfer = flows.guestTransfer;

// export { setup, handleSummary };

// console.log("test types ", testType);
// //Default function for non-scenario tests
// if (testType !== "parallelTransactionTest") {
//   const flow = flows[flowName];
//   if (!flow) {
//     throw new Error(`Unknown flow:"${flowName}". Make sure it's exported in scenarios/index.js`);
//   }


// export default function (data) {
//   return flow(data);
// };
// }

//**********

// K6_TEST_TYPE=smoke K6_FLOW=walletTransfer ./k6 run tests/main.test.js

//Load test for bank transfer
// K6_TEST_TYPE=load K6_FLOW=bankTransfer ./k6 run tests/main.test.js

// Soak test for currency conversion
// K6_TEST_TYPE=soak K6_FLOW=currencyConversion ./k6 run tests/main.test.js

// ***//


import * as flows from "../scenarios/index.js";
import { getTestOptions } from "../sharedSetup/loadProfiles.js";
import { setup } from "../sharedSetup/setup.js";
import { handleSummary } from "../services/reportService.js";

// ENV
const testType = __ENV.K6_TEST_TYPE || "smoke";
const flowName = __ENV.K6_FLOW || "userLogin";

// Export K6 config
export const options = getTestOptions(testType);
export { setup, handleSummary };

// Export exec functions for transaction scenarios
export const bankTransfer = flows.bankTransfer;
export const walletTransfer = flows.walletTransfer;
export const currencyConversion = flows.currencyConversion;
export const guestTransfer = flows.guestTransfer;

let defaultFn=undefined;
// Export default only if not 'transaction'
if (testType !== "transaction") {
  const flow = flows[flowName];
  if (!flow) {
    throw new Error(`Unknown flow "${flowName}"`);
  }

 defaultFn= function (data) {
    return flow(data);
  };
}
export default defaultFn;
