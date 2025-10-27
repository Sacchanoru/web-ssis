import { NavLink } from "react-router-dom";
import LogoutButton from "./buttons/logout_button";

function SidebarLayout(props) {
  const navItemClass = ({ isActive }) =>
    `flex items-center p-2 rounded-md ${
      isActive ? "bg-blue-500 text-white" : "text-gray-800 hover:bg-blue-200"
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar"
        type="checkbox"
        className="drawer-toggle"
        defaultChecked={false}
      />
      <div className="drawer-content flex flex-col">
        <div className="p-4">{props.children}</div>
      </div>

      <div className="drawer-side">
        <label htmlFor="sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-blue-300 text-lg">
          <li>
            <NavLink to="/" className={navItemClass}>
              <i className="pi pi-home mr-2"></i>Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/student" className={navItemClass}>
              <i className="pi pi-user mr-2"></i>Student
            </NavLink>
          </li>
          <li>
            <NavLink to="/program" className={navItemClass}>
              <i className="pi pi-book mr-2"></i>Program
            </NavLink>
          </li>
          <li>
            <NavLink to="/college" className={navItemClass}>
              <i className="pi pi-building mr-2"></i>College
            </NavLink>
          </li>
        </ul>
        <div className="absolute bottom-4 left-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default SidebarLayout;
