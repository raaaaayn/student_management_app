// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const sql = require('./db_setup')

fastify.get('/search', async (request, reply) => {
	const search_string = request.query.q;
	if (search_string) {
		const res = await sql`select usn,name,department,phone from student where 
			LOWER(usn) like LOWER(${'%' + search_string + '%'}) or
			LOWER(name) like LOWER(${'%' + search_string + '%'}) or
			phone like ${'%' + search_string + '%'}
			limit 10`;
		if (res.length !== 0)
			return JSON.stringify(res, null, 2)
		return 'no results'
	}
	return 'no query string'
})

fastify.get('/usn', async (request, reply) => {
	const query = request.query;
	const usn = query.usn;
	if (usn) {
		const res = await sql`select usn,T1.name,department,hod,hod_phone,faculty.name as class_teacher,faculty.phone as class_teacher_phone,sem,student_phone from
			(select usn,student.name as name,student.department,faculty.name as hod,faculty.phone as hod_phone,class_teacher,sem,student.phone as student_phone from student
				inner join semester on student.current_sem_id=semester.id
				inner join department on semester.department=department.course
				inner join faculty on department.hod = faculty.id) as T1
			inner join faculty on T1.class_teacher = faculty.id
			where LOWER(usn) = LOWER(${usn})`
		if (res.length !== 0) return res[0];
		return 'no results'
	}
	return 'no usn provided'
})

// Run the server!
const start = async () => {
	try {
		await fastify.listen({ port: 3000 })
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()
