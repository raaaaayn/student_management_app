const postgres = require("postgres");
const { pipeline } = require("node:stream/promises");
const { Readable } = require("node:stream");
const { CONNECTION_STRING } = require("../config");
const generate_mock_data = require("./generate");

const sql = postgres(CONNECTION_STRING, {});

const {
  dep_entries,
  faculties,
  students,
  semesters,
  subjects,
  student_subject_infos,
} = generate_mock_data();

const clear_and_setup_tables = async () => {
  try {
    await sql`DROP TABLE student, student_subject_info, subject, semester, department, faculty, timetable_class, password_hashes`;
    console.log("yup");
    await sql.file("student_management.sql");
    await Promise.all([
      sql`ALTER TABLE
			student DROP CONSTRAINT student_current_sem_id_foreign`,
      sql`ALTER TABLE
			student DROP CONSTRAINT student_department_foreign`,

      sql`ALTER TABLE
			student_subject_info DROP CONSTRAINT student_subject_info_subject_foreign`,
      sql`ALTER TABLE
			student_subject_info DROP CONSTRAINT student_subject_info_sem_foreign`,
      sql`ALTER TABLE
			student_subject_info DROP CONSTRAINT student_subject_info_department_foreign`,

      sql`ALTER TABLE
			subject DROP CONSTRAINT subject_prof_foreign`,
      sql`ALTER TABLE
			subject DROP CONSTRAINT subject_department_foreign`,
      sql`ALTER TABLE
			subject DROP CONSTRAINT subject_sem_foreign`,

      sql`ALTER TABLE
			semester DROP CONSTRAINT semester_class_teacher_foreign`,
      sql`ALTER TABLE
			semester DROP CONSTRAINT semester_department_foreign`,

      sql`ALTER TABLE
			department DROP CONSTRAINT department_hod_foreign`,

      sql`ALTER TABLE
			timetable_class DROP CONSTRAINT timetable_class_sem_id_foreign`,
      sql`ALTER TABLE
			timetable_class DROP CONSTRAINT timetable_class_subject_foreign`,

      sql`ALTER table password_hashes drop constraint unique_password_user`,
    ]);
    console.log("yup");
  } catch (err) {
    console.error("nope");
    console.error(err);
  }
};

const load_into_tables = async () => {
  try {
    await sql`INSERT INTO faculty ${sql(
      faculties,
      "id",
      "name",
      "role",
      "phone",
    )}`;
    console.log("yup");

    await sql`INSERT INTO department ${sql(
      dep_entries,
      "course",
      "hod",
      "name",
    )}`;
    console.log("yup");

    await sql`INSERT INTO semester ${sql(
      semesters,
      "id",
      "department",
      "sem",
      "class_teacher",
      "scheme",
    )}`;
    console.log("yup");

    const chunkSize = 5000;
    for (let i = 0; i < students.length; i += chunkSize) {
      const chunk = students.slice(i, i + chunkSize);
      await sql`INSERT INTO student ${sql(
        chunk,
        "usn",
        "name",
        "department",
        "current_sem_id",
        "phone",
      )}`;
    }
    console.log("yup");

    await sql`INSERT INTO subject ${sql(
      subjects,
      "code",
      "name",
      "description",
      "department",
      "sem_id",
      "prof",
    )}`;
    console.log("yup");

    const promises_arr = [];
    const student_subject_infos_stream = Readable.from(
      student_subject_infos.map(
        (s) => `${Object.values(s).join("\t")}\t${0}\t${0}\n`,
      ),
    );
    const query = await sql`COPY student_subject_info FROM STDIN`.writable();
    await pipeline(student_subject_infos_stream, query);
    console.log("yup");

    await Promise.all([
      sql`ALTER TABLE
			student ADD CONSTRAINT student_current_sem_id_foreign FOREIGN KEY(current_sem_id) REFERENCES semester(id);`,
      sql`ALTER TABLE
			student ADD CONSTRAINT student_department_foreign FOREIGN KEY(department) REFERENCES department(course);`,

      sql`ALTER TABLE
			student_subject_info ADD CONSTRAINT student_subject_info_subject_foreign FOREIGN KEY(subject) REFERENCES subject(code);`,
      sql`ALTER TABLE
			student_subject_info ADD CONSTRAINT student_subject_info_sem_foreign FOREIGN KEY(sem_id) REFERENCES semester(id);`,
      sql`ALTER TABLE
			student_subject_info ADD CONSTRAINT student_subject_info_department_foreign FOREIGN KEY(department) REFERENCES department(course);`,

      sql`ALTER TABLE
			subject ADD CONSTRAINT subject_prof_foreign FOREIGN KEY(prof) REFERENCES faculty(id);`,
      sql`ALTER TABLE
			subject ADD CONSTRAINT subject_department_foreign FOREIGN KEY(department) REFERENCES department(course);`,
      sql`ALTER TABLE
			subject ADD CONSTRAINT subject_sem_foreign FOREIGN KEY(sem_id) REFERENCES semester(id);`,

      sql`ALTER TABLE
			semester ADD CONSTRAINT semester_class_teacher_foreign FOREIGN KEY(class_teacher) REFERENCES faculty(id);`,
      sql`ALTER TABLE
			semester ADD CONSTRAINT semester_department_foreign FOREIGN KEY(department) REFERENCES department(course);`,

      sql`ALTER TABLE
			department ADD CONSTRAINT department_hod_foreign FOREIGN KEY(hod) REFERENCES faculty(id);`,

      sql`ALTER TABLE
			timetable_class ADD CONSTRAINT timetable_class_sem_id_foreign FOREIGN KEY(sem_id) REFERENCES semester(id);`,
      sql`ALTER TABLE
			timetable_class ADD CONSTRAINT timetable_class_subject_foreign FOREIGN KEY(subject) REFERENCES subject(code);`,

      sql`ALTER table password_hashes add constraint unique_password_user UNIQUE("user")`,
    ]);
    console.log("yup");

    // await sql`insert into timetable_class values('18CS51','monday','08:00:00','08:50:00',3097)`;
  } catch (err) {
    console.error("nope");
    console.error(err);
    console.error(err.query);
    console.error(err.parameters);
  }
};

(async () => {
  await clear_and_setup_tables();
  await load_into_tables();
  // const res = await sql`select usn,student.name as name,student.department,faculty.name as hod,sem,phone from student
  // inner join semester on student.current_sem_id=semester.id
  // inner join department on semester.department=department.course
  // inner join faculty on department.hod = faculty.id limit 10;`
  // console.log(res);
  await sql.end();
})();
