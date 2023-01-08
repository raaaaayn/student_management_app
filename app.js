// Require the framework and instantiate it
const fastify = require("fastify");

const search = require("./routes/search");
const usn = require("./routes/usn");
const stats = require("./routes/stats");
const new_student = require("./routes/new_student");
const { register, login } = require("./routes/auth");

const build_app = (opts = {}) => {
  const app = fastify(opts);
  app.register(login, { prefix: "/login" });
  app.register(register, { prefix: "/register" });
  app.register(search, { prefix: "/search" });
  app.register(stats, { prefix: "/stats" });
  app.register(usn, { prefix: "/student" });
  app.register(new_student, { prefix: "/student/new" });
  return app;
};

module.exports = build_app;
