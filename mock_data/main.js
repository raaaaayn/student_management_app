const postgres = require('postgres');
const { CONNECTION_STRING } = require('../config');
const generate_mock_data = require('./generate');

const sql = postgres(CONNECTION_STRING, {})

const { dep_entries, faculties, students, semesters, subjects, student_subject_infos } = generate_mock_data();

const clear_and_setup_tables = async () => {
	try {
		await sql`DROP TABLE student, student_subject_info, subject, semester, department, faculty, timetable_class`;
		console.log("yup");
		await sql.file('student_management.sql');
		console.log("yup");
	}
	catch (err) {
		console.error("nope")
		console.error(err)
	}
}

const load_into_tables = async () => {
	try {
		await sql`INSERT INTO faculty ${sql(faculties, 'id', 'name', 'role', 'phone')}`
		console.log("yup");

		await sql`INSERT INTO department ${sql(dep_entries, 'course', 'hod', 'name')}`
		console.log("yup");

		await sql`INSERT INTO semester ${sql(semesters, 'id', 'department', 'sem', 'class_teacher', 'scheme')}`
		console.log("yup");

		const chunkSize = 5000;
		for (let i = 0; i < students.length; i += chunkSize) {
			const chunk = students.slice(i, i + chunkSize);
			await sql`INSERT INTO student ${sql(chunk, 'usn', 'name', 'department', 'current_sem_id', 'phone')}`
		}
		console.log("yup");

		await sql`INSERT INTO subject ${sql(subjects, 'code', 'name', 'description', 'department', 'sem_id', 'prof')}`
		console.log("yup");

		for (let i = 0; i < student_subject_infos.length; i += chunkSize) {
			const chunk = student_subject_infos.slice(i, i + chunkSize);
			await sql`INSERT INTO student_subject_info ${sql(chunk, 'usn', 'department', 'subject', 'sem_id', 'attendance', 'max_marks', 'ia_1', 'ia_2')}`
		}
		console.log("yup");

		// await sql`insert into timetable_class values('18CS51','monday','08:00:00','08:50:00',3097)`;

	}
	catch (err) {
		console.error("nope")
		console.error(err)
	}
}

(
	async () => {
		await clear_and_setup_tables()
		await load_into_tables()
		// const res = await sql`select usn,student.name as name,student.department,faculty.name as hod,sem,phone from student
		// inner join semester on student.current_sem_id=semester.id
		// inner join department on semester.department=department.course
		// inner join faculty on department.hod = faculty.id limit 10;`
		// console.log(res);
		await sql.end()
	}
)()
