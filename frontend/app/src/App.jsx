import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AcademicDetailsForm from './components/academic_details';
import AdmissionDashboard from './components/dashboard';
import PersonalDetailsForm from './components/document_personal';
import HomePage from './components/home_page';
import LoginPage from './components/login_page';
import RegisterPage from './components/Register_Page';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<AdmissionDashboard />} />
          <Route path="/document_personal" element={<PersonalDetailsForm />} />
          <Route path="/admission/academic-details" element={<AcademicDetailsForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;