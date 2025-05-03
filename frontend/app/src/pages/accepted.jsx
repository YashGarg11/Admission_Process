import gsap from 'gsap';
import { CheckCircle, Eye, FileText } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const AcceptedPage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const tableRef = useRef(null);

  // Sample data for accepted applications
  const acceptedApplications = [
    { id: 1, name: 'Sara Miller', email: 'sara.m@example.com', course: 'Business Administration', date: '23 Apr 2025', status: 'Approved' },
    { id: 2, name: 'David Wilson', email: 'david.w@example.com', course: 'Medicine', date: '20 Apr 2025', status: 'Approved' },
    { id: 3, name: 'Emily Brown', email: 'emily.b@example.com', course: 'Computer Science', date: '19 Apr 2025', status: 'Approved' },
    { id: 4, name: 'Sophia Moore', email: 'sophia.m@example.com', course: 'Art History', date: '15 Apr 2025', status: 'Approved' },
    { id: 5, name: 'Ethan Martin', email: 'ethan.m@example.com', course: 'Mechanical Engineering', date: '12 Apr 2025', status: 'Approved' },
    { id: 6, name: 'Aiden Lewis', email: 'aiden.l@example.com', course: 'Computer Science', date: '10 Apr 2025', status: 'Approved' },
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
          <CheckCircle size={28} className="text-green-500 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Accepted Applications</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">View all accepted student applications</p>
      </div>
      
      <div ref={contentRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Accepted Students</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review and manage accepted applications</p>
          </div>
          
          <div className="flex gap-3">
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Business Administration</option>
              <option>Medicine</option>
              <option>Engineering</option>
            </select>
            
            <button className="inline-flex items-center bg-green-600 px-4 py-2 border border-transparent rounded-lg text-white hover:bg-green-700">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {acceptedApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{application.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{application.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{application.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{application.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <Eye size={16} className="mr-1" />
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Card */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400 mr-3" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300">All Set for Enrollment</h3>
                <p className="text-sm text-green-600 dark:text-green-400">These students can now proceed with the enrollment process</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Send Welcome Emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedPage;