export interface Company {
  id: string;
  name: string;
  shortname: string;
  city: string;
  country: string;
  theme: string;
  logo_url?: string;
  suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  company_id: string;
  department?: string;
  manager_id?: string;
  suspended: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Course {
  id: string;
  fullname: string;
  shortname: string;
  summary: string;
  company_id: string;
  category_id: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Department {
  id: string;
  name: string;
  shortname: string;
  company_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface License {
  id: string;
  name: string;
  company_id: string;
  course_id: string;
  allocation: number;
  used: number;
  valid_from: string;
  valid_to: string;
  created_at: string;
  updated_at: string;
  company?: Company;
  course?: Course;
}

export interface DashboardStats {
  total_companies: number;
  total_users: number;
  total_courses: number;
  total_licenses: number;
  active_companies: number;
  suspended_companies: number;
  recent_activity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  company_id: string;
  details: Record<string, any>;
  created_at: string;
  user?: User;
  company?: Company;
}