// Kills this process on purpose, like an unhandled bug in production.
// We answer first, then throw an error nobody catches -> the process dies.
// Without PM2 the server is now down. With PM2 a new copy starts by itself.
import type { FastifyReply } from "fastify";

export const run = async (_req: unknown, reply: FastifyReply) => {
  await reply.send({ pid: process.pid, message: "This process will crash now" });
  setTimeout(() => {
    throw new Error(`Crash on purpose (pid ${process.pid})`);
  }, 50);
};
