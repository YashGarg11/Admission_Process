import axios from 'axios';
import { gsap } from 'gsap';
import { AlertTriangle, ArrowRight, BookOpen, Check, Loader } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config'; // Make sure config.API_BASE_URL is correct

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Animate entry
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 1,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
  }, []);

  // Static course list
  useEffect(() => {
    setCourses([
      'Computer Science Engineering (CSE)',
      'Information Technology (IT)',
      'Electronics and Communication (ECE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering (CE)',
    ]);
  }, []);

  // Check authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/auth/check-session`, {
          withCredentials: true,
        });

        if (response.data.user) {
          setUserInfo(response.data.user);
          setIsAuthenticated(true);
          console.log('Authenticated user:', response.data.user);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setError('Please login to continue.');
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!isAuthenticated || !userInfo) {
      setError('Authentication failed. Please login again.');
      return;
    }

    if (!selectedCourse) {
      setError('Please select a course');
      setSuccess('');
      return;
    }

    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/admission/course`,
        { course: selectedCourse },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Course selected successfully!');
      setError('');

      setTimeout(() => {
        navigate('/document_personal');
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit course. Try again.'
      );
      setSuccess('');
      console.error('Submission error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <p className="ml-3 text-gray-600">Verifying session...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-w-md mx-auto mt-10 p-6 bg-white/90 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="text-blue-600" />
        Select Your Course
      </h2>

      <select
        className="w-full border border-gray-800 rounded-lg px-4 py-2"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">-- Select a Course --</option>
        {courses.map((course, idx) => (
          <option key={idx} value={course}>
            {course}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-2 text-red-600 flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </p>
      )}

      {success && (
        <p className="mt-2 text-green-600 flex items-center gap-2">
          <Check size={16} /> {success}
        </p>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300"
      >
        Continue <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default Course;
