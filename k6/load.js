// LOAD TEST: "Is it fast under normal, busy traffic?"
// Ramp up to VUS users, hold, ramp down. ~50 seconds.
// No sleep: every user fires the next request as soon as the last one returns,
// so req/s shows the most the server can do with VUS users at once.
//
//   k6 run k6/load.js
//   k6 run -e ENDPOINT=/heavy?ms=50 -e VUS=20 k6/load.js
import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const ENDPOINT = __ENV.ENDPOINT || "/products";
const VUS = Number(__ENV.VUS) || 50;

export const options = {
  stages: [
    { duration: "10s", target: VUS }, // ramp up: 0 -> VUS users
    { duration: "30s", target: VUS }, // hold: VUS users non-stop
    { duration: "10s", target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // less than 1% errors
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
  },
  summaryTrendStats: ["avg", "med", "p(95)", "p(99)", "max"],
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINT}`);
  check(res, { "status is 200": (r) => r.status === 200 });
}
