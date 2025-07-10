export function getTestOptions(testType = "smoke") {
  const thresholds = {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  };

  switch (testType) {
    case "smoke":
      return {
        thresholds,
        vus: 1,
        iterations: 1,
      };
    case "load":
      return {
        thresholds,
        stages: [
          { duration: "1m", target: 10 },
          // { duration: "5m", target: 100 },
          // { duration: "5m", target: 200 },
          // { duration: "5m", target: 6000 },
          // { duration: "5m", target: 9000 },
          // { duration: "5m", target: 11000 },
          // { duration: "20m", target: 11000 },
          // { duration: "5m", target: 0 },
        ],
      };
    case "soak":
      return {
        thresholds,
        stages: [
          { duration: "10m", target: 20000 },
          { duration: "4h", target: 20000 },
          { duration: "10m", target: 0 },
        ],
      };

    case "stress":
      return {
        thresholds,
        stages: [
          { duration: "5m", target: 1000 },
          { duration: "5m", target: 3000 },
          { duration: "5m", target: 5000 },
          { duration: "5m", target: 7000 },
          { duration: "5m", target: 10000 },
          { duration: "5m", target: 0 },
        ],
      };

    case "spike":
      return {
        thresholds,
        stages: [
          { duration: "2m", target: 1000 },
          { duration: "10s", target: 10000 },
          { duration: "5m", target: 10000 },
          { duration: "10s", target: 1000 },
          { duration: "3m", target: 0 },
        ],
      };

    case "parallelTransactionTest": // for parallel flow scenarios
      return {
        thresholds,
        scenarios: {
          bank_transfer: {
            exec: "bankTransfer",
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
              { duration: "5s", target: 5 },
              { duration: "10s", target: 10 },
              { duration: "5s", target: 0 },
            ],
          },
          wallet_transfer: {
            exec: "walletTransfer",
            executor: "constant-vus",
            vus: 5,
            duration: "30s",
          },
          currency_conversion: {
            exec: "currencyConversion",
            executor: "per-vu-iterations",
            vus: 2,
            iterations: 3,
          },
          guest_transfer: {
            exec: "guestTransfer",
            executor: "shared-iterations",
            vus: 3,
            iterations: 6,
          },
        },
      };

    default:
      throw new Error(`❌ Unknown test type: ${testType}`);
  }
}
