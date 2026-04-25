-- 1. KANBAN BOARD QUERIES (Application Management)


-- A. Delete a Job Application
-- Triggered when a user removes a job card from their board.
-- Cascades to: interview, application_tags, full_time/internship, submitted_with
DELETE FROM `application`
WHERE `username` = 'jdoe' AND `app_number` = 1;




-- 2. INTERVIEW & ASSET MANAGEMENT QUERIES


-- A. Delete a Specific Interview Round
-- Triggered if an interview is canceled or added by mistake.
DELETE FROM `interview`
WHERE `username` = 'jdoe' AND `app_number` = 2 AND `interview_round` = 1;


-- B. Delete a Document (Resume/Cover Letter)
-- Triggered when a user deletes a file from their asset library.
-- Cascades to: submitted_with (removes all submission records for this document)
DELETE FROM `document`
WHERE `document_id` = 1 AND `username` = 'jdoe';


-- C. Remove a Recruiter Connection
-- Triggered when a user wants to remove a recruiter from their networking list.
DELETE FROM `communicates_with`
WHERE `username` = 'jdoe' AND `recruiter_id` = 2;




-- 3. SETTINGS & DATA MANAGEMENT QUERIES


-- A. "Delete All Data" Feature
-- Triggered from the Settings Panel -> "Delete All Data" button mentioned in your specs.
-- Cascades to ALL of the user's data: applications, documents, communicates_with,
-- and all dependent tables (interview, application_tags, full_time, internship, submitted_with)
DELETE FROM `app_user`
WHERE `username` = 'jdoe';
