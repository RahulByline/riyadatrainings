import { supabase } from '../lib/supabase';
import { Company, User, Course, Department, License, DashboardStats, ActivityLog } from '../types/iomad';

export class IomadApiService {
  // Company Management
  static async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getCompany(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('create', 'company', data.id, 'Company created');
    
    return data;
  }

  static async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('update', 'company', id, 'Company updated');
    
    return data;
  }

  static async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('delete', 'company', id, 'Company deleted');
  }

  static async suspendCompany(id: string, suspended: boolean): Promise<void> {
    await this.updateCompany(id, { suspended });
    
    // Log activity
    await this.logActivity(
      suspended ? 'suspend' : 'unsuspend', 
      'company', 
      id, 
      `Company ${suspended ? 'suspended' : 'unsuspended'}`
    );
  }

  // User Management
  static async getUsers(companyId?: string): Promise<User[]> {
    let query = supabase
      .from('users')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select(`
        *,
        company:companies(*)
      `)
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('create', 'user', data.id, 'User created');
    
    return data;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        company:companies(*)
      `)
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('update', 'user', id, 'User updated');
    
    return data;
  }

  // Course Management
  static async getCourses(companyId?: string): Promise<Course[]> {
    let query = supabase
      .from('courses')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select(`
        *,
        company:companies(*)
      `)
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('create', 'course', data.id, 'Course created');
    
    return data;
  }

  // License Management
  static async getLicenses(companyId?: string): Promise<License[]> {
    let query = supabase
      .from('licenses')
      .select(`
        *,
        company:companies(*),
        course:courses(*)
      `)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async createLicense(license: Omit<License, 'id' | 'created_at' | 'updated_at'>): Promise<License> {
    const { data, error } = await supabase
      .from('licenses')
      .insert([license])
      .select(`
        *,
        company:companies(*),
        course:courses(*)
      `)
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('create', 'license', data.id, 'License created');
    
    return data;
  }

  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    const [
      companiesResult,
      usersResult,
      coursesResult,
      licensesResult,
      activityResult
    ] = await Promise.all([
      supabase.from('companies').select('id, suspended'),
      supabase.from('users').select('id'),
      supabase.from('courses').select('id'),
      supabase.from('licenses').select('id'),
      supabase
        .from('activity_logs')
        .select(`
          *,
          user:users(*),
          company:companies(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    const companies = companiesResult.data || [];
    const activeCompanies = companies.filter(c => !c.suspended).length;
    const suspendedCompanies = companies.filter(c => c.suspended).length;

    return {
      total_companies: companies.length,
      total_users: usersResult.data?.length || 0,
      total_courses: coursesResult.data?.length || 0,
      total_licenses: licensesResult.data?.length || 0,
      active_companies: activeCompanies,
      suspended_companies: suspendedCompanies,
      recent_activity: activityResult.data || []
    };
  }

  // Activity Logging
  static async logActivity(
    action: string,
    entityType: string,
    entityId: string,
    details: string | Record<string, any>
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    await supabase
      .from('activity_logs')
      .insert([{
        action,
        entity_type: entityType,
        entity_id: entityId,
        user_id: user.id,
        company_id: user.user_metadata?.company_id || null,
        details: typeof details === 'string' ? { message: details } : details
      }]);
  }

  // Department Management
  static async getDepartments(companyId?: string): Promise<Department[]> {
    let query = supabase
      .from('departments')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async createDepartment(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert([department])
      .select(`
        *,
        company:companies(*)
      `)
      .single();
    
    if (error) throw error;
    
    // Log activity
    await this.logActivity('create', 'department', data.id, 'Department created');
    
    return data;
  }
}