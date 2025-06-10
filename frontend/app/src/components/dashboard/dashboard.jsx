import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import ApplicationRow from "./ApplicationRow";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";

const modules = [
  { id: "overview", name: "Overview" },
  { id: "applications", name: "Applications" },
  { id: "students", name: "Students" },
  { id: "approvals", name: "Approvals" },
  { id: "payment", name: "Payment" },
  { id: "notifications", name: "Notifications" },
  { id: "reports", name: "Reports" },
  { id: "messages", name: "Messages" },
  { id: "certificates", name: "Certificates" },
  { id: "settings", name: "Settings" }
];

export default function AdmissionDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState("overview");
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (sidebarOpen) {
      gsap.to(sidebarRef.current, {
        width: "260px",
        duration: 0.5,
        ease: "power3.out"
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        visibility: "visible",
        duration: 0.3
      });
    } else {
      gsap.to(sidebarRef.current, {
        width: "72px",
        duration: 0.5,
        ease: "power3.out"
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.visibility = "hidden";
          }
        }
      });
    }
  }, [sidebarOpen]);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeModule]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get('/admin/count-by-status');
        const stats = { pending: 0, approved: 0, rejected: 0, total: 0 };
        res.data.data.forEach((item) => {
          stats[item._id] = item.count;
          stats.total += item.count;
        });
        setApplicationStats(stats);
      } catch (err) {
        console.error("Error fetching status counts", err);
      }
    };
    fetchCounts();
  }, []);

  const renderContent = () => {
    switch (activeModule) {
      case "overview":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Applications" value={applicationStats.total} color="blue" />
              <StatCard title="Pending" value={applicationStats.pending} color="yellow" />
              <StatCard title="Approved" value={applicationStats.approved} color="green" />
              <StatCard title="Rejected" value={applicationStats.rejected} color="red" />
            </div>
          </div>
        );
      case "applications":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Applications Management</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <ApplicationRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{activeModule}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Module content goes here.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div ref={sidebarRef} className="bg-white shadow-lg z-20 transition-all duration-300 ease-in-out overflow-hidden">
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      <div className="flex-1 overflow-y-auto" ref={contentRef}>
        {renderContent()}
      </div>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-30 z-10 hidden"
      ></div>
    </div>
  );
}
