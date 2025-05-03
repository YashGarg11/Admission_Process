import gsap from 'gsap';
import { AlertCircle, Eye, FileText, RefreshCw } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const RejectedPage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const tableRef = useRef(null);

  // Sample data for rejected applications
  const rejectedApplications = [
    { id: 1, name: 'Jessica Smith', email: 'jessica.s@example.com', course: 'Psychology', date: '21 Apr 2025', reason: 'Incomplete documentation' },
    { id: 2, name: 'Olivia Wilson', email: 'olivia.w@example.com', course: 'Physics', date: '17 Apr 2025', reason: 'Failed entrance test' },
    { id: 3, name: 'Ava Thompson', email: 'ava.t@example.com', course: 'Economics', date: '13 Apr 2025', reason: 'Missed interview' },
    { id: 4, name: 'Noah Garcia', email: 'noah.g@example.com', course: 'Computer Science', date: '09 Apr 2025', reason: 'Incomplete documentation' },
    { id: 5, name: 'Mia Rodriguez', email: 'mia.r@example.com', course: 'Art History', date: '05 Apr 2025', reason: 'Application deadline missed' },
  ];

  useEffect(() => {
    // Create a GSAP timeline for animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Animate the header
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
    
    // Animate the content
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.3"
    );
    
    // Animate the table rows
    if (tableRef.current) {
      tl.fromTo(tableRef.current.querySelectorAll('tr'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 },
        "-=0.2"
      );
    }
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div ref={headerRef}>
        <div className="flex items-center">
          <AlertCircle size={28} className="text-red-500 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Rejected Applications</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Review applications that did not meet the requirements</p>
      </div>
      
      <div ref={contentRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Rejected Candidates</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">These applications have been rejected for various reasons</p>
          </div>
          
          <div className="flex gap-3">
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>All Rejection Types</option>
              <option>Incomplete documentation</option>
              <option>Failed entrance test</option>
              <option>Missed interview</option>
              <option>Application deadline missed</option>
            </select>
            
            <button className="inline-flex items-center bg-red-600 px-4 py-2 border border-transparent rounded-lg text-white hover:bg-red-700">
              <FileText size={18} className="mr-2" />
              <span>Export List</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" ref={tableRef}>
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rejection Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Rejected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rejectedApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{application.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{application.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{application.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                      {application.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{application.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      <button className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                        <RefreshCw size={16} className="mr-1" />
                        Reconsider
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Card */}
        <div className="mt-8 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Rejection Notifications</h3>
                <p className="text-sm text-red-600 dark:text-red-400">Send feedback to rejected applicants with improvement suggestions</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedPage;