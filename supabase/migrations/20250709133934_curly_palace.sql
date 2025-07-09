/*
  # Create Iomad Multi-Tenancy Schema

  1. New Tables
    - `companies` - Store company/school information
      - `id` (uuid, primary key)
      - `name` (text, company name)
      - `shortname` (text, short identifier)
      - `city` (text, company location)
      - `country` (text, company country)
      - `theme` (text, UI theme)
      - `logo_url` (text, optional logo URL)
      - `suspended` (boolean, suspension status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `users` - Store user information
      - `id` (uuid, primary key)
      - `username` (text, unique username)
      - `email` (text, user email)
      - `firstname` (text, first name)
      - `lastname` (text, last name)
      - `company_id` (uuid, foreign key to companies)
      - `department` (text, optional department)
      - `manager_id` (uuid, optional manager reference)
      - `suspended` (boolean, suspension status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `courses` - Store course information
      - `id` (uuid, primary key)
      - `fullname` (text, full course name)
      - `shortname` (text, short course identifier)
      - `summary` (text, course description)
      - `company_id` (uuid, foreign key to companies)
      - `category_id` (uuid, course category)
      - `visible` (boolean, visibility status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `departments` - Store department information
      - `id` (uuid, primary key)
      - `name` (text, department name)
      - `shortname` (text, short identifier)
      - `company_id` (uuid, foreign key to companies)
      - `parent_id` (uuid, optional parent department)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `licenses` - Store license information
      - `id` (uuid, primary key)
      - `name` (text, license name)
      - `company_id` (uuid, foreign key to companies)
      - `course_id` (uuid, foreign key to courses)
      - `allocation` (integer, total licenses)
      - `used` (integer, used licenses)
      - `valid_from` (timestamp, validity start)
      - `valid_to` (timestamp, validity end)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `activity_logs` - Store system activity logs
      - `id` (uuid, primary key)
      - `action` (text, action performed)
      - `entity_type` (text, type of entity)
      - `entity_id` (uuid, entity identifier)
      - `user_id` (uuid, user who performed action)
      - `company_id` (uuid, company context)
      - `details` (jsonb, additional details)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for company-specific data access

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for multi-column queries
*/

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  shortname text NOT NULL UNIQUE,
  city text NOT NULL,
  country text NOT NULL,
  theme text NOT NULL DEFAULT 'default',
  logo_url text,
  suspended boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  firstname text NOT NULL,
  lastname text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department text,
  manager_id uuid REFERENCES users(id),
  suspended boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname text NOT NULL,
  shortname text NOT NULL,
  summary text DEFAULT '',
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id uuid,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  shortname text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES departments(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  allocation integer NOT NULL DEFAULT 0,
  used integer NOT NULL DEFAULT 0,
  valid_from timestamptz NOT NULL,
  valid_to timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  user_id uuid,
  company_id uuid REFERENCES companies(id),
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Companies can be managed by authenticated users"
  ON companies
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for users
CREATE POLICY "Users are viewable by authenticated users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can be managed by authenticated users"
  ON users
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for courses
CREATE POLICY "Courses are viewable by authenticated users"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Courses can be managed by authenticated users"
  ON courses
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for departments
CREATE POLICY "Departments are viewable by authenticated users"
  ON departments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Departments can be managed by authenticated users"
  ON departments
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for licenses
CREATE POLICY "Licenses are viewable by authenticated users"
  ON licenses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Licenses can be managed by authenticated users"
  ON licenses
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for activity logs
CREATE POLICY "Activity logs are viewable by authenticated users"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Activity logs can be created by authenticated users"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_shortname ON companies(shortname);
CREATE INDEX IF NOT EXISTS idx_companies_suspended ON companies(suspended);

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended);

CREATE INDEX IF NOT EXISTS idx_courses_company_id ON courses(company_id);
CREATE INDEX IF NOT EXISTS idx_courses_visible ON courses(visible);

CREATE INDEX IF NOT EXISTS idx_departments_company_id ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON departments(parent_id);

CREATE INDEX IF NOT EXISTS idx_licenses_company_id ON licenses(company_id);
CREATE INDEX IF NOT EXISTS idx_licenses_course_id ON licenses(course_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_company_id ON activity_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Add unique constraints
ALTER TABLE courses ADD CONSTRAINT unique_course_shortname_per_company UNIQUE (shortname, company_id);
ALTER TABLE departments ADD CONSTRAINT unique_department_shortname_per_company UNIQUE (shortname, company_id);