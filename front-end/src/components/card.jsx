import React from "react";

function Card({ title, children }) {
  //overflow-x-auto max-h-[1280px] overflow-y-auto
  return (
    <div className="card bg-white shadow-lg rounded-xl p-6 border border-gray-300 max-w-5xl mx-auto max-h-3xl">
      {title && (
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          {title}
        </h2>
      )}
      <div className="max-h-[1280px] w-[960px]"> 
        {children}
      </div>
    </div>
  );
}

export default Card;