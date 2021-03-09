# get check In
SELECT *
FROM time_attendance_db.time_attendances
WHERE check_in IN (
    SELECT MIN(check_in) 
    FROM time_attendance_db.time_attendances
    WHERE userId=1 
    AND DATE(check_in) < (CURRENT_DATE()+1) 
	AND DATE(check_in) >= (CURRENT_DATE()-6 )
	GROUP BY DATE(check_in)
) AND userId=1  
order by check_in;

# get check Out 
SELECT *
FROM time_attendance_db.time_attendances
WHERE check_in IN (
    SELECT MAX(check_in)
    FROM time_attendance_db.time_attendances
    WHERE userId=1 
    AND DATE(check_in) < (CURRENT_DATE()+1) 
	AND DATE(check_in) >= (CURRENT_DATE()-6 )
	GROUP BY DATE(check_in)
) AND userId=1  
order by check_in;

