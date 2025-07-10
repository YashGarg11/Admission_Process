import axios from 'axios';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import config from '../config';

const LoginPage = () => {
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs for GSAP animations
  const pageRef = useRef(null);
  const formRef = useRef(null);
  const shapesRef = useRef([]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('token');
      const role = getCookie('role');

      if (token && role) {
        // User is already logged in, redirect based on role
        if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  // Helper function to get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user, message } = res.data;

      // Store user data in localStorage for dashboard access
      localStorage.setItem('user', JSON.stringify(user));

      // Clear form data
      setEmail('');
      setPassword('');
      setError('');

      // Show success message (optional)
      console.log(message || 'Login successful');

      // Small delay for better UX
      setTimeout(() => {
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      }, 500);

    } catch (err) {
      console.error('Login error:', err);

      // More specific error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 400) {
        setError('Please check your email and password');
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  // Handle social login (placeholder functions)
  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`${provider} login clicked`);
    // For now, just show a message
    setError(`${provider} login coming soon!`);
    setTimeout(() => setError(''), 3000);
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
          <h2 className="text-xl font-semibold mb-6">ABC Engineering College</h2>
          <h1 className="text-2xl font-bold">Login</h1>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full p-3 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200 transition-all duration-200"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded bg-white/10 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200 transition-all duration-200"
              disabled={loading}
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white p-3 rounded transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200 mb-3">or continue with</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              <FaGoogle size={24} color='#FDE047' />
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              <FaGithub size={24} color="#1F2937" />
            </button>
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              <FaFacebook size={24} color="#3B82F6" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-blue-200">Don't have an account yet? </span>
          <button
            onClick={() => navigate('/register')}
            className="text-white font-medium hover:underline transition-all duration-200"
            disabled={loading}
          >
            Register for free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;