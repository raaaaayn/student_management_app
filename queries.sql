/* get student details including hod name and class teacher*/
select usn,T1.name,department,hod,hod_phone,faculty.name as class_teacher,faculty.phone as class_teacher_phone,sem,student_phone from
(select usn,student.name as name,student.department,faculty.name as hod,faculty.phone as hod_phone,class_teacher,sem,student.phone as student_phone from student
	inner join semester on student.current_sem_id=semester.id
	inner join department on semester.department=department.course
	inner join faculty on department.hod = faculty.id) as T1
inner join faculty on T1.class_teacher = faculty.id
where usn like '1EE%' 
limit 10;

select usn from student where usn like '1EE20%';
