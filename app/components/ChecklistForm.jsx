"use client";
import { useEffect, useState } from 'react';

export default function ChecklistModal({ onClose, initialChecklist }) {
  const [checklist, setChecklist] = useState(initialChecklist || []);
  const [loading, setLoading] = useState(!initialChecklist);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await fetch('/api/checklist');
        const data = await res.json();
        setChecklist(data.checklist);
      } catch (err) {
        console.error("Failed to fetch checklist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, []);

  const handleCheckboxChange = async (id, currentChecked) => {
    try {
      // Optimistic UI update
      setChecklist(prev => prev.map(item => 
        item._id === id ? {...item, isChecked: !currentChecked} : item
      ));

      // Send update to server
      const response = await fetch(`/api/checklist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isChecked: !currentChecked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update checklist item');
      }

      const updatedItem = await response.json();
      setChecklist(prev => prev.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));

    } catch (error) {
      console.error("Error updating checklist:", error);
      // Revert on error
      setChecklist(prev => prev.map(item => 
        item._id === id ? {...item, isChecked: currentChecked} : item
      ));
    }
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Daily Checklist</h2>
        <p className="text-gray-800">Please mark the checkbox if the task are completed. If not, ensure the task are completed. For any questions, contact your manager.</p>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
            {checklist.map(item => (
              <li key={item._id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <input 
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(item._id, item.isChecked)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`text-gray-700 ${item.isChecked ? 'line-through text-gray-400' : ''}`}>
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}