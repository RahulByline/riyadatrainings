// src/services/apiService.ts
import axios from 'axios';
import { Course, School } from '../types';

const API_URL = import.meta.env.VITE_MOODLE_API_URL;

export async function getAllCourses(): Promise<Course[]> {
  try {
    const params = new URLSearchParams();
    params.append('wstoken', 'YOUR_HARDCODED_TOKEN'); // <-- Replace with your real token
    params.append('wsfunction', 'core_course_get_courses');
    params.append('moodlewsrestformat', 'json');
    // No options[ids] to fetch all courses

    const { data } = await axios.post(API_URL, params);

    // Moodle error responses are objects with 'exception' field
    if (data && typeof data === 'object' && 'exception' in data) {
      throw new Error(
        `Moodle API Error: ${data.errorcode || ''} - ${data.message || 'Unknown error'}`
      );
    }

    // FIX: Use data.courses
    if (!data || !Array.isArray(data.courses)) {
      throw new Error('Invalid response format from Moodle API');
    }

    return data.courses.map((course: any) => ({
      id: course.id,
      fullname: course.fullname,
      shortname: course.shortname,
      summary: course.summary,
      visible: course.visible,
      categoryid: course.categoryid,
      categoryname: course.categoryname,
      startdate: course.startdate,
      enddate: course.enddate,
      // add other fields as needed
    }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch courses');
  }
}

// Fetch all companies (schools) from Iomad
export const getAllCompanies = async () => {
  const url = 'https://iomad.bylinelms.com/webservice/rest/server.php';
  const params = new URLSearchParams();
  params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633');
  params.append('wsfunction', 'block_iomad_company_admin_get_companies');
  params.append('moodlewsrestformat', 'json');
  params.append('criteria[0][key]', 'name');
  params.append('criteria[0][value]', '');

  const response = await axios.post(url, params);
  return response.data.companies || [];
};

export async function getAllSchools() {
  const response = await axios.post(API_URL, new URLSearchParams({
    wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633', // Replace with your real token
    wsfunction: 'block_iomad_company_admin_get_companies',
    moodlewsrestformat: 'json'
  }));

  if (!response || !response.data) {
    throw new Error('Network error while fetching schools');
  }

  // Usually: { companies: [...] }
  return response.data.companies || [];
} 