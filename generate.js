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
	const phone = faker.phone.number('##########');
	const email = null;
	return { id: faculty_id, name: faculty_name, role, phone, email }
}

const generate_students = (sems, students) => {
	for (const department of deps) {
		const related_sems = sems.filter(semester => semester.department === department)
		for (const semester of related_sems) {
			for (let i = 1; i <= faker.datatype.number({ min: 500, max: 999 }); i++) {
				const name = faker.name.fullName();
				const usn = `1EE${semester.scheme}${department}${String(i).padStart(3, '0')}`;
				const current_sem_id = semester.id;
				const phone = faker.phone.number('##########');
				students.push({ usn, name, department, current_sem_id, phone })
			}
		}
	}
	// const random_dep_index = faker.datatype.number({
	// 	'min': 0,
	// 	'max': deps.length - 1
	// });
	// const name = faker.name.fullName();
	// const department = deps[random_dep_index];
	// const usn = faker.helpers.unique(faker.helpers.regexpStyleStringParse, [`1EE[15-20]${department}${faker.helpers.replaceSymbolWithNumber('###')}`], { maxRetries: 10000 })
	// const related_sems = sems.filter(semester => semester.department === department)
	// const random_sem_index = faker.datatype.number({
	// 	'min': 0,
	// 	'max': related_sems.length - 1
	// });
	// const semester = related_sems[random_sem_index]
	// const current_sem_id = semester.id;
	// const phone = faker.phone.number('##########');
	// return { usn, name, department, current_sem_id, phone }
}

const generate_subjects = (semesters, faculties, subjects) => {
	// for (course of departments) {
	for (const semester of semesters) {
		// for (let sem_number = 1; sem_number <= 8; sem_number++) {
		for (let subject_number = 1; subject_number <= 6; subject_number++) {
			let subject_code;
			if (semester.sem > 6) {
				subject_code = `17${semester.department}${semester.sem}${subject_number}`
			}
			else if (semester.sem > 2) {
				subject_code = `18${semester.department}${semester.sem}${subject_number}`
			}
			else {
				subject_code = `20${semester.department}${semester.sem}${subject_number}`
			}
			const subject_name = faker.lorem.word()
			const subject_description = faker.lorem.sentence(5);
			const department = semester.department;
			const sem_id = semester.id;
			const random_prof_idx = faker.datatype.number({
				'min': 0,
				'max': faculties.length - 1
			});
			const prof = faculties[random_prof_idx].id;
			subjects.push({
				code: subject_code,
				name: subject_name,
				description: subject_description,
				department,
				sem_id,
				prof
			});
		}
	}
	// }
	// }
}

const generate_students_subject_info = async (students, subjects, subject_infos) => {
	for (const student of students) {
		const related_subjects = subjects.filter(sub => sub.sem_id === student.current_sem_id)
		if (related_subjects.length !== 0) {
			for (const subject of related_subjects) {
				const usn = student.usn;
				const department = student.department;
				const sem_id = student.current_sem_id;
				const max_marks = 50;
				const attendance = '85%';
				const ia_1 = faker.datatype.number({ max: 50 })
				const ia_2 = faker.datatype.number({ max: 50 })
				subject_infos.push({
					usn,
					department,
					subject: subject.code,
					sem_id,
					attendance,
					max_marks,
					ia_1,
					ia_2
				})
			}
		}
	}
}

const mock_data = () => {
	const hods = [];
	const dep_entries = [];
	let faculties = [];
	const semesters = [];
	const students = []
	const subjects = []
	const student_subject_infos = [];

	// creating normal faculty
	for (let i = 0; i <= 500; i++) {
		const faculty = generate_faculty();
		faculties.push(faculty);
	}

	// creating departments and hods for departments
	for (const [idx, dep] of deps.entries()) {
		const hod_id = faker.helpers.unique(faker.random.alphaNumeric, [7], { maxRetries: 200 })
		const name = faker.name.fullName();
		const role = "HOD";
		const phone = faker.phone.number('##########');
		const hod = { id: hod_id, name, role, phone }
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
			const scheme = `${25 - sem_number}`;
			semesters.push({ id: sem_id, department, sem: sem_number, class_teacher, scheme })
		}
	}

	// for (let i = 0; i <= 15000; i++) {
	// const student = generate_students(semesters);
	generate_students(semesters, students);
	console.log(students[0]);
	// students.push(student)
	// }
	generate_subjects(semesters, faculties, subjects);
	// console.log(subjects[1]);
	generate_students_subject_info(students, subjects, student_subject_infos);
	// console.log(student_subject_infos[1]);
	return { dep_entries, faculties, students, semesters, subjects, student_subject_infos }
}

module.exports = mock_data
