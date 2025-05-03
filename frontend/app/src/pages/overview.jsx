import gsap from 'gsap';
import { AlertTriangle, CheckCircle, DollarSign, FileText, TrendingUp } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const OverviewPage = ({ stats }) => {
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const recentAppsRef = useRef(null);

  useEffect(() => {
    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.6 }
    );
    
    tl.fromTo(statsRef.current.children, 
      { opacity: 0, y: 30, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1 }, 
      "-=0.3"
    );
    
    tl.fromTo(chartsRef.current, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      "-=0.2"
    );
    
    tl.fromTo(recentAppsRef.current, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      "-=0.3"
    );
    
    // Clean up animations on unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div ref={headerRef}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white break-words">Admission Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back! Here's what's happening with your admission portal today.</p>
      </div>
      
      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.total || 0}</p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 dark:text-green-400 flex items-center text-sm">
                  <TrendingUp size={16} className="mr-1" /> 12%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              <FileText size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Applications</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending || 0}</p>
              <div className="flex items-center mt-2">
                <span className="text-red-500 dark:text-red-400 flex items-center text-sm">
                  <TrendingUp size={16} className="mr-1" /> 8%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Applications</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.approved || 0}</p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 dark:text-green-400 flex items-center text-sm">
                  <TrendingUp size={16} className="mr-1" /> 22%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">₹4.5L</p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 dark:text-green-400 flex items-center text-sm">
                  <TrendingUp size={16} className="mr-1" /> 18%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6" ref={chartsRef}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Applications Overview</h2>
            <div className="flex space-x-2">
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="h-60 flex items-end justify-between px-4">
            {/* Simple bar chart visualization */}
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '65%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">65</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Mon</div>
            </div>
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '80%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">80</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Tue</div>
            </div>
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '45%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">45</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Wed</div>
            </div>
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '70%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">70</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Thu</div>
            </div>
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '90%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">90</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Fri</div>
            </div>
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '55%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">55</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Sat</div>
            </div>
            <div className="chart-bar h-40 w-8 bg-blue-100 dark:bg-blue-900 rounded-t relative group">
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-height duration-1000" style={{ height: '40%' }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">40</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">Sun</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Application Distribution</h2>
            <div className="flex space-x-2">
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <option>By Status</option>
                <option>By Course</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              {/* Simple pie chart */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Approved */}
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#10B981" strokeWidth="10" strokeDasharray="283 283" strokeDashoffset="0"></circle>
                {/* Pending */}
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#FBBF24" strokeWidth="10" strokeDasharray="283 283" strokeDashoffset="212"></circle>
                {/* Rejected */}
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#EF4444" strokeWidth="10" strokeDasharray="283 283" strokeDashoffset="254"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Applications</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Approved</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Rejected</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden" ref={recentAppsRef}>
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Applications</h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <ApplicationRow name="Alex Johnson" email="alex.j@example.com" course="Computer Science" status="Pending" date="24 Apr 2025" />
              <ApplicationRow name="Sara Miller" email="sara.m@example.com" course="Business Administration" status="Approved" date="23 Apr 2025" />
              <ApplicationRow name="Michael Chen" email="michael.c@example.com" course="Electrical Engineering" status="Pending" date="22 Apr 2025" />
              <ApplicationRow name="Jessica Smith" email="jessica.s@example.com" course="Psychology" status="Rejected" date="21 Apr 2025" />
              <ApplicationRow name="David Wilson" email="david.w@example.com" course="Medicine" status="Approved" date="20 Apr 2025" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View
          </button>
          {status === 'Pending' && (
            <>
              <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                Approve
              </button>
              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                Reject
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default OverviewPage;