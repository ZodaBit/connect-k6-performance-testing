import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
export function handleSummary(data) {
  console.log(`\n==== 📊 Summary Report ====`);

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:\-]/g, "").replace(/\..+/, "");
  const filename = `target/performance-report/summary-report-${timestamp}.html`;
  return {
    stdout: textSummary(data, { indent: "  ", enableColors: true }), // <-- ✅ default k6 metrics to terminal
    [filename]: htmlReport(data),
  };
}
