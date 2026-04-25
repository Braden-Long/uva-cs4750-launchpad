-- 1. DASHBOARD SUMMARY QUERIES (The "Command Center")


-- A. Total Applications
SELECT COUNT(*) AS total_applications
FROM `application`
WHERE `username` = 'jdoe';


-- B. Active Offers
SELECT COUNT(*) AS active_offers
FROM `application`
WHERE `username` = 'jdoe' AND `status` = 'Offered';


-- C. Pending Interviews (Interviews scheduled for today or in the future)
SELECT COUNT(*) AS pending_interviews
FROM `interview`
WHERE `username` = 'jdoe' AND `interview_date` >= CURDATE();


-- D. Response Rate (Calculates percentage of apps that resulted in an interview or offer)
SELECT
   (SELECT COUNT(*) FROM `application`
    WHERE `username` = 'jdoe' AND `status` IN ('Interviewing', 'Offered'))
   / COUNT(*) * 100 AS response_rate_percentage
FROM `application`
WHERE `username` = 'jdoe';


-- E. Pipeline Breakdown (Progress bars for each status)
SELECT `status`, COUNT(*) AS count_per_status
FROM `application`
WHERE `username` = 'jdoe'
GROUP BY `status`;


-- F. Weekly Activity Chart (Applications sent per day over the last 7 days)
SELECT `app_date`, COUNT(*) AS apps_submitted
FROM `application`
WHERE `username` = 'jdoe'
 AND `app_date` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY `app_date`
ORDER BY `app_date` ASC;


-- G. Recent Activity (Top 5 most recently updated/applied applications)
SELECT `company_name`, `job_title`, `status`, `app_date`
FROM `application`
WHERE `username` = 'jdoe'
ORDER BY `app_date` DESC
LIMIT 5;




-- 2. KANBAN BOARD QUERIES (Status Board)


-- A. Load All Kanban Cards (Basic job info for the board)
SELECT `app_number`, `company_name`, `job_title`, `status`, `salary`, `app_date`
FROM `application`
WHERE `username` = 'jdoe';


-- B. Load Tags for Kanban Cards (Groups multiple tags into one comma-separated string per app)
SELECT `app_number`, GROUP_CONCAT(`tags` SEPARATOR ', ') AS all_tags
FROM `application_tags`
WHERE `username` = 'jdoe'
GROUP BY `app_number`;


-- C. Search Filter (Filter cards by company name or job title)
SELECT `app_number`, `company_name`, `job_title`, `status`
FROM `application`
WHERE `username` = 'jdoe'
 AND (`company_name` LIKE '%Google%' OR `job_title` LIKE '%Engineer%');


-- D. Sorting feature (e.g., sort cards by Highest Salary)
SELECT `app_number`, `company_name`, `job_title`, `salary`
FROM `application`
WHERE `username` = 'jdoe'
ORDER BY `salary` DESC;


-- E. Sorting feature (e.g., sort cards by Oldest Application Date)
SELECT `app_number`, `company_name`, `job_title`, `app_date`
FROM `application`
WHERE `username` = 'jdoe'
ORDER BY `app_date` ASC;




-- 3. EXPANDED JOB CARD QUERIES (When a user clicks a specific Kanban card)


-- A. Fetch Subclass Data (Checks if it is an Internship or Full-Time role to display specific fields)
SELECT a.notes, i.duration_months, f.equity_offered, f.sign_on_bonus
FROM `application` a
LEFT JOIN `internship` i ON a.username = i.username AND a.app_number = i.app_number
LEFT JOIN `full_time` f ON a.username = f.username AND a.app_number = f.app_number
WHERE a.username = 'jdoe' AND a.app_number = 1;


-- B. Fetch all Interview Rounds for the specific application
SELECT `interview_round`, `interview_date`, `interview_type`
FROM `interview`
WHERE `username` = 'jdoe' AND `app_number` = 1
ORDER BY `interview_round` ASC;


-- C. Fetch specific Resumes/Cover Letters attached to the application
SELECT d.title, d.doc_type
FROM `document` d
JOIN `submitted_with` sw ON d.document_id = sw.document_id
WHERE sw.username = 'jdoe' AND sw.app_number = 1;




-- 4. SETTINGS & DATA MANAGEMENT QUERIES


-- A. Export All Data (The Gear Icon -> Export as CSV feature)
-- This performs a massive join to gather all core application data in one flat view
SELECT
   a.app_number, a.company_name, a.job_title, a.app_date, a.status, a.salary, a.notes,
   i.duration_months,
   f.equity_offered, f.sign_on_bonus
FROM `application` a
LEFT JOIN `internship` i ON a.username = i.username AND a.app_number = i.app_number
LEFT JOIN `full_time` f ON a.username = f.username AND a.app_number = f.app_number
WHERE a.username = 'jdoe'
ORDER BY a.app_date DESC;


-- B. User Profile / Authentication Check
SELECT `username`, `first_name`, `last_name`
FROM `app_user`
WHERE `username` = 'jdoe' AND `password` = 'pass123';


-- C. View Recruiter Network (Fetch all recruiters the user has communicated with)
SELECT r.first_name, r.last_name, r.email, r.company_name
FROM `recruiter` r
JOIN `communicates_with` cw ON r.recruiter_id = cw.recruiter_id
WHERE cw.username = 'jdoe';
