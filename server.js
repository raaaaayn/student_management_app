const { PORT } = require("./config");
const build_app = require("./app");

const app = build_app({ logger: true });

app.listen(PORT || 3001, "0.0.0.0", (err, address) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});
