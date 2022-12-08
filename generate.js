const { faker } = require('@faker-js/faker');

const deps = ["CS", "IS", "ME", "CV", "AE", "AG", "EE", "EC", "MT", "AS", "BT", "CH", "AU"]
const deps_name = ["Computer Science", "Information Science", "Mechanical Engineering", "Civil Engineering", "Aeronautical Engineering", "Agricultural Engineering", "Electrical Engineering", "Electronics Communications", "Mechatronics", "Aerospace Engineering", "Bio Technology", "Chemical Engineering", "Automobile Engineering"]
const roles = ["Assistant Prof.", "Prof", "Others", "Prof"]

const generate_faculty = () => {
	const faculty_id = faker.helpers.unique(faker.random.alphaNumeric, [7], { maxRetries: 200 })
	const faculty_name = faker.name.fullName();
	const random_role_index = faker.datatype.number({
		'min': 0,
		'max': roles.length - 1
	});
	const role = roles[random_role_index];
	return { id: faculty_id, name: faculty_name, role }
}

const generate_students = (sems) => {
	const random_dep_index = faker.datatype.number({
		'min': 0,
		'max': deps.length - 1
	});
	const usn = faker.helpers.regexpStyleStringParse(`1${faker.helpers.replaceSymbols('??')}[10-20]${deps[random_dep_index]}${faker.helpers.replaceSymbolWithNumber('###')}`)
	const name = faker.name.fullName();
	const department = deps[random_dep_index];
	const random_sem_index = faker.datatype.number({
		'min': 0,
		'max': sems.length - 1
	});
	const current_sem_id = sems[random_sem_index].id;
	const phone = faker.phone.number('##########');
	return { usn, name, department, current_sem_id, phone }
}

const mock_data = () => {
	const hods = [];
	const dep_entries = [];
	let faculties = [];
	const semesters = [];
	const students = []

	// creating normal faculty
	for (let i = 0; i <= 70; i++) {
		const faculty = generate_faculty();
		faculties.push(faculty);
	}

	// creating departments and hods for departments
	for (const [idx, dep] of deps.entries()) {
		const hod_id = faker.helpers.unique(faker.random.alphaNumeric, [7], { maxRetries: 200 })
		const name = faker.name.fullName();
		const role = "HOD";
		const hod = { id: hod_id, name, role }
		hods.push(hod)

		const dep_course = dep;
		const dep_name = deps_name[idx]
		dep_entries.push({ course: dep_course, hod: hod_id, name: dep_name })
	}


	faculties = [...faculties, ...hods]

	// creating semesters
	for (const dep of deps) {
		for (let sem_number = 1; sem_number <= 8; sem_number++) {
			const sem_id = faker.helpers.unique(faker.random.numeric, [4], { maxRetries: 200 })
			const department = dep;
			const faculties_wo_others = faculties.filter(fac => fac.role !== "Others")
			const random_faculty_index = faker.datatype.number({
				'min': 0,
				'max': faculties_wo_others.length - 1
			});
			const class_teacher = faculties_wo_others[random_faculty_index].id;
			semesters.push({ id: sem_id, department, sem: sem_number, class_teacher })
		}
	}

	for (let i = 0; i <= 500; i++) {
		const student = generate_students(semesters);
		students.push(student)
	}
	return { dep_entries, faculties, students, semesters }
}

module.exports = mock_data
