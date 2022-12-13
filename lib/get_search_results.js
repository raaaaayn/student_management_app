const sql = require("../db");

const get_search_results = async (search_string, limit) => {
  if (!limit) limit = 10;
  const res = await sql`
		select usn,name,department,phone from student where 
			LOWER(usn) like LOWER(${"%" + search_string + "%"}) or
			LOWER(name) like LOWER(${"%" + search_string + "%"}) or
			phone like ${"%" + search_string + "%"}
		order by usn
		limit ${limit}`;
  return res;
};

module.exports = get_search_results;
