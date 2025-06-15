"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiUser, FiSun, FiMoon, FiChevronDown, FiSearch } from 'react-icons/fi';
import Link from "next/link";

export default function DutyRoster() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editableStaff, setEditableStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/duty');
        const data = await response.json();
        
        // Transform all staff data but we'll filter in the display logic
        const transformedData = data.duty.map(staff => ({
          id: staff._id,
          name: staff.name,
          shift: staff.shift,
          date: new Date(staff.date || staff.createdAt).toISOString().split('T')[0],
          designation: staff.designation,
          leave: staff.leave
        }));
        
        setStaffList(transformedData);
        setEditableStaff([...transformedData]);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return;
    
    try {
      const staffToUpdate = editableStaff.find(staff => staff.id === selectedStaff.id);
      if (!staffToUpdate) return;

      await fetch('/api/duty', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: staffToUpdate.id,
          shift: staffToUpdate.shift,
          date: staffToUpdate.date,
          leave: staffToUpdate.leave
        }),
      });

      // Update the staff list with the new data
      setStaffList(editableStaff);
      setSelectedStaff(null);
      setSearchTerm('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleStaffChange = (field, value) => {
    if (!selectedStaff) return;
    
    setEditableStaff(editableStaff.map(staff => 
      staff.id === selectedStaff.id ? { ...staff, [field]: value } : staff
    ));
    
    setSelectedStaff(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter staff based on search term
  const filteredStaff = editableStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter and group today's staff by shift and leave status
  const getTodayStaff = () => {
    const today = '2025-06-15';
    const todayStaff = staffList.filter(staff => staff.date === today);
    
    return todayStaff.reduce((acc, staff) => {
      if (staff.leave) {
        acc.leave.push(staff);
      } else if (staff.shift.includes('Morning')) {
        acc.morning.push(staff);
      } else if (staff.shift.includes('Afternoon')) {
        acc.afternoon.push(staff);
      }
      return acc;
    }, { morning: [], afternoon: [], leave: [] });
  };

  const groupedStaff = getTodayStaff();

  // Function to render staff on leave in a compact format
  const renderStaffOnLeave = (leaveStaff) => {
    if (leaveStaff.length === 0) return null;
    
    if (leaveStaff.length === 1) {
      const staff = leaveStaff[0];
      return (
        <div className="bg-red-100 text-red-800 p-2 rounded-md flex items-center">
          <div className="bg-red-200 p-1 rounded-full mr-3">
            <FiUser className="text-red-600" />
          </div>
          <div>
            <p className="font-medium">{staff.name}</p>
            <p className="text-xs">{staff.designation}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-50 p-3 rounded-md">
        <h3 className="text-red-800 font-semibold mb-2">Staff on Leave</h3>
        <div className="flex flex-wrap items-center gap-2">
          {leaveStaff.map((staff, index) => (
            <div key={staff.id} className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
              <FiUser className="text-red-600 mr-1" size={12} />
              <span className="text-sm">
                {staff.name}
                {index < leaveStaff.length - 1 && ','}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
           <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 bg-[#232b38]">            
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/dashReport"}>
      HYBE Food & Drinks
      </Link>
        {/* {Array.from("HYBE Food & Drinks").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}     */}
      <div style={{ display: 'flex', gap: '12px' }}>
      {/* <Link className="px-6 py-2 mt-3 add-table" href={"/listReport"}>
        Sales Report
      </Link> */}
       <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/tables"}>
         Tables
      </Link>
        <a
                        className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button"
                        href="https://docs.google.com/spreadsheets/d/1bsYPfCKZkcrKZrWfRqS4RiKmwOXwLMQ3USFfJ9wiKwg/edit?gid=1009457690#gid=1009457690"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Credit
                    </a>
   
      </div>
        </nav>
        <br></br>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">Duty Roster</h1>
          <p className="text-gray-600">Showing roster for: June 15, 2025</p>
        </header>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FiPlus className="mr-2" />
            Update Roster
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Staff on Leave Section */}
            {groupedStaff.leave.length > 0 && (
              <div className="p-4 border-b">
                {renderStaffOnLeave(groupedStaff.leave)}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {/* Morning Shift */}
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-3 rounded-t-lg flex items-center">
                  <FiSun className="text-white text-xl mr-2" />
                  <h3 className="text-white font-semibold">Morning Shift</h3>
                  <span className="ml-auto bg-white text-amber-600 px-2 py-1 rounded-full text-xs font-medium">
                    10 AM - 11 PM
                  </span>
                </div>
                <div className="bg-white rounded-b-lg p-3">
                  {groupedStaff.morning.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {groupedStaff.morning.map(staff => (
                        <li key={staff.id} className="py-3 flex items-center">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 p-2 rounded-full mr-3">
                              <FiUser className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{staff.name}</p>
                              <p className="text-sm text-gray-500">{staff.designation}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      No staff assigned to morning shift
                    </div>
                  )}
                </div>
              </div>

              {/* Afternoon Shift */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-t-lg flex items-center">
                  <FiMoon className="text-white text-xl mr-2" />
                  <h3 className="text-white font-semibold">Afternoon Shift</h3>
                  <span className="ml-auto bg-white text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                    12 PM - 11 PM
                  </span>
                </div>
                <div className="bg-white rounded-b-lg p-3">
                  {groupedStaff.afternoon.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {groupedStaff.afternoon.map(staff => (
                        <li key={staff.id} className="py-3 flex items-center">
                          <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded-full mr-3">
                              <FiUser className="text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{staff.name}</p>
                              <p className="text-sm text-gray-500">{staff.designation}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      No staff assigned to afternoon shift
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Roster Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Roster (June 15, 2025)
              </h3>
              <button onClick={() => {
                setIsModalOpen(false);
                setSelectedStaff(null);
                setSearchTerm('');
              }} className="text-gray-400 hover:text-gray-500">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Combined Search and Select Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff</label>
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <FiSearch className="ml-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search staff by name..."
                      className="w-full px-3 py-2 pl-10 focus:outline-none text-black"
                      value={selectedStaff ? selectedStaff.name : searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (selectedStaff) setSelectedStaff(null);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    <FiChevronDown 
                      className={`mr-3 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="fixed z-10 mt-1 w-[calc(550px-2rem)] bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                      <ul className="divide-y divide-gray-100">
                        {filteredStaff.map(staff => (
                          <li 
                            key={staff.id}
                            className="p-3 hover:bg-indigo-50 cursor-pointer text-black"
                            onClick={() => {
                              setSelectedStaff(staff);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center">
                              <div className="bg-indigo-100 p-1 rounded-full mr-3">
                                <FiUser className="text-indigo-600 text-sm" />
                              </div>
                              <div>
                                <p className="font-medium">{staff.name}</p>
                                {/* <p className="text-xs text-gray-500">{staff.designation}</p> */}
                                {/* <p className="text-xs text-gray-400">Current date: {staff.date}</p> */}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Staff Details Form */}
              {selectedStaff && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={selectedStaff.date}
                        onChange={(e) => handleStaffChange('date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                      <select
                        value={selectedStaff.shift}
                        onChange={(e) => handleStaffChange('shift', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      >
                        <option value="Morning (10 AM - 11 PM)">Morning (10 AM - 11 PM)</option>
                        <option value="Afternoon (12 PM - 11 PM)">Afternoon (12 PM - 11 PM)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="leave-checkbox"
                      checked={selectedStaff.leave}
                      onChange={(e) => handleStaffChange('leave', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="leave-checkbox" className="ml-2 block text-sm text-gray-700">
                      On Leave
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStaff(null);
                  setSearchTerm('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStaff}
                disabled={!selectedStaff}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center ${!selectedStaff ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}