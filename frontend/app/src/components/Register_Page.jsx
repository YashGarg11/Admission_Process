import axios from 'axios';
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import config from '../config';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_Password: '',
    mobile: '',
    dob: '',
    gender: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_Password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(`${config.API_BASE_URL}/auth/register`, formData);

      setSuccess('Registration successful! You can now log in.');
      setError('');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirm_Password: '',
        mobile: '',
        dob: '',
        gender: '',
        address: ''
      });

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const pageRef = useRef(null);
  const formRef = useRef(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(shapesRef.current,
      { opacity: 0, scale: 0.5, y: 100 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", repeat: -1, yoyo: true }
    );

    gsap.fromTo(formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const addToRefs = (el) => {
    if (el && !shapesRef.current.includes(el)) {
      shapesRef.current.push(el);
    }
  };

  return (
    <div ref={pageRef} className="flex items-center justify-center min-h-screen bg-blue-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-950"></div>

      {/* Animated background shapes */}
      {['top-20 right-40', 'bottom-40 left-20', 'top-40 left-60', 'bottom-60 right-20', 'top-1/2 left-1/4', 'top-1/4 right-1/3', 'bottom-1/3 right-1/4'].map((pos, i) => (
        <div
          key={i}
          ref={addToRefs}
          className={`absolute ${pos} w-24 h-24 rounded-full bg-blue-400 opacity-30 blur-sm`}
          style={{
            borderRadius: '70% 30% 50% 50%/30% 50% 50% 70%',
            boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
          }}
        ></div>
      ))}

      {/* Registration card */}
      <div ref={formRef} className="bg-blue-400/30 backdrop-blur-md p-8 rounded-lg shadow-xl w-[500px] text-white z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-6">Your Logo</h2>
          <h1 className="text-2xl font-bold">Create Account</h1>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="enter your name"
              className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
            />
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm_Password"
                value={formData.confirm_Password}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="enter your mobile no."
                className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded bg-blue-300 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white resize-none"
              rows="2"
            />
          </div>

          <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white p-2 rounded transition-all">
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200 mb-3">or continue with</p>
          <div className="flex justify-center space-x-4">
            <button><FaGoogle size={40} color='yellow' /></button>
            <button><FaGithub size={40} color="black" /></button>
            <button><FaFacebook size={40} color="lightblue" /></button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-blue-200">Already have an account? </span>
          <a href="/login" className="text-white font-medium">Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
