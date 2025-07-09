import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IomadApiService } from '../../services/iomadApi';
import { Company } from '../../types/iomad';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Company name is required'),
  shortname: yup.string().required('Short name is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  theme: yup.string().required('Theme is required'),
  logo_url: yup.string().url('Must be a valid URL').nullable(),
  suspended: yup.boolean()
});

type FormData = yup.InferType<typeof schema>;

export default function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      suspended: false
    }
  });

  useEffect(() => {
    if (isEditing && id) {
      loadCompany(id);
    }
  }, [id, isEditing]);

  const loadCompany = async (companyId: string) => {
    try {
      const company = await IomadApiService.getCompany(companyId);
      if (company) {
        reset({
          name: company.name,
          shortname: company.shortname,
          city: company.city,
          country: company.country,
          theme: company.theme,
          logo_url: company.logo_url || '',
          suspended: company.suspended
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
      toast.error('Failed to load company');
      navigate('/admin/companies');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEditing && id) {
        await IomadApiService.updateCompany(id, data);
        toast.success('Company updated successfully');
      } else {
        await IomadApiService.createCompany(data);
        toast.success('Company created successfully');
      }
      navigate('/admin/companies');
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Company' : 'Create Company'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? 'Update company information' : 'Add a new company to your Iomad system'}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="shortname" className="block text-sm font-medium text-gray-700">
                Short Name *
              </label>
              <input
                type="text"
                id="shortname"
                {...register('shortname')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.shortname && (
                <p className="mt-1 text-sm text-red-600">{errors.shortname.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                id="city"
                {...register('city')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                type="text"
                id="country"
                {...register('country')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Theme *
              </label>
              <select
                id="theme"
                {...register('theme')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a theme</option>
                <option value="default">Default</option>
                <option value="corporate">Corporate</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
              </select>
              {errors.theme && (
                <p className="mt-1 text-sm text-red-600">{errors.theme.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                id="logo_url"
                {...register('logo_url')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/logo.png"
              />
              {errors.logo_url && (
                <p className="mt-1 text-sm text-red-600">{errors.logo_url.message}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="suspended"
                {...register('suspended')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="suspended" className="ml-2 block text-sm text-gray-900">
                Suspend this company
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/companies')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Company' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}