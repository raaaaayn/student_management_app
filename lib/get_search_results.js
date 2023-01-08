const sql = require("../db");

const get_search_results = async (search_string, limit) => {
  if (!limit) limit = 10;
  const res =
    await sql`SELECT usn,name,department,phone FROM student WHERE lower(usn) like lower(${
      "%" + search_string + "%"
    }) OR lower(name) like lower(${"%" + search_string + "%"}) OR phone like ${
      "%" + search_string + "%"
    } ORDER BY usn LIMIT ${limit} `;
  return res;
};
module.exports = get_search_results;
