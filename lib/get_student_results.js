const sql = require("../db");

const get_student_results_all = async (usn) => {
  const res = await sql`
                       SELECT usn,student_subject_info.department,subject,sem,attendance, max_marks, ia_1
                         , ia_2,ia_3,ia_4
                         FROM student_subject_info
                         INNER JOIN semester ON student_subject_info.sem_id=semester.id
                         WHERE usn=upper(${usn})
	`;
  return res;
};

module.exports = { get_student_results_all };
