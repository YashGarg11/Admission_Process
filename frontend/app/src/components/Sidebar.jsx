import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Sidebar Component</h2>
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/applications">Applications</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
