// GET /health -> "I'm alive". Load balancers call this to check a server is up.
import type { FastifyPluginAsync } from "fastify";

const healthRouter: FastifyPluginAsync = async (app) => {
  app.get("/", async (req) => ({
    status: "ok",
    port: Number(process.env.PORT) || 3000, // which server answered (3000, 3001, 3002)
    pid: process.pid, // which process answered (useful once PM2 runs many copies)
    uptimeSec: Math.round(process.uptime()),
    clientIp: req.ip, // the user's IP (real one behind Nginx, thanks to trustProxy)
    forwardedFor: req.headers["x-forwarded-for"] ?? null, // what Nginx sent
  }));
};

export default healthRouter;
