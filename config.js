const CONNECTION_STRING = process.env.POSTGRES;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

if (!CONNECTION_STRING) throw "POSTGRES env variable not set";
if (!JWT_SECRET) throw "JWT_SECRET not set";

module.exports = { CONNECTION_STRING, PORT, JWT_SECRET };
