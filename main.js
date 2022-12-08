const postgres = require('postgres');
const generate_mock_data = require('./generate');

const sql = postgres('postgres://postgres:test@localhost:5432/postgres', {})

const { dep_entries, faculties, students, semesters } = generate_mock_data();

(
	async () => {
		try {
			await sql`INSERT INTO faculty ${sql(faculties, 'id', 'name', 'role')}`
			console.log("yup");

			await sql`INSERT INTO department ${sql(dep_entries, 'course', 'hod', 'name')}`
			console.log("yup");

			await sql`INSERT INTO semester ${sql(semesters, 'id', 'department', 'sem', 'class_teacher')}`
			console.log("yup");

			await sql`INSERT INTO student ${sql(students, 'usn', 'name', 'department', 'current_sem_id', 'phone')}`
			console.log("yup");
		}
		catch (err) {
			console.error("nope")
			console.error(err)
		}
	}
)()
