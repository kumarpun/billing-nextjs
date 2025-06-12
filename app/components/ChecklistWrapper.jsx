"use client";
import { useState, useEffect } from 'react';
import ChecklistModal from './ChecklistForm';

export default function ChecklistWrapper() {
  const [showModal, setShowModal] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await fetch('/api/checklist');
        const data = await res.json();
        setChecklist(data.checklist);
        
        // Check if any item is not checked
        const hasUncheckedItems = data.checklist.some(item => !item.isChecked);
        setShowModal(hasUncheckedItems);
      } catch (err) {
        console.error("Failed to fetch checklist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <>
      {showModal && (
        <ChecklistModal 
          onClose={() => setShowModal(false)}
          initialChecklist={checklist}
        />
      )}
    </>
  );
}