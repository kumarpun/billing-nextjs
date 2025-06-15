"use client";

import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

export default function DutyRosterWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [lastDutyDate, setLastDutyDate] = useState(null);

  const checkDutyRoster = async () => {
    try {
      const res = await fetch('/api/duty', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch duty roster");
      const data = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if ANY duty is NOT scheduled for today
      const hasOutdatedDuty = data.duty.some(entry => {
        const dutyDate = new Date(entry.date).toISOString().split('T')[0];
        return dutyDate !== today;
      });
      
      if (hasOutdatedDuty) {
        // Find the most recent duty date among all entries
        const mostRecentDate = data.duty.reduce((recent, entry) => {
          const entryDate = new Date(entry.date);
          return entryDate > recent ? entryDate : recent;
        }, new Date(0)); // Start with earliest possible date
        
        setLastDutyDate(mostRecentDate.toISOString().split('T')[0]);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Please update Duty Roster for All Staff to ensure proper staff allocation</h3>
            <br></br>
            <p className="text-black">Duty Roster Not Updated for some staff</p>
            {/* <div className="mt-2 text-sm text-gray-500">
              <p className="mt-2">Please update the duty roster to ensure proper staff allocation.</p>
            </div> */}
            <div className="mt-4 flex justify-end">
              <Link
                href="/dutyRoster"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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