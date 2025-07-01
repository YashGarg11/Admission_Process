// src/pages/Course.jsx

import { gsap } from 'gsap';
import { AlertTriangle, ArrowRight, BookOpen, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Animation on mount
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

  const handleSubmit = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      setSuccess('');
      return;
    }

    try {
      const res = await api.post('/admission/course', {
        course: selectedCourse,
      });

      setSuccess('Course selected successfully!');
      setError('');

      setTimeout(() => {
        navigate('/document_personal');
      }, 1000);
    } catch (err) {
      setError('Failed to submit course');
      setSuccess('');
      console.error(err);
    }
  };

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
