import gsap from 'gsap';
import { AlertCircle, Award, Calendar, ChevronLeft, ChevronRight, Database, FileText, MessageSquare, PieChart, Settings, UserCheck, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AdmissionDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);






  const modules = [
    { id: 'overview', name: 'Overview', icon: <PieChart size={20} /> },
    { id: 'applications', name: 'Applications', icon: <FileText size={20} /> },
    { id: 'students', name: 'Students', icon: <Users size={20} /> },
    { id: 'approvals', name: 'Approvals', icon: <UserCheck size={20} /> },
    { id: 'interviews', name: 'Payment', icon: <Calendar size={20} /> },
    { id: 'notifications', name: 'Notifications', icon: <AlertCircle size={20} /> },
    { id: 'reports', name: 'Reports', icon: <Database size={20} /> },
    { id: 'messages', name: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'certificates', name: 'Certificates', icon: <Award size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    if (sidebarOpen) {
      // Animate sidebar open
      gsap.to(sidebarRef.current, {
        width: '260px',
        duration: 0.5,
        ease: 'power3.out'
      });

      // Fade in overlay on mobile
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        visibility: 'visible'
      });
    } else {
      // Animate sidebar closed
      gsap.to(sidebarRef.current, {
        width: '72px',
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
  }, [sidebarOpen]);

  useEffect(() => {
    // Animate content panel when a new module is selected
    gsap.fromTo(contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeModule]);


  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('/api/admin/status-counts');
        const stats = { pending: 0, approved: 0, rejected: 0, total: 0 };

        res.data.data.forEach(item => {
          stats[item._id] = item.count;
          stats.total += item.count;
        });

        setApplicationStats(stats);
      } catch (err) {
        console.error("Failed to fetch status counts", err);
      }
    };

    fetchCounts();
  }, []);

  const renderContent = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Applications" value={applicationStats.total} color="bg-blue-50" textColor="text-blue-600" />
              <StatCard title="Pending Review" value={applicationStats.pending} color="bg-yellow-50" textColor="text-yellow-600" />
              <StatCard title="Approved" value={applicationStats.approved} color="bg-green-50" textColor="text-green-600" />
              <StatCard title="Rejected" value={applicationStats.rejected} color="bg-red-50" textColor="text-red-600" />
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
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
      case 'applications':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Applications Management</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Applications</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Data
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(10)].map((_, i) => (
                    <ApplicationDetailRow key={i} />
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">97</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{modules.find(m => m.id === activeModule)?.name}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Module content for {modules.find(m => m.id === activeModule)?.name} goes here.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="bg-white h-full shadow-lg flex flex-col transition-all duration-500 ease-in-out overflow-hidden z-20"
        style={{ width: sidebarOpen ? '260px' : '72px' }}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="flex items-center">
            {sidebarOpen ? (
              <>
                <div className="text-blue-600 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">AdminPortal</span>
              </>
            ) : (
              <div className="text-blue-600 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <button
            className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul>
              {modules.map((module) => (
                <li key={module.id} className="mb-1 px-3">
                  <button
                    className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${activeModule === module.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    onClick={() => setActiveModule(module.id)}
                  >
                    <span className={activeModule === module.id ? 'text-blue-600' : 'text-gray-500'}>
                      {module.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="ml-3 font-medium text-sm">{module.name}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            {sidebarOpen ? (
              <>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="font-medium text-sm">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <button className="ml-auto text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                <span className="font-medium text-sm">JD</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for closing sidebar on mobile */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-30 z-10 lg:hidden"
        style={{ visibility: 'hidden', opacity: 0 }}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div ref={contentRef}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Helper components
function StatCard({ title, value, color, textColor }) {
  return (
    <div className={`${color} rounded-lg p-6 shadow`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
    </div>
  );
}

function ApplicationRow({ name, email, course, status, date }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{course}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {date}
      </td>
    </tr>
  );
}

function ApplicationDetailRow() {
  const statuses = ['Pending', 'Approved', 'Rejected'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomName = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson'][Math.floor(Math.random() * 5)];
  const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@example.com`;
  const randomCourse = ['Computer Science', 'Business Administration', 'Electrical Engineering', 'Psychology', 'Medicine'][Math.floor(Math.random() * 5)];
  const randomDate = `${Math.floor(Math.random() * 30) + 1} Apr 2025`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{randomName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{randomEmail}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{randomCourse}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(randomStatus)}`}>
          {randomStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {randomDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">View</button>
          <button className="text-green-600 hover:text-green-900">Approve</button>
          <button className="text-red-600 hover:text-red-900">Reject</button>
        </div>
      </td>
    </tr>
  );
}