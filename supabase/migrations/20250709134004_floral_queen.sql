/*
  # Insert Sample Data for Iomad System

  1. Sample Companies
    - Create demo companies with different themes and locations

  2. Sample Users
    - Create users for each company with different roles

  3. Sample Courses
    - Create courses for companies

  4. Sample Departments
    - Create department structure

  5. Sample Licenses
    - Create license allocations
*/

-- Insert sample companies
INSERT INTO companies (name, shortname, city, country, theme, suspended) VALUES
('TechCorp Academy', 'techcorp', 'San Francisco', 'USA', 'technology', false),
('HealthCare Learning', 'healthcare', 'Boston', 'USA', 'healthcare', false),
('EduMax Institute', 'edumax', 'London', 'UK', 'education', false),
('Global Finance Training', 'globalfin', 'New York', 'USA', 'corporate', false),
('Manufacturing Skills', 'manufact', 'Detroit', 'USA', 'default', true);

-- Insert sample users
INSERT INTO users (username, email, firstname, lastname, company_id, department, suspended) VALUES
-- TechCorp Academy users
('john.admin', 'john.admin@techcorp.com', 'John', 'Smith', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'), 'Administration', false),
('jane.trainer', 'jane.trainer@techcorp.com', 'Jane', 'Doe', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'), 'Training', false),
('mike.student', 'mike.student@techcorp.com', 'Mike', 'Johnson', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'), 'Development', false),

-- HealthCare Learning users
('sarah.admin', 'sarah.admin@healthcare.com', 'Sarah', 'Wilson', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'), 'Administration', false),
('dr.brown', 'dr.brown@healthcare.com', 'Robert', 'Brown', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'), 'Medical', false),

-- EduMax Institute users
('emma.admin', 'emma.admin@edumax.com', 'Emma', 'Davis', 
 (SELECT id FROM companies WHERE shortname = 'edumax'), 'Administration', false),
('prof.taylor', 'prof.taylor@edumax.com', 'James', 'Taylor', 
 (SELECT id FROM companies WHERE shortname = 'edumax'), 'Academic', false);

-- Insert sample departments
INSERT INTO departments (name, shortname, company_id) VALUES
-- TechCorp departments
('Administration', 'admin', (SELECT id FROM companies WHERE shortname = 'techcorp')),
('Development', 'dev', (SELECT id FROM companies WHERE shortname = 'techcorp')),
('Training', 'training', (SELECT id FROM companies WHERE shortname = 'techcorp')),
('Quality Assurance', 'qa', (SELECT id FROM companies WHERE shortname = 'techcorp')),

-- HealthCare departments
('Administration', 'admin', (SELECT id FROM companies WHERE shortname = 'healthcare')),
('Medical Staff', 'medical', (SELECT id FROM companies WHERE shortname = 'healthcare')),
('Nursing', 'nursing', (SELECT id FROM companies WHERE shortname = 'healthcare')),

-- EduMax departments
('Administration', 'admin', (SELECT id FROM companies WHERE shortname = 'edumax')),
('Academic Staff', 'academic', (SELECT id FROM companies WHERE shortname = 'edumax')),
('Student Services', 'services', (SELECT id FROM companies WHERE shortname = 'edumax'));

-- Insert sample courses
INSERT INTO courses (fullname, shortname, summary, company_id, visible) VALUES
-- TechCorp courses
('JavaScript Fundamentals', 'js-fund', 'Learn the basics of JavaScript programming', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'), true),
('React Development', 'react-dev', 'Build modern web applications with React', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'), true),
('Node.js Backend', 'node-backend', 'Server-side development with Node.js', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'), true),

-- HealthCare courses
('Patient Safety Protocols', 'patient-safety', 'Essential safety procedures for patient care', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'), true),
('Medical Ethics', 'med-ethics', 'Ethical considerations in healthcare', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'), true),
('Emergency Procedures', 'emergency', 'Critical emergency response training', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'), true),

-- EduMax courses
('Teaching Methodologies', 'teach-methods', 'Modern approaches to education', 
 (SELECT id FROM companies WHERE shortname = 'edumax'), true),
('Student Assessment', 'assessment', 'Effective student evaluation techniques', 
 (SELECT id FROM companies WHERE shortname = 'edumax'), true);

-- Insert sample licenses
INSERT INTO licenses (name, company_id, course_id, allocation, used, valid_from, valid_to) VALUES
-- TechCorp licenses
('JavaScript Training License', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'),
 (SELECT id FROM courses WHERE shortname = 'js-fund' AND company_id = (SELECT id FROM companies WHERE shortname = 'techcorp')),
 50, 23, '2024-01-01', '2024-12-31'),

('React Development License', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'),
 (SELECT id FROM courses WHERE shortname = 'react-dev' AND company_id = (SELECT id FROM companies WHERE shortname = 'techcorp')),
 30, 15, '2024-01-01', '2024-12-31'),

-- HealthCare licenses
('Patient Safety License', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'),
 (SELECT id FROM courses WHERE shortname = 'patient-safety' AND company_id = (SELECT id FROM companies WHERE shortname = 'healthcare')),
 100, 67, '2024-01-01', '2024-12-31'),

('Medical Ethics License', 
 (SELECT id FROM companies WHERE shortname = 'healthcare'),
 (SELECT id FROM courses WHERE shortname = 'med-ethics' AND company_id = (SELECT id FROM companies WHERE shortname = 'healthcare')),
 75, 42, '2024-01-01', '2024-12-31');

-- Insert sample activity logs
INSERT INTO activity_logs (action, entity_type, entity_id, user_id, company_id, details) VALUES
('create', 'company', 
 (SELECT id FROM companies WHERE shortname = 'techcorp'),
 (SELECT id FROM users WHERE username = 'john.admin'),
 (SELECT id FROM companies WHERE shortname = 'techcorp'),
 '{"message": "Company created successfully"}'),

('create', 'course', 
 (SELECT id FROM courses WHERE shortname = 'js-fund'),
 (SELECT id FROM users WHERE username = 'jane.trainer'),
 (SELECT id FROM companies WHERE shortname = 'techcorp'),
 '{"message": "JavaScript Fundamentals course created"}'),

('create', 'user', 
 (SELECT id FROM users WHERE username = 'mike.student'),
 (SELECT id FROM users WHERE username = 'john.admin'),
 (SELECT id FROM companies WHERE shortname = 'techcorp'),
 '{"message": "New user added to system"}'),

('suspend', 'company', 
 (SELECT id FROM companies WHERE shortname = 'manufact'),
 (SELECT id FROM users WHERE username = 'john.admin'),
 (SELECT id FROM companies WHERE shortname = 'manufact'),
 '{"message": "Company suspended due to non-payment"}');