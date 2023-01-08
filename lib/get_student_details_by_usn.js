const sql = require("../db");

const get_student_details_by_usn = async (usn) => {
  const res = await sql`
                       SELECT usn,t1.name,department,hod,hod_phone,faculty.name AS class_teacher
                         , faculty.phone AS class_teacher_phone,sem,student_phone
                         FROM
                           (SELECT usn,student.name AS name,student.department,faculty.name AS hod
                            , faculty.phone AS hod_phone,class_teacher,sem,student.phone AS student_phone
                            FROM student
                            INNER JOIN semester ON student.current_sem_id=semester.id
                            INNER JOIN department ON semester.department=department.course
                            INNER JOIN faculty ON department.hod = faculty.id
                            WHERE lower(usn) = lower(${usn}) ) AS t1
                         INNER JOIN faculty ON t1.class_teacher = faculty.id
		`;
  return res[0];
};

module.exports = get_student_details_by_usn;
