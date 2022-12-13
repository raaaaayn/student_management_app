const sql = require("../db");

const get_stats = async () => {
  const n_students_query = sql`select count(*) from student`;
  const n_hod_query = sql`select count(*) from faculty where role='HOD'`;
  const n_prof_query = sql`select count(*) from faculty where role!='HOD'`;
  const n_deps_query = sql`select count(*) from department`;
  const [n_students, n_hod, n_prof, n_deps] = await Promise.all([
    n_students_query,
    n_hod_query,
    n_prof_query,
    n_deps_query,
  ]);
  const stats = {
    students: n_students[0].count,
    hods: n_hod[0].count,
    profs: n_prof[0].count,
    departments: n_deps[0].count,
  };
  return stats;
};

module.exports = get_stats;
