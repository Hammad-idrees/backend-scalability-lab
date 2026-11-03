// Starts one PM2 app with round-robin load balancing:  node scripts/pm2-start.mjs lab-cluster
//
// Why: Node cluster hands out connections in turn (round-robin) on Linux, but on Windows
// it lets the OS pick, and the OS keeps picking the same few workers.
// The setting must be on the PM2 daemon (the master that owns the port), not on the app,
// so we restart the daemon with it.
import { execSync } from "node:child_process";

const app = process.argv[2] ?? "lab-cluster";
const env = { ...process.env, NODE_CLUSTER_SCHED_POLICY: "rr" };
const run = (cmd) => execSync(cmd, { stdio: "inherit", env });

run("pm2 kill");
run(`pm2 start ecosystem.config.cjs --only ${app}`);
