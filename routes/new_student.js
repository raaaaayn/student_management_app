const sql = require("../db");
const verify_jwt = require("../utils/verify_jwt");

const new_student = (fastify, opts, next) => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        name: { type: "string" },
        usn: { type: "string" },
        department: { type: "string" }, // TODO: make type an enum containing department codes
        sem: { type: "integer" },
        phone: { type: "string" },
      },
    },
    preParsing: verify_jwt,
    handler: async (req, res) => {
      const { name, usn, department, sem, phone } = req.body;
      const sem_id =
        await sql`select id from semester where department=UPPER(${department}) and sem=${sem}`;
      if (sem_id.length > 0) {
        const current_sem_id = sem_id[0].id;
        await sql`insert into student 
							(usn,name,department,current_sem_id,phone)
							values(
								UPPER(${usn}),${name},UPPER(${department}),${current_sem_id},${phone}
							) 
							on conflict (usn) do update
							set name=${name}, department=UPPER(${department}),
							current_sem_id=${current_sem_id}, phone=${phone}`;
        res.send(200);
      }
      res.send(404);
    },
  });
  next();
};

module.exports = new_student;
