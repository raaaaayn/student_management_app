const get_student_details_by_usn = require("../lib/get_student_details_by_usn");
const { get_student_results_all } = require("../lib/get_student_results");

const usn = (fastify, opts, next) => {
  fastify.get("/:usn", async (request, reply) => {
    const { usn } = request.params;
    if (usn) {
      const res = await get_student_details_by_usn(usn);
      return JSON.stringify(res, null, 2);
    }
    return "no usn provided";
  });

  fastify.get("/:usn/results", async (request, reply) => {
    const { usn } = request.params;
    if (usn) {
      const res = await get_student_results_all(usn);
      return JSON.stringify(res, null, 2);
    }
    return "no usn provided";
  });

  next();
};

module.exports = usn;
