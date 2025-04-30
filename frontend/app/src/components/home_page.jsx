import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const buttonsRef = useRef(null);
  const adminButtonsRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Create our animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Ensure elements are properly initialized
    gsap.set([headerRef.current, contentRef.current, buttonsRef.current, adminButtonsRef.current, featuresRef.current], {
      opacity: 0
    });

    // Header animation with fromTo
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -70 },
      { opacity: 1, y: 0, duration: 1.2 }
    );

    // Admin buttons animation
    tl.fromTo(adminButtonsRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8 },
      "-=0.7"
    );

    // Content text animation
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9 },
      "-=0.5"
    );

    // Features cards staggered animation
    tl.fromTo(featuresRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15 },
      "-=0.6"
    );

    // Buttons animation
    tl.fromTo(buttonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.4"
    );

    return () => tl.kill();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col items-center">
          {/* Admin Buttons */}
          <div ref={adminButtonsRef} className="w-full flex flex-col sm:flex-row justify-end gap-4 mb-8">
            <Link to="/dashboard" className="no-underline">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Admin Dashboard
              </button>
            </Link>
            <Link to="/document_personal" className="no-underline">
              <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Personal Documents
              </button>
            </Link>
          </div>

          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-12 w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
              Welcome to Online Admission Portal
            </h1>
            <div className="inline-block mt-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold py-2 px-6 rounded-full shadow-lg animate-pulse">
                2025-2026 Admissions Open
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div ref={contentRef} className="w-full mb-12">
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              Join our prestigious institution and unlock your potential. Our admission process is now fully online to provide you a seamless experience.
            </p>

            {/* Features Grid */}
            <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="feature-card bg-white rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border-t-4 border-blue-500 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Create Account</h4>
                <p className="text-gray-600">Register with your details to start your application process</p>
              </div>

              <div className="feature-card bg-white rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border-t-4 border-indigo-500 flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Apply Online</h4>
                <p className="text-gray-600">Complete your application with all required documents and information</p>
              </div>

              <div className="feature-card bg-white rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border-t-4 border-green-500 flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Get Admission</h4>
                <p className="text-gray-600">Track your application status and receive updates in real-time</p>
              </div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link to="/register" className="no-underline">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium px-8 py-3.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 w-64">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register Now
              </button>
            </Link>
            <Link to="/login" className="no-underline">
              <button className="bg-white border-2 border-indigo-600 text-indigo-700 font-medium px-8 py-3.5 rounded-lg hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-3 w-64">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;