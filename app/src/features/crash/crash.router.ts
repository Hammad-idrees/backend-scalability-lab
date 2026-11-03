// GET /crash -> answers, then kills its own process (for the PM2 demo)
import type { FastifyPluginAsync } from "fastify";
import * as controller from "./crash.controller.js";

const crashRouter: FastifyPluginAsync = async (app) => {
  app.get("/", controller.run);
};

export default crashRouter;
