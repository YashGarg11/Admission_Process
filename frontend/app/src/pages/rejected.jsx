import gsap from 'gsap';
import { FileText, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Adjust path as needed

const RejectedPage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');

  useEffect(() => {
    const fetchRejectedApplications = async () => {
      try {
        const response = await api.get('/admin/applications', {
          params: { status: 'rejected' }
        });

        if (response.data.success) {
          const rejectedApps = response.data.data.filter(app => 
            app.status.toLowerCase() === 'rejected'
          );
          setRejectedApplications(rejectedApps);
        } else {
          setError('Failed to load rejected applications');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rejected applications:', err);
        setError('Failed to load rejected applications');
        setLoading(false);
      }
    };

    fetchRejectedApplications();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
    tl.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (tableRef.current && rejectedApplications.length > 0) {
      gsap.fromTo(
        tableRef.current.querySelectorAll('tbody tr'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }
      );
    }
  }, [rejectedApplications]);

  const filteredApplications = rejectedApplications.filter(
    app => selectedCourse === 'All Courses' || app.course === selectedCourse
  );

  const exportToCSV = () => {
    const csv = filteredApplications.map(app => `${app.name},${app.email},${app.course},${app.date}`).join('\n');
    const blob = new Blob(["Name,Email,Course,Date Rejected\n" + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rejected_applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div ref={headerRef}>
        <div className="flex items-center">
          <XCircle size={28} className="text-red-500 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Rejected Applications</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">View all rejected student applications</p>
      </div>

      <div ref={contentRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Rejected Students</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage rejected applications</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Business Administration</option>
              <option>Medicine</option>
              <option>Engineering</option>
            </select>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center bg-red-600 px-4 py-2 border border-transparent rounded-lg text-white hover:bg-red-700"
            >
              <FileText size={18} className="mr-2" />
              <span>Export List</span>
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading rejected applications...</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Rejected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredApplications.map((app) => (
                  <tr key={app._id || app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{app.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{app.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{app.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        onClick={() => navigate(`/view_student/${app._id}`)}
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
        <div className="mt-8 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <XCircle size={24} className="text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Applications Rejected</h3>
                <p className="text-sm text-red-600 dark:text-red-400">These students have not been selected</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Send Rejection Emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedPage;
