import React from "react";

function SidebarLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side">
        <label htmlFor="sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
          <li><a href="">Home</a></li>
          <li><a href="student">Student</a></li>
          <li><a href="program">Program</a></li>
          <li><a href="college">College</a></li>
          <li><a href="statistics">Statistics</a></li>
          <li><a href="about">About</a></li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarLayout;