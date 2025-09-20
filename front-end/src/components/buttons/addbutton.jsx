import React from 'react'

function AddButton({ label, onClick }) {
    return(
        <button className="btn bg-blue-300 text-white border-none" onClick = {onClick}>
            <i className="pi pi-plus"></i> Add {label}
            </button>
    );  
}

export default AddButton;
