import axios from 'axios';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config'; // Adjust the path as necessary
import CollegeNavbar from './navbar';
import Silk from './Silk';

const HomePage = () => {
  const navigate = useNavigate();

  // Refs for GSAP animations
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const featuresRef = useRef([]);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Create master timeline
    const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial states
    gsap.set([heroRef.current, headerRef.current, contentRef.current, statsRef.current, ctaRef.current], {
      opacity: 0
    });

    // Hero section animation
    masterTl.fromTo(heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    );

    // Header animation
    masterTl.fromTo(headerRef.current,
      { opacity: 0, y: -50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2 },
      "-=0.8"
    );

    // Content animation
    masterTl.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.6"
    );

    // Features staggered animation
    masterTl.fromTo(featuresRef.current,
      { opacity: 0, y: 50, rotateX: 15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );

    // Stats animation
    masterTl.fromTo(statsRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6 },
      "-=0.4"
    );

    // CTA animation
    masterTl.fromTo(ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3"
    );

    return () => masterTl.kill();
  }, []);

  // Hover animations for feature cards
  const handleFeatureHover = (index, isEntering) => {
    const card = featuresRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: isEntering ? -10 : 0,
      scale: isEntering ? 1.02 : 1,
      rotateY: isEntering ? 5 : 0,
      boxShadow: isEntering
        ? '0 20px 40px rgba(0, 0, 0, 0.15)'
        : '0 10px 30px rgba(0, 0, 0, 0.1)',
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleApply = async () => {
    try {
      // Check login via secure cookie
      const sessionRes = await axios.get(`${config.API_BASE_URL}/auth/check-session`, {
        withCredentials: true,
      });

      const user = sessionRes.data.user;

      // Now fetch progress
      const progressRes = await axios.post(
        `${config.API_BASE_URL}/form/progress`,
        {},
        {
          withCredentials: true,
        }
      );

      const data = progressRes.data;

      switch (data.progress) {
        case 1:
          navigate('//document_personal');
          break;
        case 2:
          navigate('/course');
          break;
        case 3:
          navigate('/document_academic');
          break;
        default:
          navigate('/document_personal');
      }

    } catch (err) {
      console.error('Progress fetch failed', err);

      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        navigate('/course');
      }
    }
  };


  const features = [
    {
      icon: "👤",
      title: "Create Account",
      description: "Register with your details to start your application process",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      link: "/register"
    },
    {
      icon: "📝",
      title: "Apply Online",
      description: "Complete your application with all required documents and information",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      onClick: handleApply
    },
    {
      icon: "🎓",
      title: "Get Admission",
      description: "Track your application status and receive updates in real-time",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      link: "/admission_status"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Enrolled" },
    { number: "95%", label: "Placement Rate" },
    { number: "50+", label: "Expert Faculty" },
    { number: "25+", label: "Years of Excellence" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Silk Background */}
      <div className="absolute inset-0 -z-10">
        <Silk
          speed={5}
          scale={1}
          color="#FFFFFF"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cyan-200 rounded-full opacity-20 blur-xl"></div>
      </div>

      <CollegeNavbar />

      <div className="container mx-auto px-4 pt-32 pb-12 max-w-7xl relative z-10">
        <div className="flex flex-col items-center">
          {/* Hero Section */}
          <div ref={heroRef} className="text-center mb-16 w-full max-w-5xl">
            {/* Header */}
            <div ref={headerRef} className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-purple-800 mb-6 tracking-tight leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ABES ENGINEERING COLLEGE
                </span>
              </h1>

              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">2025-2026 Admissions Open</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div ref={contentRef}>
              <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                Join our prestigious institution and unlock your potential. Our admission process is now fully online to provide you a
                <span className="font-semibold text-blue-600"> seamless experience</span>.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="w-full mb-16 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const handleClick = () => {
                  if (feature.onClick) {
                    feature.onClick();
                  }
                };

                const FeatureWrapper = feature.link ? Link : 'div';
                const wrapperProps = feature.link ? { to: feature.link } : { onClick: handleClick };

                return (
                  <FeatureWrapper key={index} {...wrapperProps}>
                    <div
                      ref={el => featuresRef.current[index] = el}
                      className={`group relative bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm cursor-pointer overflow-hidden`}
                      onMouseEnter={() => handleFeatureHover(index, true)}
                      onMouseLeave={() => handleFeatureHover(index, false)}
                    >
                      {/* Background gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                      {/* Content */}
                      <div className="relative z-10 text-center">
                        <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-4`}>
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                          <span>Click to {feature.title.toLowerCase()}</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  </FeatureWrapper>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div ref={statsRef} className="w-full mb-16 max-w-5xl">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div ref={ctaRef} className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white rounded-xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Take the first step towards your bright future. Join thousands of successful graduates who started their journey here.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleApply}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
                  >
                    <span>Apply Now</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;