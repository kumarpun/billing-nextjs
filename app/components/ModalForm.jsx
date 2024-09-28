import { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* <button className="modal-close print-hide" onClick={onClose}>✖</button> */}
                <button className="modal-close print-hide" onClick={onClose}>
                    <span className="block sm:hidden">Close</span>  {/* Show "Close" on mobile view */}
                    <span className="hidden sm:block">✖</span>      {/* Show "✖" on larger screens */}
                </button>

                {children}
            </div>
        </div>
    );
}

export default Modal;