const get_search_results = require("../lib/get_search_results");

const search = (fastify, opts, next) => {
  fastify.get("/", opts, async (request, reply) => {
    const search_string = request.query.q;
    const limit = request.query.limit;
    if (search_string) {
      const startTime = Date.now();
      const res = await get_search_results(search_string, limit);
      console.log(Date.now() - startTime);
      return JSON.stringify(res, null, 2);
    }
    return "no query string";
  });
  next();
};

module.exports = search;
