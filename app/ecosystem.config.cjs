// PM2 config. Start one app with:
//   pm2 start ecosystem.config.cjs --only lab-fork
//   pm2 start ecosystem.config.cjs --only lab-cluster
// Run `pnpm build` first: PM2 runs the compiled dist/server.js.

// Settings both apps share
const common = {
  script: "dist/server.js",
  env: { NODE_ENV: "production", PORT: 3000 },

  autorestart: true, // crashed? start it again
  max_restarts: 10, // ...but give up after 10 crashes in a row (a real bug, not bad luck)
  min_uptime: "5s", // a copy must live 5s to count as "started OK"
  exp_backoff_restart_delay: 100, // wait 100ms, 150ms, 225ms... between restarts, so a crash loop doesn't eat the CPU
  max_memory_restart: "300M", // a copy using more RAM than this gets restarted (memory leak safety net)

  out_file: "logs/out.log", // console.log goes here
  error_file: "logs/error.log", // errors and crashes go here
  merge_logs: true, // one file for all copies, not one per copy
  log_date_format: "YYYY-MM-DD HH:mm:ss",
};

module.exports = {
  apps: [
    {
      ...common,
      name: "lab-fork",
      exec_mode: "fork", // 1 copy, same as `node dist/server.js` but babysat by PM2
      instances: 1,
    },
    {
      ...common,
      name: "lab-cluster",
      exec_mode: "cluster", // many copies sharing ONE port; PM2 hands requests out in turn
      instances: "max", // one copy per CPU core (8 on this PC)
    },
  ],
};
