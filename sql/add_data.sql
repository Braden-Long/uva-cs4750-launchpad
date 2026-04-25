-- 1. Insert Users (10 Users)
INSERT INTO `app_user` (`username`, `first_name`, `last_name`, `password`) VALUES
('jdoe', 'John', 'Doe', 'pass123'), ('asmith', 'Alice', 'Smith', 'pass456'),
('bwayne', 'Bruce', 'Wayne', 'pass789'), ('ckent', 'Clark', 'Kent', 'pass321'),
('dprince', 'Diana', 'Prince', 'pass654'), ('pparker', 'Peter', 'Parker', 'pass987'),
('tstark', 'Tony', 'Stark', 'pass111'), ('nromanoff', 'Natasha', 'Romanoff', 'pass222'),
('bbanner', 'Bruce', 'Banner', 'pass333'), ('srogers', 'Steve', 'Rogers', 'pass444');


-- 2. Insert Companies (30 Companies)
INSERT INTO `company` (`company_name`) VALUES
('Google'), ('Meta'), ('Apple'), ('Amazon'), ('Netflix'), ('Microsoft'), ('Stripe'),
('Spotify'), ('Notion'), ('GitHub'), ('OpenAI'), ('Bloomberg'), ('Capital One'),
('Figma'), ('Discord'), ('Tesla'), ('SpaceX'), ('Palantir'), ('Databricks'),
('Snowflake'), ('Uber'), ('Lyft'), ('Airbnb'), ('DoorDash'), ('Coinbase'),
('Robinhood'), ('Plaid'), ('Square'), ('Twilio'), ('Zoom');


-- 3. Insert Documents (20 Documents)
INSERT INTO `document` (`document_id`, `title`, `doc_type`, `username`) VALUES
(1, 'SE_Resume_Final', 'Resume', 'jdoe'), (2, 'Frontend_Resume', 'Resume', 'jdoe'),
(3, 'CoverLetter_Google', 'Cover Letter', 'jdoe'), (4, 'Data_Sci_Resume', 'Resume', 'asmith'),
(5, 'ML_Research_CV', 'CV', 'asmith'), (6, 'PM_Resume_v2', 'Resume', 'bwayne'),
(7, 'Strategy_CoverLetter', 'Cover Letter', 'bwayne'), (8, 'Journalism_Portfolio', 'Portfolio', 'ckent'),
(9, 'Backend_Resume', 'Resume', 'pparker'), (10, 'Hardware_Eng_CV', 'CV', 'tstark'),
(11, 'Security_Resume', 'Resume', 'nromanoff'), (12, 'Physics_Research', 'Portfolio', 'bbanner'),
(13, 'Leadership_Resume', 'Resume', 'srogers'), (14, 'General_Resume', 'Resume', 'dprince'),
(15, 'Fullstack_Resume', 'Resume', 'pparker'), (16, 'AI_Safety_Letter', 'Cover Letter', 'tstark'),
(17, 'Quant_Resume', 'Resume', 'nromanoff'), (18, 'BioTech_CV', 'CV', 'bbanner'),
(19, 'Gov_Tech_Resume', 'Resume', 'srogers'), (20, 'Master_Resume_2026', 'Resume', 'jdoe');


-- 4. Insert Recruiters (15 Recruiters)
INSERT INTO `recruiter` (`recruiter_id`, `first_name`, `last_name`, `email`, `company_name`) VALUES
(1, 'Sarah', 'Connor', 'sconnor@google.com', 'Google'), (2, 'Michael', 'Scott', 'mscott@stripe.com', 'Stripe'),
(3, 'Pam', 'Beesly', 'pbeesly@figma.com', 'Figma'), (4, 'Jim', 'Halpert', 'jhalpert@spotify.com', 'Spotify'),
(5, 'Dwight', 'Schrute', 'dschrute@amazon.com', 'Amazon'), (6, 'Stanley', 'Hudson', 'shudson@meta.com', 'Meta'),
(7, 'Angela', 'Martin', 'amartin@bloomberg.com', 'Bloomberg'), (8, 'Kevin', 'Malone', 'kmalone@netflix.com', 'Netflix'),
(9, 'Oscar', 'Martinez', 'omartinez@apple.com', 'Apple'), (10, 'Phyllis', 'Vance', 'pvance@microsoft.com', 'Microsoft'),
(11, 'Ryan', 'Howard', 'rhoward@uber.com', 'Uber'), (12, 'Kelly', 'Kapoor', 'kkapoor@airbnb.com', 'Airbnb'),
(13, 'Toby', 'Flenderson', 'tflenderson@doordash.com', 'DoorDash'), (14, 'Creed', 'Bratton', 'cbratton@coinbase.com', 'Coinbase'),
(15, 'Meredith', 'Palmer', 'mpalmer@robinhood.com', 'Robinhood');


-- 5. Insert Applications (50 Applications)
INSERT INTO `application` (`username`, `app_number`, `company_name`, `job_title`, `app_date`, `status`, `salary`, `notes`) VALUES
('jdoe', 1, 'Google', 'Frontend Eng', '2026-03-01', 'Interviewing', 140000, 'Referred'),
('jdoe', 2, 'Stripe', 'Software Eng', '2026-03-02', 'Offered', 155000, 'Great benefits'),
('jdoe', 3, 'Meta', 'React Dev', '2026-03-05', 'Rejected', 135000, 'Failed technical'),
('jdoe', 4, 'Netflix', 'UI Engineer', '2026-03-10', 'Applied', 160000, 'Cold applied'),
('jdoe', 5, 'GitHub', 'Fullstack', '2026-03-12', 'Applied', 145000, NULL),
('jdoe', 6, 'OpenAI', 'Software Eng', NULL, 'Saved', 180000, 'Update resume'),
('jdoe', 7, 'Figma', 'Frontend Eng', '2026-03-15', 'Interviewing', 150000, 'Design systems'),
('jdoe', 8, 'Discord', 'Software Eng', '2026-03-16', 'Applied', 140000, NULL),
('asmith', 1, 'Amazon', 'Data Scientist', '2026-02-15', 'Rejected', 130000, 'Position filled'),
('asmith', 2, 'Bloomberg', 'Data Eng', '2026-02-20', 'Interviewing', 145000, 'Heavy SQL'),
('asmith', 3, 'Spotify', 'ML Eng', '2026-02-22', 'Offered', 150000, 'Negotiating'),
('asmith', 4, 'Capital One', 'Data Analyst', '2026-02-25', 'Applied', 110000, NULL),
('asmith', 5, 'Apple', 'Data Scientist', NULL, 'Saved', 160000, 'Need referral'),
('asmith', 6, 'Microsoft', 'AI Researcher', '2026-03-01', 'Interviewing', 165000, 'Copilot'),
('bwayne', 1, 'Notion', 'Product Mgr', '2026-03-05', 'Interviewing', 155000, 'Product sense round'),
('bwayne', 2, 'Stripe', 'Technical PM', '2026-03-06', 'Applied', 160000, NULL),
('bwayne', 3, 'Google', 'Product Mgr', '2026-03-08', 'Rejected', 170000, 'Resume screen'),
('bwayne', 4, 'Figma', 'Growth PM', '2026-03-10', 'Offered', 150000, 'Accepting!'),
('bwayne', 5, 'Meta', 'Product Mgr', '2026-03-11', 'Applied', 165000, NULL),
('bwayne', 6, 'OpenAI', 'Safety PM', NULL, 'Saved', 180000, 'Drafting cover letter'),
('pparker', 1, 'Tesla', 'Embedded Systems', '2026-02-10', 'Rejected', 120000, 'No hardware exp'),
('pparker', 2, 'SpaceX', 'Flight Software', '2026-02-12', 'Interviewing', 135000, 'Intense process'),
('pparker', 3, 'Uber', 'Backend Eng', '2026-02-18', 'Applied', 140000, NULL),
('pparker', 4, 'Lyft', 'Backend Eng', '2026-02-19', 'Applied', 138000, NULL),
('pparker', 5, 'Airbnb', 'Fullstack Eng', '2026-02-28', 'Offered', 150000, 'Great culture'),
('tstark', 1, 'Palantir', 'Forward Deployed Eng', '2026-01-15', 'Offered', 180000, 'High travel'),
('tstark', 2, 'Databricks', 'Systems Eng', '2026-01-20', 'Interviewing', 175000, 'Spark internals'),
('tstark', 3, 'Snowflake', 'Database Eng', '2026-01-22', 'Rejected', 170000, 'Culture fit'),
('tstark', 4, 'Coinbase', 'Crypto Eng', '2026-02-05', 'Applied', 165000, NULL),
('tstark', 5, 'Robinhood', 'Trading Systems', '2026-02-10', 'Saved', 160000, NULL),
('nromanoff', 1, 'Plaid', 'Security Eng', '2026-03-01', 'Interviewing', 155000, 'Infosec round'),
('nromanoff', 2, 'Square', 'AppSec Eng', '2026-03-03', 'Applied', 150000, NULL),
('nromanoff', 3, 'Twilio', 'Cloud Security', '2026-03-05', 'Rejected', 145000, NULL),
('nromanoff', 4, 'Zoom', 'Network Security', '2026-03-08', 'Offered', 140000, 'Boring stack'),
('bbanner', 1, 'Google', 'Research Scientist', '2026-02-01', 'Interviewing', 190000, 'Quantum AI'),
('bbanner', 2, 'Microsoft', 'Quantum Researcher', '2026-02-10', 'Offered', 185000, 'Station Q'),
('bbanner', 3, 'Apple', 'Health Tech', '2026-02-15', 'Applied', 175000, 'Sensor tech'),
('srogers', 1, 'Amazon', 'Operations Mgr', '2026-03-01', 'Interviewing', 130000, 'Fulfillment center'),
('srogers', 2, 'Uber', 'City General Mgr', '2026-03-05', 'Rejected', 140000, NULL),
('srogers', 3, 'Lyft', 'Operations Lead', '2026-03-10', 'Applied', 135000, NULL),
('ckent', 1, 'Bloomberg', 'Tech Reporter', '2026-03-01', 'Interviewing', 95000, 'Writing test'),
('ckent', 2, 'Netflix', 'Content Strategist', '2026-03-05', 'Applied', 110000, NULL),
('ckent', 3, 'Spotify', 'Podcast Producer', '2026-03-10', 'Saved', 105000, NULL),
('dprince', 1, 'Airbnb', 'Trust & Safety', '2026-03-02', 'Interviewing', 145000, 'Policy round'),
('dprince', 2, 'Meta', 'Policy Manager', '2026-03-06', 'Applied', 150000, NULL),
('dprince', 3, 'Google', 'Legal Counsel', '2026-03-12', 'Rejected', 180000, 'Requires NY Bar'),
('jdoe', 9, 'Uber', 'Frontend Eng', '2026-03-17', 'Saved', 140000, NULL),
('asmith', 7, 'Stripe', 'Data Analyst', '2026-03-17', 'Applied', 120000, NULL),
('bwayne', 7, 'Apple', 'Product Mgr', '2026-03-17', 'Interviewing', 160000, NULL),
('pparker', 6, 'DoorDash', 'Backend Eng', '2026-03-17', 'Offered', 145000, NULL);


-- 6. Insert Application Tags (88 Tags)
INSERT INTO `application_tags` (`username`, `app_number`, `tags`) VALUES
('jdoe', 1, 'Remote'), ('jdoe', 1, 'React'), ('jdoe', 1, 'TypeScript'),
('jdoe', 2, 'Hybrid'), ('jdoe', 2, 'Fintech'), ('jdoe', 2, 'Node.js'),
('jdoe', 3, 'On-site'), ('jdoe', 3, 'React'),
('jdoe', 4, 'Remote'), ('jdoe', 4, 'UI/UX'),
('jdoe', 5, 'Remote'), ('jdoe', 5, 'Ruby'),
('jdoe', 7, 'Remote'), ('jdoe', 7, 'Design Systems'),
('jdoe', 8, 'Hybrid'), ('jdoe', 8, 'Elixir'),
('asmith', 1, 'On-site'), ('asmith', 1, 'AWS'),
('asmith', 2, 'On-site'), ('asmith', 2, 'SQL'), ('asmith', 2, 'Kafka'),
('asmith', 3, 'Hybrid'), ('asmith', 3, 'Python'), ('asmith', 3, 'PyTorch'),
('asmith', 4, 'Hybrid'), ('asmith', 4, 'Tableau'),
('asmith', 6, 'Remote'), ('asmith', 6, 'AI'), ('asmith', 6, 'C++'),
('bwayne', 1, 'Remote'), ('bwayne', 1, 'B2B'),
('bwayne', 2, 'Hybrid'), ('bwayne', 2, 'API'),
('bwayne', 3, 'On-site'), ('bwayne', 3, 'Search'),
('bwayne', 4, 'Hybrid'), ('bwayne', 4, 'Growth'), ('bwayne', 4, 'A/B Testing'),
('bwayne', 5, 'On-site'), ('bwayne', 5, 'Social'),
('pparker', 1, 'On-site'), ('pparker', 1, 'C'), ('pparker', 1, 'RTOS'),
('pparker', 2, 'On-site'), ('pparker', 2, 'C++'), ('pparker', 2, 'Space'),
('pparker', 3, 'Hybrid'), ('pparker', 3, 'Go'), ('pparker', 3, 'Microservices'),
('pparker', 5, 'Remote'), ('pparker', 5, 'Java'), ('pparker', 5, 'React'),
('tstark', 1, 'Travel'), ('tstark', 1, 'Java'), ('tstark', 1, 'GovTech'),
('tstark', 2, 'Remote'), ('tstark', 2, 'Scala'), ('tstark', 2, 'Spark'),
('tstark', 3, 'Hybrid'), ('tstark', 3, 'C++'), ('tstark', 3, 'Databases'),
('nromanoff', 1, 'Remote'), ('nromanoff', 1, 'Python'), ('nromanoff', 1, 'Cryptography'),
('nromanoff', 2, 'Hybrid'), ('nromanoff', 2, 'WebSec'),
('nromanoff', 4, 'Remote'), ('nromanoff', 4, 'NetworkSec'),
('bbanner', 1, 'On-site'), ('bbanner', 1, 'Physics'), ('bbanner', 1, 'Qiskit'),
('bbanner', 2, 'Hybrid'), ('bbanner', 2, 'F#'), ('bbanner', 2, 'Research'),
('srogers', 1, 'On-site'), ('srogers', 1, 'Logistics'),
('srogers', 2, 'Hybrid'), ('srogers', 2, 'Management'),
('ckent', 1, 'Hybrid'), ('ckent', 1, 'Writing'), ('ckent', 1, 'Finance'),
('ckent', 2, 'Remote'), ('ckent', 2, 'Strategy'),
('dprince', 1, 'Hybrid'), ('dprince', 1, 'Policy'), ('dprince', 1, 'Safety'),
('dprince', 3, 'On-site'), ('dprince', 3, 'Legal');


-- 7. Insert Interviews (40 Interview Rounds)
INSERT INTO `interview` (`username`, `app_number`, `interview_round`, `interview_date`, `interview_type`) VALUES
('jdoe', 1, 1, '2026-03-10', 'Phone Screen'), ('jdoe', 1, 2, '2026-03-15', 'Technical Assessment'), ('jdoe', 1, 3, '2026-03-22', 'On-site (Virtual)'),
('jdoe', 2, 1, '2026-03-05', 'Behavioral'), ('jdoe', 2, 2, '2026-03-12', 'System Design'),
('jdoe', 3, 1, '2026-03-15', 'CoderPad'),
('jdoe', 7, 1, '2026-03-18', 'Recruiter Screen'),
('asmith', 1, 1, '2026-02-25', 'Online Assessment'),
('asmith', 2, 1, '2026-03-05', 'Technical Phone'), ('asmith', 2, 2, '2026-03-15', 'Take-home Assignment'),
('asmith', 3, 1, '2026-03-01', 'Hiring Manager'), ('asmith', 3, 2, '2026-03-10', 'Final Panel'),
('asmith', 6, 1, '2026-03-10', 'Phone Screen'), ('asmith', 6, 2, '2026-03-20', 'Research Presentation'),
('bwayne', 1, 1, '2026-03-12', 'Product Sense'), ('bwayne', 1, 2, '2026-03-20', 'Execution/Metrics'),
('bwayne', 3, 1, '2026-03-15', 'Recruiter Screen'),
('bwayne', 4, 1, '2026-03-15', 'Final Presentation'), ('bwayne', 4, 2, '2026-03-18', 'Offer Chat'),
('pparker', 1, 1, '2026-02-20', 'C Programming Test'),
('pparker', 2, 1, '2026-02-25', 'Engineering Manager'), ('pparker', 2, 2, '2026-03-05', 'Panel'), ('pparker', 2, 3, '2026-03-15', 'VP Interview'),
('pparker', 5, 1, '2026-03-05', 'Values Round'), ('pparker', 5, 2, '2026-03-10', 'Tech Lead'),
('tstark', 1, 1, '2026-01-25', 'Architecture Round'), ('tstark', 1, 2, '2026-02-05', 'Executive Interview'),
('tstark', 2, 1, '2026-02-01', 'Deep Systems'), ('tstark', 2, 2, '2026-02-15', 'Coding'),
('tstark', 3, 1, '2026-02-05', 'Phone Screen'),
('nromanoff', 1, 1, '2026-03-10', 'CTF Challenge'), ('nromanoff', 1, 2, '2026-03-20', 'Whiteboarding'),
('nromanoff', 4, 1, '2026-03-15', 'Manager Chat'),
('bbanner', 1, 1, '2026-02-15', 'Research Review'), ('bbanner', 1, 2, '2026-03-01', 'Committee'),
('bbanner', 2, 1, '2026-02-20', 'Director Sync'),
('srogers', 1, 1, '2026-03-10', 'Leadership Principles'), ('srogers', 1, 2, '2026-03-20', 'Case Study'),
('ckent', 1, 1, '2026-03-10', 'Editor Interview'),
('dprince', 1, 1, '2026-03-10', 'Scenario Analysis');


-- 8. Insert Subclasses (Exactly 50 records matching the 50 applications)
-- Full Time (25 apps)
INSERT INTO `full_time` (`username`, `app_number`, `equity_offered`, `sign_on_bonus`) VALUES
('jdoe', 1, 'TBD', NULL), ('jdoe', 2, '150 RSUs', 15000), ('jdoe', 3, NULL, NULL), ('jdoe', 4, NULL, NULL), ('jdoe', 5, NULL, NULL),
('asmith', 1, NULL, NULL), ('asmith', 2, 'TBD', NULL), ('asmith', 3, '200 RSUs', 20000), ('asmith', 4, NULL, NULL), ('asmith', 5, NULL, NULL),
('bwayne', 1, 'TBD', NULL), ('bwayne', 2, NULL, NULL), ('bwayne', 3, NULL, NULL), ('bwayne', 4, 'Stock Options', 10000), ('bwayne', 5, NULL, NULL),
('pparker', 1, NULL, NULL), ('pparker', 2, 'TBD', NULL), ('pparker', 3, NULL, NULL), ('pparker', 4, NULL, NULL), ('pparker', 5, '100 RSUs', 5000),
('tstark', 1, '500 RSUs', 50000), ('tstark', 2, 'TBD', NULL), ('tstark', 3, NULL, NULL),
('nromanoff', 1, 'TBD', NULL), ('nromanoff', 4, '50 RSUs', NULL);


-- Internship (25 apps)
INSERT INTO `internship` (`username`, `app_number`, `duration_months`) VALUES
('jdoe', 6, 3), ('jdoe', 7, 3), ('jdoe', 8, 4), ('jdoe', 9, 3),
('asmith', 6, 6), ('asmith', 7, 3),
('bwayne', 6, 3), ('bwayne', 7, 4),
('pparker', 6, 3),
('tstark', 4, 3), ('tstark', 5, 3),
('nromanoff', 2, 4), ('nromanoff', 3, 3),
('bbanner', 1, 6), ('bbanner', 2, 12), ('bbanner', 3, 3),
('srogers', 1, 3), ('srogers', 2, 3), ('srogers', 3, 3),
('ckent', 1, 3), ('ckent', 2, 3), ('ckent', 3, 6),
('dprince', 1, 4), ('dprince', 2, 3), ('dprince', 3, 3);


-- 9. Insert Communicates_With (20 relationships)
INSERT INTO `communicates_with` (`username`, `recruiter_id`) VALUES
('jdoe', 1), ('jdoe', 2), ('jdoe', 3), ('jdoe', 8),
('asmith', 4), ('asmith', 7), ('asmith', 9),
('bwayne', 3), ('bwayne', 6), ('bwayne', 1),
('pparker', 11), ('pparker', 12), ('pparker', 14),
('tstark', 14), ('tstark', 15),
('nromanoff', 10), ('nromanoff', 11),
('srogers', 5), ('srogers', 11),
('ckent', 7);


-- 10. Insert Submitted_With (35 Document Attachments)
INSERT INTO `submitted_with` (`document_id`, `username`, `app_number`) VALUES
(1, 'jdoe', 2), (1, 'jdoe', 3), (1, 'jdoe', 4), (1, 'jdoe', 8),
(2, 'jdoe', 1), (2, 'jdoe', 5), (2, 'jdoe', 7), (2, 'jdoe', 9),
(3, 'jdoe', 1), (20, 'jdoe', 6),
(4, 'asmith', 1), (4, 'asmith', 2), (4, 'asmith', 4), (4, 'asmith', 7),
(5, 'asmith', 3), (5, 'asmith', 5), (5, 'asmith', 6),
(6, 'bwayne', 1), (6, 'bwayne', 2), (6, 'bwayne', 3), (6, 'bwayne', 4), (6, 'bwayne', 5), (6, 'bwayne', 7),
(7, 'bwayne', 1), (7, 'bwayne', 4),
(9, 'pparker', 3), (9, 'pparker', 4), (9, 'pparker', 6),
(15, 'pparker', 5),
(10, 'tstark', 1), (10, 'tstark', 2), (10, 'tstark', 3),
(11, 'nromanoff', 1), (11, 'nromanoff', 2), (11, 'nromanoff', 3);
