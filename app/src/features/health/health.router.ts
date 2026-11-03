// GET /health -> "I'm alive". Load balancers call this to check a server is up.
import type { FastifyPluginAsync } from "fastify";

const healthRouter: FastifyPluginAsync = async (app) => {
  app.get("/", async () => ({
    status: "ok",
    pid: process.pid, // which process answered (useful once PM2 runs many copies)
    uptimeSec: Math.round(process.uptime()),
  }));
};

export default healthRouter;
