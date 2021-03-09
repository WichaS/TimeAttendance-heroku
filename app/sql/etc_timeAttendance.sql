SELECT * FROM time_attendance_db.time_attendances;

DELETE FROM time_attendance_db.time_attendances WHERE id=150;

DELETE FROM time_attendance_db.time_attendances WHERE id>=121 AND id<=123;

UPDATE time_attendance_db.time_attendances
SET check_in = "2021-01-05 00:00:00"
WHERE id=64;

UPDATE time_attendance_db.time_attendances
SET check_in = "2021-01-05 12:00:00"
WHERE id=65;

SELECT * FROM time_attendance_db.time_attendances
WHERE userId=1;


SELECT * FROM time_attendance_db.time_attendances
WHERE userId=1
group by DATE(check_in);

SELECT t1.* FROM time_attendance_db.time_attendances t1
  JOIN (SELECT check_in, MAX(id) id FROM time_attendance_db.time_attendances GROUP BY DATE(check_in)) t2
    ON t1.id = t2.id AND t1.check_in = t2.check_in;

# get check In
SELECT * FROM time_attendance_db.time_attendances WHERE userId=1 GROUP BY DATE(check_in);

# get check Out 
SELECT *
FROM time_attendance_db.time_attendances
WHERE id IN (
    SELECT MAX(id)
    FROM time_attendance_db.time_attendances
    WHERE userId=1 
 GROUP BY DATE(check_in)
);

SELECT DATE(check_in) FROM  time_attendance_db.time_attendances WHERE userId=1;