import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto shadow-lg">
      <div className="sidebar-header p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <nav className="sidebar-menu p-4">
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</a>
          </li>
          <li>
            <a href="/applications" className="block py-2 px-4 hover:bg-gray-700 rounded">Applications</a>
          </li>
          <li>
            <a href="/students" className="block py-2 px-4 hover:bg-gray-700 rounded">Students</a>
          </li>
          <li>
            <a href="/courses" className="block py-2 px-4 hover:bg-gray-700 rounded">Courses</a>
          </li>
          <li>
            <a href="/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">Settings</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
