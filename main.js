const postgres = require('postgres');
const generate_mock_data = require('./generate');

const sql = postgres('postgres://postgres:test@localhost:5432/postgres', {})

const { dep_entries, faculties, students, semesters, subjects, student_subject_infos } = generate_mock_data();

const clear_tables = async () => {
	try {
		await sql`DELETE FROM student`
		console.log("yup");

		await sql`DELETE FROM student_subject_info`
		console.log("yup");

		await sql`DELETE FROM subject`
		console.log("yup");

		await sql`DELETE FROM semester`
		console.log("yup");

		await sql`DELETE FROM department`
		console.log("yup");

		await sql`DELETE FROM faculty`
		console.log("yup");
	}
	catch (err) {
		console.error("nope")
		console.error(err)
	}
}

const load_into_tables = async () => {
	try {
		await sql`INSERT INTO faculty ${sql(faculties, 'id', 'name', 'role')}`
		console.log("yup");

		await sql`INSERT INTO department ${sql(dep_entries, 'course', 'hod', 'name')}`
		console.log("yup");

		await sql`INSERT INTO semester ${sql(semesters, 'id', 'department', 'sem', 'class_teacher')}`
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

	}
	catch (err) {
		console.error("nope")
		console.error(err)
	}
}

(
	async () => {
		await clear_tables()
		await load_into_tables()
		await sql.end()
	}
)()
