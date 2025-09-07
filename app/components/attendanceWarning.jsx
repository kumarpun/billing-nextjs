"use client";

import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function AttendanceWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAttendance = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/attendance', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch attendance data");
      const data = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if there are any attendance records for today
      const hasTodayAttendance = data.attendancelist.some(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      
      // Show warning if no attendance records for today
      if (!hasTodayAttendance) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAttendance();
    
    // Check every 30 minutes to see if attendance has been updated
    const interval = setInterval(checkAttendance, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative border-2 border-yellow-400">
        {/* Close button */}
        <button 
          onClick={() => setShowWarning(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>
        
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="bg-yellow-100 rounded-full p-3">
              <FaExclamationTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900">Attendance Not Marked</h3>
            <p className="text-gray-600 mt-2">
              No attendance records have been created for today yet.
            </p>
            
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 font-medium">
                Please mark attendance for present staff members.
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              Timely attendance marking ensures accurate payroll and staff management.
            </p>
            
            <div className="mt-5 flex justify-end space-x-3">     
              <Link
                href="/attendance"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                Mark Attendance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}