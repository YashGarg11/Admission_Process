import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AlertCircle, Award,
  BarChart3,
  Bell,
  DollarSign,
  FileText,
  Menu,
  MessageSquare, PieChart,
  Search,
  Settings,
  User,
  UserCheck, Users,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import config from "../config";
import AcceptedPage from '../pages/accepted';
import ApplicationPage from '../pages/application';
import IdcardPage from '../pages/idcard';
import OverviewPage from '../pages/overview';
import PaymentPage from '../pages/payment';
import RejectedPage from '../pages/rejected';
import SeatsPage from '../pages/seats';
import SettingPage from '../pages/setting';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AdmissionDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [activeModule, setActiveModule] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const tableRef = useRef(null);

  const modules = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={20} /> },
    { id: 'applications', name: 'Applications', icon: <FileText size={20} /> },
    { id: 'accepted', name: 'Accepted', icon: <UserCheck size={20} /> },
    { id: 'rejected', name: 'Rejected', icon: <AlertCircle size={20} /> },
    { id: 'payment', name: 'Payment', icon: <DollarSign size={20} /> },
    { id: 'seats', name: 'Available Seats', icon: <Users size={20} /> },
    { id: 'idcard', name: 'ID Cards', icon: <Award size={20} /> },
    { id: 'reports', name: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'messages', name: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false);
      } else if (window.innerWidth >= 1280 && !sidebarOpen) {
        setSidebarOpen(true);
      }

      // Force rerender to adjust content position
      if (contentRef.current) {
        contentRef.current.style.opacity = '0.99';
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.opacity = '1';
          }
        }, 50);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Sidebar animation
  useEffect(() => {
    if (sidebarOpen) {
      // Animate sidebar open
      gsap.to(sidebarRef.current, {
        width: window.innerWidth < 768 ? '100%' : '280px',
        duration: 0.5,
        ease: 'power3.out'
      });

      // Fade in overlay on mobile
      if (window.innerWidth < 1024) {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          visibility: 'visible'
        });
      }
    } else {
      // Animate sidebar closed
      gsap.to(sidebarRef.current, {
        width: window.innerWidth < 768 ? '0' : '80px',
        duration: 0.5,
        ease: 'power3.out'
      });

      // Fade out overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.visibility = 'hidden';
          }
        }
      });
    }

    // Adjust main content position when sidebar state changes
    if (window.innerWidth < 768) {
      // On mobile, take full width regardless of sidebar state (sidebar overlays content)
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          width: '100%',
          duration: 0.5,
          ease: 'power3.out'
        });
      }
    } else {
      // On desktop, adjust content width based on sidebar width
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          width: '100%',
          duration: 0.5,
          ease: 'power3.out'
        });
      }
    }
  }, [sidebarOpen]);

  // Content animations when module changes
  useEffect(() => {
    // Stagger-animate the content sections when a new module is selected
    const timeline = gsap.timeline();

    timeline.fromTo(contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );

    if (headerRef.current) {
      timeline.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        "-=0.2"
      );
    }

    if (statsRef.current) {
      timeline.fromTo(statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.4)' },
        "-=0.2"
      );
    }

    if (chartsRef.current) {
      timeline.fromTo(chartsRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        "-=0.3"
      );
    }

    if (tableRef.current) {
      timeline.fromTo(tableRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        "-=0.3"
      );
    }
  }, [activeModule]);

  // Scroll animations
  useEffect(() => {
    const sections = document.querySelectorAll('.animate-on-scroll');

    sections.forEach(section => {
      gsap.fromTo(section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeModule]);

  const [applicationStats, setApplicationStats] = useState({
    total: 125,
    pending: 42,
    approved: 63,
    rejected: 20
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/admin/status-counts`);
        const stats = { pending: 0, approved: 0, rejected: 0, total: 0 };

        res.data.data.forEach(item => {
          stats[item._id] = item.count;
          stats.total += item.count;
        });

        setApplicationStats(stats);
      } catch (err) {
        console.error("Failed to fetch status counts", err);
        // Keep the dummy data in case the API fails
      }
    };

    fetchCounts();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode class to the root element
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewPage stats={applicationStats} />;
      case 'applications':
        return <ApplicationPage />;
      case 'accepted':
        return <AcceptedPage />;
      case 'rejected':
        return <RejectedPage />;
      case 'payment':
        return <PaymentPage />;
      case 'seats':
        return <SeatsPage />;
      case 'idcard':
        return <IdcardPage />;
      case 'settings':
        return <SettingPage />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6" ref={headerRef}>
              {modules.find(m => m.id === activeModule)?.name}
            </h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Content for {modules.find(m => m.id === activeModule)?.name} is being developed.
                Please check back later.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Overlay for mobile */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-10 hidden lg:hidden"
        style={{ visibility: 'hidden', opacity: 0 }}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar - fixed on mobile, relative on desktop */}
      <div
        ref={sidebarRef}
        className={`bg-white dark:bg-gray-900 h-full shadow-lg flex flex-col transition-all duration-500 ease-in-out overflow-hidden fixed lg:sticky top-0 left-0 z-20 border-r border-gray-200 dark:border-gray-700`}
        style={{ width: sidebarOpen ? (window.innerWidth < 768 ? '100%' : '280px') : (window.innerWidth < 768 ? '0' : '80px') }}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          {window.innerWidth < 768 && sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400">
              <X size={24} />
            </button>
          )}

          <div className="flex items-center">
            {sidebarOpen ? (
              <>
                <div className="text-blue-600 dark:text-blue-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-bold text-lg dark:text-white">AdminPortal</span>
              </>
            ) : (
              <div className="text-blue-600 dark:text-blue-400 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {modules.map((module) => (
              <li key={module.id}>
                <button
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center w-full p-2 rounded-lg transition-all duration-200 ${activeModule === module.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                >
                  <div className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>
                    {module.icon}
                  </div>
                  {sidebarOpen && <span>{module.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                <User size={20} />
              </div>
              <div>
                <div className="font-medium dark:text-white">Admin User</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <User size={20} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area - takes remaining width */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 lg:px-6 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 dark:text-gray-400 focus:outline-none"
              >
                <Menu size={24} />
              </button>
              <div className="ml-4 text-xl font-semibold text-gray-700 dark:text-white hidden md:block">
                {modules.find(m => m.id === activeModule)?.name}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 focus:outline-none">
                  <Search size={20} />
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 focus:outline-none">
                  <Bell size={20} />
                </button>
                {notifications > 0 && (
                  <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                    {notifications}
                  </div>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 focus:outline-none"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User size={20} />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-gray-700 dark:text-white">Admin User</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Admin</div>
                  </div>
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Profile</a>
                    <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Settings</a>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <a href="#logout" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area with proper padding to avoid sidebar overlap */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 lg:p-6 w-full" ref={contentRef}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, textColor, icon }) {
  return (
    <div className={`${color} rounded-lg shadow-md p-6 transform transition-transform duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} ${textColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ApplicationRow({ name, email, course, status, date }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{course}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{date}</td>
    </tr>
  );
}

function ApplicationDetailRow() {
  const name = "Alex Johnson";
  const email = "alex.j@example.com";
  const course = "Computer Science";
  const status = "Pending";
  const date = "24 Apr 2025";

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{course}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{date}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View
          </button>
          <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
            Approve
          </button>
          <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}