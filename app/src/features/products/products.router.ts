// URL -> controller. GET /products?page=1&limit=20
import type { FastifyPluginAsync } from "fastify";
import * as controller from "./products.controller.js";

const productsRouter: FastifyPluginAsync = async (app) => {
  app.get("/", controller.list);
};

export default productsRouter;
