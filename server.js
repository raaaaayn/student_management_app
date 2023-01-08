const { PORT } = require("./config");
const build_app = require("./app");

const app = build_app({ logger: true });

app.listen({ port: PORT || 3001, host: "0.0.0.0" }).catch((err) => {
  console.log(err);
  process.exit(1);
});
