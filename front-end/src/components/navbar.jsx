import React from 'react';
import AddButton from './buttons/addbutton'

function NavBar({ activeTab, onTabChange}) {
  const tabs = ["Student", "Program", "College"]
  return (
    <div className="navbar bg-white shadow-sm justify-between">
  <div role="tablist" className="tabs tabs-box bg-white border border-gray-300 rounded-md">
    {tabs.map((tab) => (
          <a
            key={tab}
            role="tab" 
            className={`tab ${ activeTab === tab ? "tab-active !bg-blue-300 text-white" : "!text-blue-300" }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </a>
        ))}
  </div>
  <div>
    <AddButton label = {activeTab}/>
  </div>
  <div className="flex gap-2">
    <input type="text" placeholder="Search" className="input input-bordered border-gray-300 w-64 bg-white text-black" />
  </div>
</div>
  );
}

export default NavBar;