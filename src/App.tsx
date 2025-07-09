import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import CompanyList from './components/companies/CompanyList';
import CompanyForm from './components/companies/CompanyForm';
import UserList from './components/users/UserList';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="companies/new" element={<CompanyForm />} />
            <Route path="companies/:id/edit" element={<CompanyForm />} />
            <Route path="users" element={<UserList />} />
            <Route path="courses" element={<div className="p-8 text-center text-gray-500">Courses management coming soon...</div>} />
            <Route path="licenses" element={<div className="p-8 text-center text-gray-500">License management coming soon...</div>} />
            <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings coming soon...</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;