"use client";

import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function DutyRosterWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [outdatedStaff, setOutdatedStaff] = useState([]);

  const checkDutyRoster = async () => {
    try {
      const res = await fetch('/api/duty', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch duty roster");
      const data = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check which staff have duty dates that are not today
      const staffWithOutdatedDuty = data.duty.filter(entry => {
        const dutyDate = new Date(entry.date).toISOString().split('T')[0];
        return dutyDate !== today;
      }).map(entry => entry.name);
      
      if (staffWithOutdatedDuty.length > 0) {
        setOutdatedStaff(staffWithOutdatedDuty);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    } catch (error) {
      console.error("Error checking duty roster:", error);
    }
  };

  useEffect(() => {
    checkDutyRoster();
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative border-2 border-yellow-400">
        {/* Close button */}
        <button 
          onClick={() => setShowWarning(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {/* <FaTimes className="h-5 w-5" /> */}
        </button>
        
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="bg-yellow-100 rounded-full p-3">
              <FaExclamationTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900">Duty Roster Needs Update</h3>
            <p className="text-gray-600 mt-2">The following staff members have outdated duty assignments:</p>
            
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="space-y-1">
                {outdatedStaff.map((staff, index) => (
                  <li key={index} className="text-red-700 font-medium flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {staff}
                  </li>
                ))}
              </ul>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              Please update the duty roster to ensure proper staff allocation for today.
            </p>
            
            <div className="mt-5 flex justify-end space-x-3">     
              <Link
                href="/dutyRoster"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                Update Duty Roster
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}