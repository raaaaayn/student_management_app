const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const verify_jwt = async (request, reply, payload) => {
  const token = request.headers.authorization;
  if (!token) {
    reply.code(400).send("Auth token missing");
    return reply;
  }
  jwt.verify(token, JWT_SECRET, async (err, res) => {
    if (err) {
      await reply.code(401).send("Token expired, please obtain a new token");
      return;
    }
    console.log({ res });
  });
  return payload;
};

module.exports = verify_jwt;
