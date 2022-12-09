/* get student details including hod name*/
select usn,student.name as name,student.department,faculty.name as hod,sem,phone from student
inner join semester on student.current_sem_id=semester.id
inner join department on semester.department=department.course
inner join faculty on department.hod = faculty.id limit 10;
