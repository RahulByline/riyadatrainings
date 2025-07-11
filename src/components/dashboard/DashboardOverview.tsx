import React, { useEffect, useState } from 'react';
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  BookOpenIcon, 
  KeyIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import { format } from 'date-fns';

interface DashboardStats {
  total_companies: number;
  total_users: number;
  total_courses: number;
  total_licenses: number;
  active_companies: number;
  suspended_companies: number;
  recent_activity: any[];
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Use the existing Moodle API service instead of Supabase
      const [courses, users, companies] = await Promise.all([
        apiService.getAllCourses(),
        apiService.getAllUsers(),
        apiService.getCompanies()
      ]);

      const stats: DashboardStats = {
        total_companies: companies.length,
        total_users: users.length,
        total_courses: courses.length,
        total_licenses: Math.floor(Math.random() * 100) + 50, // Mock data
        active_companies: companies.filter(c => c.status === 'active').length,
        suspended_companies: companies.filter(c => c.status !== 'active').length,
        recent_activity: [
          {
            id: '1',
            action: 'create',
            entity_type: 'course',
            user: { firstname: 'John', lastname: 'Doe' },
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            action: 'update',
            entity_type: 'user',
            user: { firstname: 'Jane', lastname: 'Smith' },
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      };

      setStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set fallback stats if API calls fail
      setStats({
        total_companies: 0,
        total_users: 0,
        total_courses: 0,
        total_licenses: 0,
        active_companies: 0,
        suspended_companies: 0,
        recent_activity: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      name: 'Total Companies',
      value: stats.total_companies,
      icon: BuildingOfficeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: stats.active_companies - stats.suspended_companies,
      changeType: stats.active_companies > stats.suspended_companies ? 'increase' : 'decrease'
    },
    {
      name: 'Total Users',
      value: stats.total_users,
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 12,
      changeType: 'increase'
    },
    {
      name: 'Total Courses',
      value: stats.total_courses,
      icon: BookOpenIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 5,
      changeType: 'increase'
    },
    {
      name: 'Active Licenses',
      value: stats.total_licenses,
      icon: KeyIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 8,
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your Iomad multi-tenancy management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value.toLocaleString()}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(stat.change)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Company Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Company Status
            </h3>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Active Companies</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.active_companies}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Suspended Companies</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.suspended_companies}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-5 space-y-3">
              {stats.recent_activity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {activity.user?.firstname} {activity.user?.lastname}
                      </span>{' '}
                      {activity.action} {activity.entity_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recent_activity.length === 0 && (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}