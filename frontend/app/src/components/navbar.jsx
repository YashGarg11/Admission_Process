import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CollegeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Refs for GSAP animations
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const authButtonsRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const backgroundRef = useRef(null);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: '📋' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/admission', label: 'Admission', icon: '🎓' },
    { path: '/facilities', label: 'Facilities', icon: '🏢' },
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Initial navbar animation
  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set(navbarRef.current, { y: -100, opacity: 0 });
    gsap.set(logoRef.current, { x: -50, opacity: 0 });
    gsap.set(navItemsRef.current, { y: -30, opacity: 0 });
    gsap.set(authButtonsRef.current, { x: 50, opacity: 0 });

    // Animate navbar entrance
    tl.to(navbarRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })
      .to(logoRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.4")
      .to(navItemsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.3")
      .to(authButtonsRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.4");

    return () => tl.kill();
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;

      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);

        gsap.to(backgroundRef.current, {
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(navbarRef.current, {
          paddingTop: scrolled ? '12px' : '16px',
          paddingBottom: scrolled ? '12px' : '16px',
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Mobile menu animation
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (!isMobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(mobileMenuRef.current.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.1, ease: "power2.out" }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  };

  // Hover animations for nav items
  const handleNavHover = (element, isEntering) => {
    gsap.to(element, {
      y: isEntering ? -2 : 0,
      scale: isEntering ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Button hover animations
  const handleButtonHover = (element, isEntering, isGradient = false) => {
    if (isGradient) {
      gsap.to(element, {
        scale: isEntering ? 1.05 : 1,
        boxShadow: isEntering ? '0 8px 25px rgba(59, 130, 246, 0.4)' : '0 4px 15px rgba(59, 130, 246, 0.2)',
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(element, {
        scale: isEntering ? 1.05 : 1,
        backgroundColor: isEntering ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <nav ref={navbarRef} className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
        style={{ backdropFilter: 'blur(10px)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            ref={logoRef}
            className="flex items-center space-x-3 group z-10"
            onMouseEnter={(e) => handleNavHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleNavHover(e.currentTarget, false)}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-lg">AC</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                ABC
              </span>
              <span className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                Excellence in Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                ref={el => navItemsRef.current[index] = el}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center space-x-2 ${isActiveRoute(item.path)
                  ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
                onMouseEnter={(e) => !isActiveRoute(item.path) && handleNavHover(e.currentTarget, true)}
                onMouseLeave={(e) => !isActiveRoute(item.path) && handleNavHover(e.currentTarget, false)}
              >
                <span className="text-xs">{item.icon}</span>
                <span>{item.label}</span>
                {isActiveRoute(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm -z-10 opacity-50"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              ref={el => authButtonsRef.current[0] = el}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-300 backdrop-blur-sm bg-white/50"
              onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              ref={el => authButtonsRef.current[1] = el}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              onMouseEnter={(e) => handleButtonHover(e.currentTarget, true, true)}
              onMouseLeave={(e) => handleButtonHover(e.currentTarget, false, true)}
            >
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 transition-all duration-300"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${isActiveRoute(item.path)
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}