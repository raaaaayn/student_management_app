const get_stats = require("../lib/get_stats");
const verify_jwt = require("../utils/verify_jwt");

const stats = (fastify, opts, next) => {
  opts = { ...opts, preParsing: verify_jwt };
  fastify.get("/", opts, async (request, reply) => {
    const stats = await get_stats();
    return JSON.stringify(stats, null, 2);
  });
  next();
};

module.exports = stats;
