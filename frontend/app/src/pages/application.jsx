import axios from 'axios'; // We'll use axios for API calls
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const applicationsPerPage = 10;

  // Applications state
  const [applications, setApplications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    revenue: '₹0L',
    growth: {
      total: 0,
      pending: 0,
      approved: 0,
      revenue: 0
    }
  });

  // Get unique courses for filter dropdown
  const uniqueCourses = ['All', ...new Set(applications.map(app => app.course))];

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const tableRef = useRef(null);
  const paginationRef = useRef(null);
  const statsRef = useRef(null);

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/applications');
      setApplications(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/applications/stats/dashboard');
      setDashboardStats(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchApplications(),
        fetchDashboardStats()
      ]);
    };

    loadData();
  }, []);

  // Animation effects
  useEffect(() => {
    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(statsRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    tl.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.3"
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
  }, [loading]);

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status.toLowerCase() === statusFilter.toLowerCase();
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

  // Change application status with backend integration
  const changeApplicationStatus = async (id, newStatus) => {
    try {
      // Convert status to lowercase to match backend expectations
      const statusForBackend = newStatus.toLowerCase();

      // Call the backend API to update status
      await axios.put(`/api/applications/${id}/status`, {
        status: statusForBackend
      });

      // Update local state
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));

      // Refresh dashboard stats to reflect the change
      fetchDashboardStats();

      // Animate the status change
      gsap.fromTo(`#app-${id} td:nth-child(4) span`,
        { scale: 0.8, backgroundColor: '#fef3c7' },
        {
          scale: 1, backgroundColor: newStatus === 'Approved' ? '#d1fae5' : '#fee2e2',
          color: newStatus === 'Approved' ? '#065f46' : '#991b1b',
          duration: 0.5
        }
      );
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status. Please try again.');
    }
  };

  const approveApplication = (id) => {
    changeApplicationStatus(id, 'Approved');
  };

  const rejectApplication = (id) => {
    changeApplicationStatus(id, 'Rejected');
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

  // Handle CSV export
  const exportToCSV = () => {
    // Map data to CSV format
    const headers = ['Name', 'Email', 'Phone', 'Course', 'Status', 'Date'];
    const data = sortedApplications.map(app => [
      app.name,
      app.email,
      app.phone || 'N/A',
      app.course,
      app.status,
      app.date
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Dashboard Stats */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Applications</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{dashboardStats.total}</h3>
            </div>
            <div className={`${dashboardStats.growth.total > 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
              {dashboardStats.growth.total > 0 ? '+' : ''}{dashboardStats.growth.total}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
              <h3 className="text-2xl font-bold text-yellow-500 dark:text-yellow-400 mt-1">{dashboardStats.pending}</h3>
            </div>
            <div className={`${dashboardStats.growth.pending > 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
              {dashboardStats.growth.pending > 0 ? '+' : ''}{dashboardStats.growth.pending}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
              <h3 className="text-2xl font-bold text-green-500 dark:text-green-400 mt-1">{dashboardStats.approved}</h3>
            </div>
            <div className={`${dashboardStats.growth.approved > 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
              {dashboardStats.growth.approved > 0 ? '+' : ''}{dashboardStats.growth.approved}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-blue-500 dark:text-blue-400 mt-1">{dashboardStats.revenue}</h3>
            </div>
            <div className={`${dashboardStats.growth.revenue > 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
              {dashboardStats.growth.revenue > 0 ? '+' : ''}{dashboardStats.growth.revenue}%
            </div>
          </div>
        </div>
      </div>

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

            <button
              className="inline-flex items-center bg-blue-600 px-3 sm:px-4 py-2 border border-transparent rounded-lg text-white hover:bg-blue-700"
              onClick={exportToCSV}
            >
              <Download size={16} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div ref={tableRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchApplications}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
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
        )}

        {/* Pagination */}
        {!loading && !error && sortedApplications.length > 0 && (
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
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${currentPage === 1
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
                    className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${currentPage === pageNum
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
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${currentPage === totalPages
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