-- 1. Create Independent Tables First
CREATE TABLE app_user (
   username VARCHAR(50) PRIMARY KEY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL
);


CREATE TABLE company (
   company_name VARCHAR(100) PRIMARY KEY
);


-- 2. Create Tables with 1 Foreign Key Dependency
CREATE TABLE recruiter (
   recruiter_id INT PRIMARY KEY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   email VARCHAR(100),
   company_name VARCHAR(100),
   FOREIGN KEY (company_name) REFERENCES company(company_name) ON DELETE SET NULL
);


CREATE TABLE document (
   document_id INT PRIMARY KEY,
   title VARCHAR(100) NOT NULL,
   doc_type VARCHAR(50),
   username VARCHAR(50),
   FOREIGN KEY (username) REFERENCES app_user(username) ON DELETE CASCADE
);


-- 3. Create Weak Entity
CREATE TABLE application (
   username VARCHAR(50),
   app_number INT,
   company_name VARCHAR(100),
   job_title VARCHAR(100) NOT NULL,
   app_date DATE,
   status VARCHAR(50),
   salary DECIMAL(10,2),
   notes TEXT,
   PRIMARY KEY (username, app_number),
   FOREIGN KEY (username) REFERENCES app_user(username) ON DELETE CASCADE,
   FOREIGN KEY (company_name) REFERENCES company(company_name) ON DELETE SET NULL
);


-- 4. Create Tables Depending on Application
CREATE TABLE interview (
   username VARCHAR(50),
   app_number INT,
   interview_round INT,
   interview_date DATE,
   interview_type VARCHAR(50),
   PRIMARY KEY (username, app_number, interview_round),
   FOREIGN KEY (username, app_number) REFERENCES application(username, app_number) ON DELETE CASCADE
);


CREATE TABLE application_tags (
   username VARCHAR(50),
   app_number INT,
   tags VARCHAR(50),
   PRIMARY KEY (username, app_number, tags),
   FOREIGN KEY (username, app_number) REFERENCES application(username, app_number) ON DELETE CASCADE
);


CREATE TABLE internship (
   username VARCHAR(50),
   app_number INT,
   duration_months INT,
   PRIMARY KEY (username, app_number),
   FOREIGN KEY (username, app_number) REFERENCES application(username, app_number) ON DELETE CASCADE
);


CREATE TABLE full_time (
   username VARCHAR(50),
   app_number INT,
   equity_offered VARCHAR(100),
   sign_on_bonus DECIMAL(10,2),
   PRIMARY KEY (username, app_number),
   FOREIGN KEY (username, app_number) REFERENCES application(username, app_number) ON DELETE CASCADE
);


-- 5. Create Many-to-Many Relationship Tables
CREATE TABLE communicates_with (
   username VARCHAR(50),
   recruiter_id INT,
   PRIMARY KEY (username, recruiter_id),
   FOREIGN KEY (username) REFERENCES app_user(username) ON DELETE CASCADE,
   FOREIGN KEY (recruiter_id) REFERENCES recruiter(recruiter_id) ON DELETE CASCADE
);


CREATE TABLE submitted_with (
   document_id INT,
   username VARCHAR(50),
   app_number INT,
   PRIMARY KEY (document_id, username, app_number),
   FOREIGN KEY (document_id) REFERENCES document(document_id) ON DELETE CASCADE,
   FOREIGN KEY (username, app_number) REFERENCES application(username, app_number) ON DELETE CASCADE
);
