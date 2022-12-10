const CONNECTION_STRING = process.env.POSTGRES;
const PORT = process.env.PORT;

if (!CONNECTION_STRING) throw ('POSTGRES env variable not set')

module.exports = { CONNECTION_STRING, PORT };
