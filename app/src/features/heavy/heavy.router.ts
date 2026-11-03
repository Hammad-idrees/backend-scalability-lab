// GET /heavy?ms=200 -> keeps the CPU busy for ~200ms (max 5000)
import type { FastifyPluginAsync } from "fastify";
import * as controller from "./heavy.controller.js";

const heavyRouter: FastifyPluginAsync = async (app) => {
  app.get("/", controller.run);
};

export default heavyRouter;
