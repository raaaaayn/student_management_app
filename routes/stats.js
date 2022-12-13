const get_stats = require("../lib/get_stats");

const stats = (fastify, opts, next) => {
  fastify.get("/", opts, async (request, reply) => {
    const stats = await get_stats();
    return JSON.stringify(stats, null, 2);
  });
  next();
};

module.exports = stats;
