const get_student_details_by_usn = require("../lib/get_student_details_by_usn");

const usn = (fastify, opts, next) => {
  fastify.get("/", async (request, reply) => {
    const usn = request.query.usn;
    if (usn) {
      const res = await get_student_details_by_usn(usn);
      return JSON.stringify(res, null, 2);
    }
    return "no usn provided";
  });
  next();
};

module.exports = usn;
