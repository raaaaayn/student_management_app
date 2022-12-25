const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sql = require("../db");
const { JWT_SECRET } = require("../config");

const saltRounds = 10;

const register = (fastify, opts, next) => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        usn: { type: "string" },
        password: { type: "string" },
      },
    },
    handler: async (req, res) => {
      const { usn, password } = req.body;
      const hash = await bcrypt.hash(password, saltRounds);
      console.log({ hash });
      // TODO: even users that are not in student or faculty table can register themselves, fix that by adding foreign key constraints and multiple fields to reference either student or faculty
      await sql`
				insert into password_hashes
					("user", hash)
				values
					(UPPER(${usn}), ${hash})
			`;
      jwt.sign({ user: usn }, JWT_SECRET, function (err, token) {
        res.send({ token });
        if (err) {
          res.send(500);
        }
      });
    },
  });
  next();
};

const login = (fastify, opts, next) => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        usn: { type: "string" },
        password: { type: "string" },
      },
    },
    handler: async (req, reply) => {
      const { usn, password } = req.body;
      const stored_hash =
        await sql`select hash from password_hashes where "user"=UPPER(${usn})`;
      if (stored_hash.length > 0) {
        const result = await bcrypt.compare(password, stored_hash[0].hash);
        if (result) {
          jwt.sign(
            {
              user: usn,
            },
            JWT_SECRET,
            { expiresIn: 60 },
            function (err, token) {
              if (err) {
                console.error({ err });
                reply.send(500);
              }
              reply.send({ token });
            },
          );
        } else {
          reply.send(401);
        }
      } else {
        reply.send(404);
      }
      return reply;
    },
  });
  next();
};

module.exports = { register, login };
