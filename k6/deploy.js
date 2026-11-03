// DEPLOY TEST: "Do users see errors while we deploy?"
// Steady traffic for 30 seconds. While it runs, in another terminal, do:
//   pm2 restart lab-cluster    (all workers at once)
//   pm2 reload lab-cluster     (one worker at a time)
// Then compare failed requests and max latency.
//
//   k6 run k6/deploy.js
import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const ENDPOINT = __ENV.ENDPOINT || "/health";

export const options = {
  vus: 20,
  duration: "30s",
  summaryTrendStats: ["avg", "med", "p(95)", "p(99)", "max"],
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINT}`, { timeout: "5s" });
  check(res, { "status is 200": (r) => r.status === 200 });
}
