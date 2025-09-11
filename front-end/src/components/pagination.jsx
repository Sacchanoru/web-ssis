import React from 'react';

function Pagination() {
    return(
    <div className="flex justify-center mt-4">
        <div className="join">
            <input
                className="join-item btn btn-square bg-white text-blue-300 checked:bg-blue-300 checked:text-white border border-gray-300"
                type="radio"
                name="options"
                aria-label="1"
                checked="checked" />
            <input className="join-item btn btn-square bg-white text-blue-300 checked:bg-blue-300 checked:text-white border border-gray-300" 
                type="radio"
                name="options"
                aria-label="2"
                checked="checked" />
            <input className="join-item btn btn-square bg-white text-blue-300 checked:bg-blue-300 checked:text-white border border-gray-300" 
                type="radio"
                name="options"
                aria-label="3"
                checked="checked" />
            <input className="join-item btn btn-square bg-white text-blue-300 checked:bg-blue-300 checked:text-white border border-gray-300" 
                type="radio"
                name="options"
                aria-label="4"
                checked="checked" />
        </div>
    </div>
    );
}

export default Pagination;