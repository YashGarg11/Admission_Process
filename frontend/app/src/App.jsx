import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AcademicDetailsForm from './components/academic_details';
import Admission_Status from './components/admission_status';
import AdmissionCover from './components/cover_page';
import AdmissionDashboard from './components/dashboard';
import PersonalDetailsForm from './components/document_personal';
import HomePage from './components/home_page';
import LoginPage from './components/login_page';
import RegisterPage from './components/Register_Page';
import './index.css';
import ViewStudent from './pages/view_student';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000); // 7 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <AdmissionCover />}
      {!isLoading && (
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<AdmissionDashboard />} />
              <Route path="/document_personal" element={<PersonalDetailsForm />} />
              <Route path="/admission/academic-details" element={<AcademicDetailsForm />} />
              <Route path="/view_student/:id" element={<ViewStudent />} />
              <Route path="/admission_Status" element={<Admission_Status />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
};

export default App;