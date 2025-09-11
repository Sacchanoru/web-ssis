import React from 'react';
import AddButton from './buttons/addbutton'

function NavBar() {
  return (
    <div className="navbar bg-white shadow-sm justify-between">
  <div role="tablist" className="tabs tabs-box bg-white border border-gray-300 rounded-md">
    <a role="tab" className="tab tab-active !bg-blue-300 text-white">Student</a>
    <a role="tab" className="tab !text-blue-300">Course</a>
    <a role="tab" className="tab !text-blue-300">College</a>
  </div>
  <div>
    <AddButton />
  </div>
  <div className="flex gap-2">
    <input type="text" placeholder="Search" className="input input-bordered border-gray-300 w-64 bg-white text-black" />
  </div>
</div>
  );
}

export default NavBar;