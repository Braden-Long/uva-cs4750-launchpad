-- 1. TRIGGER: Automate Pipeline Status Updates


DELIMITER $$


CREATE OR REPLACE TRIGGER trg_update_status_on_interview
AFTER INSERT ON interview
FOR EACH ROW
BEGIN
   UPDATE application
   SET status = 'Interviewing'
   WHERE username = NEW.username
     AND app_number = NEW.app_number
     AND status NOT IN ('Offered', 'Accepted', 'Rejected', 'Withdrawn');
END
$$


DELIMITER ;




-- 2. STORED PROCEDURE: Fetch Dashboard Analytics


DELIMITER $$


CREATE OR REPLACE PROCEDURE GetDashboardAnalytics(IN p_username VARCHAR(50))
BEGIN
   SELECT
       (SELECT COUNT(*)
        FROM application
        WHERE username = p_username) AS total_applications,

       (SELECT COUNT(*)
        FROM application
        WHERE username = p_username AND status = 'Offered') AS active_offers,

       (SELECT COUNT(*)
        FROM interview
        WHERE username = p_username AND interview_date >= CURDATE()) AS pending_interviews;
END
$$


DELIMITER ;
