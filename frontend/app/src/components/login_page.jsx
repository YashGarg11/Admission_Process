import axios from 'axios';
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import config from '../config';




const LoginPage = () => {


  // Inside your LoginPage component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault(); // Stop form from reloading the page

    try {
      console.log(`${config.API_BASE_URL}/auth/login`);
      const res = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = res.data;

      // Store both token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Stored user data:', user);

      setError('');

      // Redirect based on user role
      if (user.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/home';
      }

      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please login again.');
        window.location.href = '/login';
      }, 60 * 60 * 1000);

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
    // Animate the background shapes
    gsap.fromTo(shapesRef.current,
      {
        opacity: 0,
        scale: 0.5,
        y: 100
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        repeat: -1,
        yoyo: true
      }
    );

    // Animate the login form
    gsap.fromTo(formRef.current,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out"
      }
    );
  }, []);

  // Add shape to refs array
  const addToRefs = (el) => {
    if (el && !shapesRef.current.includes(el)) {
      shapesRef.current.push(el);
    }
  };

  return (
    <div ref={pageRef} className="flex items-center justify-center min-h-screen bg-blue-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-950"></div>

      {/* Abstract shapes */}
      <div ref={addToRefs} className="absolute top-20 right-40 w-24 h-24 rounded-full bg-blue-600 opacity-30 blur-sm" style={{
        borderRadius: '70% 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>
      <div ref={addToRefs} className="absolute bottom-40 left-20 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-sm " style={{
        borderRadius: ' 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>
      <div ref={addToRefs} className="absolute top-40 left-60 w-40 h-16 rounded-full bg-blue-300 opacity-20 blur-sm transform rotate-45" style={{
        borderRadius: '70% 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>
      <div ref={addToRefs} className="absolute bottom-60 right-20 w-60 h-20 rounded-full bg-blue-500 opacity-20 blur-sm transform -rotate-12" style={{
        borderRadius: '70% 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>
      <div ref={addToRefs} className="absolute top-1/2 left-1/4 w-20 h-48 rounded-full bg-blue-400 opacity-20 blur-sm transform rotate-45" style={{
        borderRadius: '70% 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>
      <div ref={addToRefs} className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full bg-blue-200 opacity-30 blur-sm" style={{
        borderRadius: '70% 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>
      <div ref={addToRefs} className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-blue-300 opacity-40 blur-sm" style={{
        borderRadius: '20% 30% 50% 50%/30% 50% 50% 70%',
        boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)'
      }}></div>

      {/* Login card */}
      <div ref={formRef} className="bg-blue-400/30 backdrop-blur-md p-8 rounded-lg shadow-xl w-96 text-white z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-6">Your logo</h2>
          <h1 className="text-2xl font-bold">Login</h1>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}


        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-200 hover:text-white">Forgot Password?</a>
          </div>

          <button type="submit" onClick={handleLogin} className="w-full bg-blue-900 hover:bg-blue-800 text-white p-2 rounded transition-all">
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200 mb-3">or continue with</p>
          <div className="flex justify-center space-x-4">
            <button>
              <FaGoogle size={40} color='yellow' />

            </button>
            <button>
              <FaGithub size={40} color="black" />

            </button>

            <button>
              <FaFacebook size={40} color="light-blue" />

            </button>



          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-blue-200">Don't have an account yet? </span>
          <a href="/register" className="text-white font-medium">Register for free</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;