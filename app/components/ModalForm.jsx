import { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close print-hide" onClick={onClose}>✖</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;