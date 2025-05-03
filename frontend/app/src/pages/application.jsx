import gsap from 'gsap';
import { ArrowDown, ArrowUp, Download, Filter, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const ApplicationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;

  // Sample applications data
  const [applications, setApplications] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', course: 'Computer Science', status: 'Pending', date: '2025-04-24', phone: '+91 9876543210' },
    { id: 2, name: 'Sara Miller', email: 'sara.m@example.com', course: 'Business Administration', status: 'Approved', date: '2025-04-23', phone: '+91 9876543211' },
    { id: 3, name: 'Michael Chen', email: 'michael.c@example.com', course: 'Electrical Engineering', status: 'Pending', date: '2025-04-22', phone: '+91 9876543212' },
    { id: 4, name: 'Jessica Smith', email: 'jessica.s@example.com', course: 'Psychology', status: 'Rejected', date: '2025-04-21', phone: '+91 9876543213' },
    { id: 5, name: 'David Wilson', email: 'david.w@example.com', course: 'Medicine', status: 'Approved', date: '2025-04-20', phone: '+91 9876543214' },
    { id: 6, name: 'Emily Brown', email: 'emily.b@example.com', course: 'Computer Science', status: 'Approved', date: '2025-04-19', phone: '+91 9876543215' },
    { id: 7, name: 'James Davis', email: 'james.d@example.com', course: 'Mathematics', status: 'Pending', date: '2025-04-18', phone: '+91 9876543216' },
    { id: 8, name: 'Olivia Wilson', email: 'olivia.w@example.com', course: 'Physics', status: 'Rejected', date: '2025-04-17', phone: '+91 9876543217' },
    { id: 9, name: 'Daniel Taylor', email: 'daniel.t@example.com', course: 'Chemistry', status: 'Pending', date: '2025-04-16', phone: '+91 9876543218' },
    { id: 10, name: 'Sophia Moore', email: 'sophia.m@example.com', course: 'Art History', status: 'Approved', date: '2025-04-15', phone: '+91 9876543219' },
    { id: 11, name: 'Matthew Anderson', email: 'matthew.a@example.com', course: 'Computer Science', status: 'Pending', date: '2025-04-14', phone: '+91 9876543220' },
    { id: 12, name: 'Ava Thompson', email: 'ava.t@example.com', course: 'Economics', status: 'Rejected', date: '2025-04-13', phone: '+91 9876543221' },
    { id: 13, name: 'Ethan Martin', email: 'ethan.m@example.com', course: 'Mechanical Engineering', status: 'Approved', date: '2025-04-12', phone: '+91 9876543222' },
    { id: 14, name: 'Isabella Clark', email: 'isabella.c@example.com', course: 'Business Administration', status: 'Pending', date: '2025-04-11', phone: '+91 9876543223' },
    { id: 15, name: 'Aiden Lewis', email: 'aiden.l@example.com', course: 'Computer Science', status: 'Approved', date: '2025-04-10', phone: '+91 9876543224' },
  ]);

  // Get unique courses for filter dropdown
  const uniqueCourses = ['All', ...new Set(applications.map(app => app.course))];

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const tableRef = useRef(null);
  const paginationRef = useRef(null);

  useEffect(() => {
    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    );
    
    tl.fromTo(filtersRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      "-=0.3"
    );
    
    tl.fromTo(tableRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      "-=0.3"
    );
    
    tl.fromTo(paginationRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.5 }, 
      "-=0.3"
    );
    
    // Animate rows individually
    gsap.fromTo('.table-row', 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.5 }
    );
    
    return () => {
      tl.kill();
    };
  }, []);

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesCourse = courseFilter === 'All' || app.course === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'course') {
      comparison = a.course.localeCompare(b.course);
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = sortedApplications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(sortedApplications.length / applicationsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    gsap.fromTo(tableRef.current, 
      { opacity: 0.5 }, 
      { opacity: 1, duration: 0.3 }
    );
    setCurrentPage(1);
  };

  const handleCourseChange = (newCourse) => {
    setCourseFilter(newCourse);
    gsap.fromTo(tableRef.current, 
      { opacity: 0.5 }, 
      { opacity: 1, duration: 0.3 }
    );
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const approveApplication = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Approved' } : app
    ));
    
    // Animate the status change
    gsap.fromTo(`#app-${id} td:nth-child(4) span`, 
      { scale: 0.8, backgroundColor: '#fef3c7' }, 
      { scale: 1, backgroundColor: '#d1fae5', color: '#065f46', duration: 0.5 }
    );
  };

  const rejectApplication = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Rejected' } : app
    ));
    
    // Animate the status change
    gsap.fromTo(`#app-${id} td:nth-child(4) span`, 
      { scale: 0.8, backgroundColor: '#fef3c7' }, 
      { scale: 1, backgroundColor: '#fee2e2', color: '#991b1b', duration: 0.5 }
    );
  };

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

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="ml-1 inline" /> 
      : <ArrowDown size={14} className="ml-1 inline" />;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Animate table rows on page change
    gsap.fromTo('.table-row', 
      { opacity: 0, x: -10 }, 
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  return (
    <div className="space-y-6 w-full">
      <div ref={headerRef}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white break-words">Applications Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">View, search, and manage all admission applications.</p>
      </div>
      
      {/* Filters and Search */}
      <div ref={filtersRef} className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-grow">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              <select
                className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              
              <select
                className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={courseFilter}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 sm:gap-3 mt-3 md:mt-0">
            <button className="inline-flex items-center bg-white dark:bg-gray-700 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Filter size={16} className="mr-2" />
              <span>Filters</span>
            </button>
            
            <button className="inline-flex items-center bg-blue-600 px-3 sm:px-4 py-2 border border-transparent rounded-lg text-white hover:bg-blue-700">
              <Download size={16} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Applications Table */}
      <div ref={tableRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    <span>Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>Contact Info</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('course')}
                >
                  <div className="flex items-center">
                    <span>Course</span>
                    {renderSortIcon('course')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {renderSortIcon('date')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentApplications.length > 0 ? (
                currentApplications.map((application) => (
                  <tr 
                    key={application.id} 
                    id={`app-${application.id}`} 
                    className="table-row hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{application.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400">{application.email}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {application.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatDate(application.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                          View
                        </button>
                        
                        {application.status === 'Pending' && (
                          <>
                            <button 
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                              onClick={() => approveApplication(application.id)}
                            >
                              Approve
                            </button>
                            <button 
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                              onClick={() => rejectApplication(application.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No applications found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedApplications.length > 0 && (
          <div 
            ref={paginationRef}
            className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700"
          >
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{indexOfFirstApp + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastApp, sortedApplications.length)}
              </span>{' '}
              of <span className="font-medium">{sortedApplications.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;