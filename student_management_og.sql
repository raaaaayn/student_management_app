CREATE TABLE "student"(
    "usn" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "current_sem_id" INTEGER NOT NULL,
    "phone" INTEGER NOT NULL
);
ALTER TABLE
    "student" ADD PRIMARY KEY("usn");
COMMENT
ON COLUMN
    "student"."usn" IS 'id and usn';
CREATE TABLE "faculty"(
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "faculty" ADD PRIMARY KEY("id");
CREATE TABLE "student_subject_info"(
    "usn" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "sem" INTEGER NOT NULL,
    "attendance" VARCHAR(255) NOT NULL,
    "max_marks" INTEGER NOT NULL,
    "ia_1" INTEGER NULL,
    "ia_2" INTEGER NULL,
    "ia_3" INTEGER NULL,
    "ia_4" INTEGER NULL
);
ALTER TABLE
    "student_subject_info" ADD PRIMARY KEY("usn");
CREATE TABLE "timetable_class"(
    "subject" VARCHAR(255) NOT NULL,
    "day_of_week" VARCHAR(255) NOT NULL,
    "time_start" TIME(0) WITHOUT TIME ZONE NOT NULL,
    "time_end" TIME(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "timetable_class" ADD PRIMARY KEY("subject");
CREATE TABLE "subject"(
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "sem" INTEGER NOT NULL,
    "prof" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "subject" ADD PRIMARY KEY("code");
CREATE TABLE "semester"(
    "id" INTEGER NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "sem" INTEGER NOT NULL,
    "class_teacher" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "semester" ADD PRIMARY KEY("id");
CREATE TABLE "department"(
    "course" VARCHAR(255) NOT NULL,
    "hod" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "department" ADD PRIMARY KEY("course");
ALTER TABLE
    "student" ADD CONSTRAINT "student_current_sem_id_foreign" FOREIGN KEY("current_sem_id") REFERENCES "semester"("id");
ALTER TABLE
    "student_subject_info" ADD CONSTRAINT "student_subject_info_subject_foreign" FOREIGN KEY("subject") REFERENCES "subject"("code");
ALTER TABLE
    "student_subject_info" ADD CONSTRAINT "student_subject_info_sem_foreign" FOREIGN KEY("sem") REFERENCES "semester"("id");
ALTER TABLE
    "subject" ADD CONSTRAINT "subject_prof_foreign" FOREIGN KEY("prof") REFERENCES "faculty"("id");
ALTER TABLE
    "semester" ADD CONSTRAINT "semester_class_teacher_foreign" FOREIGN KEY("class_teacher") REFERENCES "faculty"("id");
ALTER TABLE
    "department" ADD CONSTRAINT "department_hod_foreign" FOREIGN KEY("hod") REFERENCES "faculty"("id");