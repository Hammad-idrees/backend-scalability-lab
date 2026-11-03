// STRESS TEST: "Where does it break?"
// Keeps adding users in steps. Watch where p95 jumps or errors start.
// The thresholds are expected to FAIL at some point. That point is the answer.
//
//   k6 run k6/stress.js
//   k6 run -e ENDPOINT=/heavy?ms=50 k6/stress.js
import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const ENDPOINT = __ENV.ENDPOINT || "/products";

export const options = {
  stages: [
    { duration: "15s", target: 50 },
    { duration: "15s", target: 100 },
    { duration: "15s", target: 200 },
    { duration: "15s", target: 400 },
    { duration: "15s", target: 800 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
  summaryTrendStats: ["avg", "med", "p(95)", "p(99)", "max"],
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINT}`, { timeout: "10s" });
  check(res, { "status is 200": (r) => r.status === 200 });
}
