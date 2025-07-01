import gsap from 'gsap';
import { CheckCircle, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AcceptedPage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');

  useEffect(() => {
    const fetchAcceptedApplications = async () => {
      try {
        const response = await api.get('/admin/applications', {
          params: { status: 'approved' }
        });

        if (response.data.success) {
          const approvedApps = response.data.data
            .filter(app => app.status?.toLowerCase() === 'approved')
            .map(app => ({
              ...app,
              id: app._id // Normalize for frontend use
            }));

          setAcceptedApplications(approvedApps);
        } else {
          setError('Failed to load accepted applications');
        }
      } catch (err) {
        console.error('Error fetching accepted applications:', err);
        setError('Failed to load accepted applications');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedApplications();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
    tl.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (tableRef.current && acceptedApplications.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(
        tableRef.current.querySelectorAll('tbody tr'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }
      );
    }
  }, [acceptedApplications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div ref={headerRef}>
        <div className="flex items-center">
          <CheckCircle size={28} className="text-green-500 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Accepted Applications
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          View all accepted student applications
        </p>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700"
      >
        {/* Top bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Accepted Students
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review and manage accepted applications
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
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

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading accepted applications...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
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
                {acceptedApplications
                  .filter(app => selectedCourse === 'All Courses' || app.course === selectedCourse)
                  .map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{app.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{app.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{app.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{app.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                          onClick={() => navigate(`/view_student/${app.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Card */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400 mr-3" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300">All Set for Enrollment</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  These students can now proceed with the enrollment process
                </p>
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
