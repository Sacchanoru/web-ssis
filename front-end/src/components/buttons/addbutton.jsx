import React from 'react'

function AddButton({ label }) {
    return(
        <button className="btn btn-outline btn-accent">
            <i className="pi pi-plus"></i> Add {label}
            </button>
    );  
}

export default AddButton;
