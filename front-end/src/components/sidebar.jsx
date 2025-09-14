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
        <ul className="menu p-4 w-64 min-h-full bg-blue-300 text-base-content text-lg font-semibold space-y-2">
          <li><a href="/"><i className="pi pi-home mr-2"></i> Home</a></li>
          <li><a href="/student"><i className="pi pi-user mr-2"></i> Student</a></li>
          <li><a href="/program"><i className="pi pi-book mr-2"></i> Program</a></li>
          <li><a href="/college"><i className="pi pi-building mr-2"></i> College</a></li>
          <li><a href="/statistics"><i className="pi pi-chart-bar mr-2"></i> Statistics</a></li>
          <li><a href="/about"><i className="pi pi-info-circle mr-2"></i> About</a></li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarLayout;