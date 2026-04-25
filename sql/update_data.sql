-- 1. KANBAN BOARD QUERIES (Status Management)


-- A. Drag-and-Drop Status Update
-- Triggered when a user drags a job card from one column to another (e.g., 'Applied' to 'Interviewing')
UPDATE `application`
SET `status` = 'Interviewing'
WHERE `username` = 'jdoe' AND `app_number` = 1;




-- 2. EDIT APPLICATION QUERIES (Updating Job Details)


-- A. Update General Application Details
-- Triggered when a user clicks a job card and edits the salary, job title, or notes
UPDATE `application`
SET `salary` = 160000.00,
   `job_title` = 'Senior Frontend Engineer',
   `notes` = 'Recruiter reached out, standard benefits apply. Initial screen went well.'
WHERE `username` = 'jdoe' AND `app_number` = 1;


-- B. Update Full-Time Offer Details
-- Triggered when a user edits an application to add or negotiate equity and bonuses
UPDATE `full_time`
SET `equity_offered` = '250 RSUs',
   `sign_on_bonus` = 15000.00
WHERE `username` = 'jdoe' AND `app_number` = 2;


-- C. Update Internship Details
-- Triggered if a user needs to correct or update the duration of an internship
UPDATE `internship`
SET `duration_months` = 6
WHERE `username` = 'jdoe' AND `app_number` = 6;




-- 3. INTERVIEW MANAGEMENT QUERIES


-- A. Reschedule or Edit an Interview
-- Triggered when a user edits an existing interview round to change the date or format
UPDATE `interview`
SET `interview_date` = '2026-03-25',
   `interview_type` = 'On-site (In-Person)'
WHERE `username` = 'jdoe' AND `app_number` = 1 AND `interview_round` = 3;




-- 4. SETTINGS & ASSET MANAGEMENT QUERIES


-- A. Rename a Document
-- Triggered when a user updates the title of a resume or cover letter in their document library
UPDATE `document`
SET `title` = 'SE_Resume_Final_Updated_2026'
WHERE `document_id` = 1 AND `username` = 'jdoe';


-- B. Update User Profile
-- Triggered from the settings panel if the user changes their name or updates their password
UPDATE `app_user`
SET `first_name` = 'Jonathan',
   `password` = 'new_secure_hashed_password_456'
WHERE `username` = 'jdoe';


-- C. Update Recruiter Contact Info
-- Triggered if a user edits a recruiter's contact card (e.g., correcting a misspelled email)
UPDATE `recruiter`
SET `email` = 's.connor.recruiting@google.com',
   `first_name` = 'Sarah-Jane'
WHERE `recruiter_id` = 1;
