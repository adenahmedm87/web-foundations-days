# School Database Design

## Tables

- students: Stores each student's id, name and email. The id is the primary key. Name and email are required, and email must be unique.
- courses: Stores each course's id and name. The id is the primary key, and the course name is required.
- enrolments: Stores which student takes which course, together with their grade. The student_id and course_id columns are required foreign keys. Together they form a composite primary key, preventing duplicate enrolments. Grade can be NULL until the student receives a grade.

## Relationships

- Students to enrolments is one-to-many: one student can have several enrolments, but each enrolment belongs to one student.
- Courses to enrolments is one-to-many: one course can have several enrolments, but each enrolment refers to one course.
- Students to courses is many-to-many: a student can take several courses, and a course can have several students.
- The enrolments join table connects students and courses without storing lists inside a column. It also stores the grade for each student-course pair.
- Foreign keys prevent enrolments from referring to nonexistent students or courses. ON DELETE CASCADE removes related enrolments when a student or course is deleted.

## Suggested index

- Index name: idx_enrolments_course_id.
- Table and column: enrolments(course_id).
- Reason: It helps the database find enrolments for a particular course efficiently. This supports listing students on a course.
- The composite primary key already supports searches beginning with student_id. A separate course_id index supports searches by course.
- The index uses additional storage and must be maintained when enrolments change.

## SQL or NoSQL?

I would choose SQL for this school system because students, courses and enrolments have a clear structure and predictable relationships. Primary keys, foreign keys, NOT NULL and UNIQUE constraints help keep the data correct. JOIN queries connect students to their courses, while GROUP BY supports reports such as the number of students per course. A document database could store this information, but SQL fits these relationships directly and reduces the need to duplicate student or course details.