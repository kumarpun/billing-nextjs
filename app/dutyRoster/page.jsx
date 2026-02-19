"use client";
import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiUser, FiSun, FiMoon, FiChevronDown, FiSearch, FiAlertCircle } from 'react-icons/fi';
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function DutyRoster() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editableStaff, setEditableStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [missingStaff, setMissingStaff] = useState([]); // New state for missing staff

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Date helper functions
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/duty');
        const data = await response.json();
        
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
        
        // Find missing staff (staff with dates not equal to today)
        const today = getTodayDate();
        const missing = transformedData.filter(staff => staff.date !== today);
        setMissingStaff(missing);
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
          date: getTodayDate(), // Always use today's date when updating
          leave: staffToUpdate.leave
        }),
      });

      // Update the local state with the new data
      const updatedStaffList = staffList.map(staff => 
        staff.id === selectedStaff.id ? { 
          ...staff, 
          shift: selectedStaff.shift,
          leave: selectedStaff.leave,
          date: getTodayDate() // Update the date to today
        } : staff
      );
      
      setStaffList(updatedStaffList);
      setEditableStaff(updatedStaffList);
      
      // Update missing staff list
      const today = getTodayDate();
      const missing = updatedStaffList.filter(staff => staff.date !== today);
      setMissingStaff(missing);
      
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

  const filteredStaff = editableStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTodayStaff = () => {
    const today = getTodayDate();
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
    <div className="flex min-h-screen bg-white">
      <SideNav isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <TopNav isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 ml-0 md:ml-64 mt-12 sm:mt-14 transition-all duration-300`}>
        <div className="p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
          <br></br>
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-indigo-800">Duty Roster</h1>
              <p className="text-gray-600">Showing roster for: {formatDisplayDate(getTodayDate())}</p>
              
              {/* Missing Staff Warning Message */}
              {missingStaff.length > 0 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                  <FiAlertCircle className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-yellow-800 font-medium">Attention: Duty roster not added for following staff:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {missingStaff.map((staff, index) => (
                        <span key={staff.id} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          {staff.name}
                          {index < missingStaff.length - 1 && ','}
                        </span>
                      ))}
                    </div>
                    <p className="text-yellow-700 text-sm mt-2">
                      Please update their duty to today's date.
                    </p>
                  </div>
                </div>
              )}
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
                        10 AM - 8 PM
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
        </div>
      </div>

      {/* Update Roster Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Roster ({formatDisplayDate(getTodayDate())})
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
                              setSelectedStaff({
                                ...staff,
                                date: getTodayDate() // Set today's date when selecting staff
                              });
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center">
                              <div className="bg-indigo-100 p-1 rounded-full mr-3">
                                <FiUser className="text-indigo-600 text-sm" />
                              </div>
                              <div>
                                <p className="font-medium">{staff.name}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {selectedStaff && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={getTodayDate()}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-black"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                      <select
                        value={selectedStaff.shift}
                        onChange={(e) => handleStaffChange('shift', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      >
                        <option value="Morning (10 AM - 8 PM)">Morning (10 AM - 8 PM)</option>
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