// Require the framework and instantiate it
const fastify = require("fastify");
const sql = require("./db");

const search = require("./routes/search");
const usn = require("./routes/usn");
const stats = require("./routes/stats");

const build_app = (opts = {}) => {
  const app = fastify(opts);
  app.register(search, { prefix: "/search" });
  app.register(usn, { prefix: "/usn" });
  app.register(stats, { prefix: "/stats" });
  return app;
};

module.exports = build_app;
