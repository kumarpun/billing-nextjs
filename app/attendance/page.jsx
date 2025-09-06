"use client";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);  
  const [attendances, setAttendances] = useState([]);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [showSummarySection, setShowSummarySection] = useState(false); // New state for toggling summary section
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Hardcoded staff list
  const staffList = [
    { id: 1, name: "Sajan" },
    { id: 2, name: "Mamata" },
    { id: 3, name: "Roshan" },
    { id: 4, name: "Madan" },
    { id: 5, name: "Sachin" },
    { id: 6, name: "Niranjan" },
    { id: 7, name: "Pirthivi" },
    { id: 8, name: "Rishab" },
    { id: 9, name: "Bikram" },
    { id: 10, name: "Susmita" },
    { id: 11, name: "Tanisha" },
  ];

  // Standard shift times
  const standardShiftTimes = {
    Morning: "10:00", // 10 AM
    Afternoon: "12:00" // 12 PM
  };

  // Determine shift based on check-in time
  const determineShift = (checkInTime) => {
    if (!checkInTime) return "Morning"; // Default to morning if no time provided
    
    const [hours, minutes] = checkInTime.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    // If check-in is before 12 PM, it's a morning shift
    // If check-in is at or after 12 PM, it's an afternoon shift
    return totalMinutes < 12 * 60 ? "Morning" : "Afternoon";
  };

  // Fetch attendance data from API
  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendances(data.attendancelist || []);
      
      // Calculate stats for selected date
      updateStatsForDate(data.attendancelist, selectedDate);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data for date range
  const fetchAttendanceSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance summary data');
      }
      const data = await response.json();
      
      // Calculate summary data
      calculateSummary(data.attendancelist || []);
      setShowSummary(true);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching attendance summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary data based on date range
  const calculateSummary = (attendanceData) => {
    const staffSummary = {};
    
    // Filter data by date range
    const filteredData = attendanceData.filter(attendance => {
      const attendanceDate = new Date(attendance.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      return attendanceDate >= start && attendanceDate <= end;
    });
    
    // Group by staff and calculate averages
    filteredData.forEach(attendance => {
      if (!staffSummary[attendance.name]) {
        staffSummary[attendance.name] = {
          totalDeduction: 0,
          count: 0,
          averageDeduction: 0
        };
      }
      
      if (attendance.deductionPercentage) {
        staffSummary[attendance.name].totalDeduction += attendance.deductionPercentage;
        staffSummary[attendance.name].count += 1;
      }
    });
    
    // Calculate averages
    Object.keys(staffSummary).forEach(staffName => {
      if (staffSummary[staffName].count > 0) {
        staffSummary[staffName].averageDeduction = 
          staffSummary[staffName].totalDeduction / staffSummary[staffName].count;
      }
    });
    
    // Convert to array for display
    const summaryArray = Object.keys(staffSummary).map(name => ({
      name,
      ...staffSummary[name]
    }));
    
    setSummaryData(summaryArray);
  };

  // Update stats based on selected date
  const updateStatsForDate = (attendanceData, date) => {
    const filteredData = filterAttendancesByDate(attendanceData, date);
    
    const present = filteredData.filter(a => a.status === "present").length;
    const late = filteredData.filter(a => a.status === "late").length;
    const absent = filteredData.filter(a => a.status === "absent").length;
    
    setStats({
      present,
      late,
      absent,
      total: filteredData.length
    });
  };

  // Filter attendances by date using the date field
  const filterAttendancesByDate = (attendanceData, date) => {
    if (!date) return attendanceData;
    
    const selectedDateObj = new Date(date);
    return attendanceData.filter(attendance => {
      const attendanceDate = new Date(attendance.date);
      return (
        attendanceDate.getFullYear() === selectedDateObj.getFullYear() &&
        attendanceDate.getMonth() === selectedDateObj.getMonth() &&
        attendanceDate.getDate() === selectedDateObj.getDate()
      );
    });
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/currentUser');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserRole(userData.role);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchAttendances();
    fetchCurrentUser();
  }, [selectedDate]);

  // Convert time string to proper Date object for API
  const createDateTime = (timeString, dateString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    const date = new Date(dateString);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.toISOString();
  };

  // Extract time part from ISO string for form inputs
  const extractTimeFromISO = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toTimeString().substring(0, 5); // Returns HH:MM format
  };

  // Calculate time lost for late check-ins with grace period (returns minutes)
  const calculateTimeLost = (checkInTime, shiftTime) => {
    if (!checkInTime || !shiftTime) return 0;
    
    const checkIn = new Date(checkInTime);
    const shiftDate = new Date(checkInTime);
    
    let expectedCheckInTime;
    let timeLostMinutes = 0;

    if (shiftTime === "Morning") {
      expectedCheckInTime = new Date(shiftDate);
      const [hours, minutes] = standardShiftTimes.Morning.split(':');
      expectedCheckInTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Grace period until 10:15 AM
      const graceEnd = new Date(expectedCheckInTime);
      graceEnd.setMinutes(graceEnd.getMinutes() + 15);

      if (checkIn > graceEnd) {
        const lateMs = checkIn - graceEnd;
        timeLostMinutes = Math.floor(lateMs / (1000 * 60));
      }

    } else if (shiftTime === "Afternoon") {
      expectedCheckInTime = new Date(shiftDate);
      const [hours, minutes] = standardShiftTimes.Afternoon.split(':');
      expectedCheckInTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Grace period until 12:15 PM
      const graceEnd = new Date(expectedCheckInTime);
      graceEnd.setMinutes(graceEnd.getMinutes() + 15);

      if (checkIn > graceEnd) {
        const lateMs = checkIn - graceEnd;
        timeLostMinutes = Math.floor(lateMs / (1000 * 60));
      }
    }
    
    return timeLostMinutes;
  };

  // Calculate deduction percentage based on time lost and shift duration
  const calculateDeductionPercentage = (timeLostMinutes, shiftTime) => {
    if (!timeLostMinutes || timeLostMinutes <= 0) return 0;
    
    let shiftDurationMinutes = 0;
    
    if (shiftTime === "Morning") {
      // Morning shift duration: 10 AM - 8 PM (10 hours = 600 minutes)
      shiftDurationMinutes = 10 * 60;
    } else if (shiftTime === "Afternoon") {
      // Afternoon shift duration: 12 PM - 11 PM (11 hours = 660 minutes)
      shiftDurationMinutes = 11 * 60;
    }
    
    return (timeLostMinutes / shiftDurationMinutes) * 100;
  };

  // Format time lost for display
  const formatTimeLost = (timeLostMinutes) => {
    if (!timeLostMinutes || timeLostMinutes <= 0) return "No time lost";
    
    try {
      const hours = Math.floor(timeLostMinutes / 60);
      const minutes = timeLostMinutes % 60;
      
      if (hours > 0 && minutes > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
      
      return "No time lost";
    } catch (e) {
      console.error("Error parsing timeLost:", e);
      return "-";
    }
  };

  const handleCheckIn = async (formData) => {
    try {
      setLoading(true);
      
      const checkInTime = createDateTime(formData.checkInTime, selectedDate);
      // Determine shift based on check-in time instead of user selection
      const shiftTime = determineShift(formData.checkInTime);
      const timeLostMinutes = calculateTimeLost(checkInTime, shiftTime);
      const deductionPercentage = calculateDeductionPercentage(timeLostMinutes, shiftTime);
      
      // Prepare data for API with proper Date objects
      const attendanceData = {
        name: selectedStaff.name,
        shiftTime: shiftTime,
        checkInTime: checkInTime,
        checkOutTime: null,
        remarks: formData.remarks || "",
        status: formData.status,
        standardShiftMorning: "10:00",
        standardShiftAfternoon: "12:00",
        timeLost: timeLostMinutes, // Store as minutes
        salary: 0,
        salaryDeduction: (0 * deductionPercentage) / 100, // Calculate based on salary (0 in this case)
        deductionPercentage: deductionPercentage,
        date: selectedDate // Use the selected date
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check in');
      }

      const result = await response.json();
      setSuccessMessage(`${selectedStaff.name} checked in successfully for ${new Date(selectedDate).toLocaleDateString()}`);
      setShowCheckInForm(false);
      setSelectedStaff(null);
      fetchAttendances(); // Refresh the data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error checking in:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (attendance) => {
    try {
      setLoading(true);
      
      // Get current time for checkout
      const now = new Date();
      const checkOutTime = now.toTimeString().substring(0, 5); // HH:MM format
      
      const attendanceData = {
        id: attendance._id,
        checkOutTime: createDateTime(checkOutTime, selectedDate),
        status: "present" // Assume present if checking out
      };

      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check out');
      }

      const result = await response.json();
      setSuccessMessage(`${attendance.name} checked out successfully`);
      fetchAttendances(); // Refresh the data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error checking out:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (formData) => {
    try {
      setLoading(true);
      
      const checkInTime = createDateTime(formData.checkInTime, selectedDate);
      // Determine shift based on check-in time instead of user selection
      const shiftTime = determineShift(formData.checkInTime);
      const timeLostMinutes = calculateTimeLost(checkInTime, shiftTime);
      const deductionPercentage = calculateDeductionPercentage(timeLostMinutes, shiftTime);
      
      const attendanceData = {
        id: editingAttendance._id,
        name: formData.name,
        shiftTime: shiftTime,
        checkInTime: checkInTime,
        checkOutTime: formData.checkOutTime ? createDateTime(formData.checkOutTime, selectedDate) : null,
        remarks: formData.remarks || "",
        status: formData.status,
        standardShiftMorning: "10:00",
        standardShiftAfternoon: "12:00",
        timeLost: timeLostMinutes, // Store as minutes
        salary: 0,
        salaryDeduction: (0 * deductionPercentage) / 100, // Calculate based on salary (0 in this case)
        deductionPercentage: deductionPercentage,
        date: selectedDate // Update with selected date
      };

      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to update attendance');
      }

      setSuccessMessage(`Attendance record updated successfully`);
      setEditingAttendance(null);
      fetchAttendances(); // Refresh the data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error updating attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if staff member has already checked in for selected date
  const hasCheckedInForDate = (staffName, date) => {
    const selectedDateObj = new Date(date);
    return attendances.some(att => {
      const attendanceDate = new Date(att.date);
      return (
        att.name === staffName && 
        attendanceDate.getFullYear() === selectedDateObj.getFullYear() &&
        attendanceDate.getMonth() === selectedDateObj.getMonth() &&
        attendanceDate.getDate() === selectedDateObj.getDate()
      );
    });
  };

  // Get attendance record for staff on selected date
  const getAttendanceForDate = (staffName, date) => {
    const selectedDateObj = new Date(date);
    return attendances.find(att => {
      const attendanceDate = new Date(att.date);
      return (
        att.name === staffName && 
        attendanceDate.getFullYear() === selectedDateObj.getFullYear() &&
        attendanceDate.getMonth() === selectedDateObj.getMonth() &&
        attendanceDate.getDate() === selectedDateObj.getDate()
      );
    });
  };

  // Format time for display - extract time from Date object
  const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display
  const formatDate = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  };

  // Generate daily attendance records for all staff
  const generateDailyAttendance = () => {
    const selectedDateObj = new Date(selectedDate);
    
    // Create a record for each staff member for the selected date
    return staffList.map(staff => {
      // Find existing attendance record for this staff member on the selected date
      const existingAttendance = getAttendanceForDate(staff.name, selectedDate);
      
      return {
        staff: staff,
        attendance: existingAttendance || null,
        date: selectedDateObj
      };
    });
  };

  // Get filtered attendances based on selected status filter
  const filteredDailyAttendance = () => {
    let dailyAttendance = generateDailyAttendance();
    
    if (filter !== "all") {
      dailyAttendance = dailyAttendance.filter(item => {
        if (!item.attendance) return filter === "absent";
        return item.attendance.status === filter;
      });
    }
    
    return dailyAttendance;
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen w-full text-gray-800">
      <SideNav activeTab="credit" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopNav isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
          {/* Header Section */}
          <br></br>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Staff Attendance</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Date:</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p>{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-red-800 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Summary Section */}
          <div className="mb-4">
            <button 
              onClick={() => setShowSummarySection(!showSummarySection)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-all duration-300"
            >
              {showSummarySection ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                  Hide Summary Report
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  View Summary Report
                </>
              )}
            </button>
          </div>

          {/* Summary Section - Only shown when toggled */}
          {showSummarySection && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 transition-all duration-300">
              <h2 className="text-lg font-bold mb-4">Attendance Summary</h2>
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchAttendanceSummary}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md w-full md:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : 'Generate Summary'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSummary && summaryData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 transition-all duration-300">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Deduction Summary ({new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records Count</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Deduction %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {summaryData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">{item.count}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.averageDeduction > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.averageDeduction.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clear Summary Button */}
            {showSummary && summaryData.length > 0 && (
            <div className="mb-4 flex justify-end">
                <button
                onClick={() => {
                    setSummaryData([]);
                    setShowSummary(false);
                    // Optionally, reset dates too
                    setStartDate('');
                    setEndDate('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-all"
                >
                Clear Summary
                </button>
            </div>
            )}


        
          {/* Filter Section */}
          {!loading && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex items-center">
                <span className="mr-3 text-gray-600">Filter by status:</span>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
                <div className="ml-auto">
                  <span className="text-gray-600">
                    Showing records for: {new Date(selectedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          {!loading && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Lost</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction %</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDailyAttendance().length > 0 ? (
                      filteredDailyAttendance().map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4">{item.staff.name}</td>
                          <td className="py-3 px-4">
                            {item.attendance ? item.attendance.shiftTime : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.attendance ? formatTime(item.attendance.checkInTime) : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.attendance ? (
                              item.attendance.checkOutTime ? (
                                formatTime(item.attendance.checkOutTime)
                              ) : (
                                <button
                                  onClick={() => handleCheckOut(item.attendance)}
                                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                  Check Out
                                </button>
                              )
                            ) : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.attendance ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                                item.attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.attendance.status}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not Checked
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {item.attendance ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.attendance.timeLost > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {formatTimeLost(item.attendance.timeLost)}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.attendance && item.attendance.deductionPercentage ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.attendance.deductionPercentage > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {item.attendance.deductionPercentage.toFixed(2)}%
                              </span>
                            ) : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(selectedDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {item.attendance ? item.attendance.remarks : "-"}
                            </td>

                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              {!item.attendance ? (
                                <button 
                                  onClick={() => {
                                    setSelectedStaff(item.staff);
                                    setShowCheckInForm(true);
                                  }}
                                  className="text-green-600 hover:text-green-800 px-2 py-1 bg-green-100 rounded text-sm"
                                  title="Check In"
                                >
                                  <i className="fas fa-sign-in-alt mr-1"></i> Check In
                                </button>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => setEditingAttendance(item.attendance)}
                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-100 rounded text-sm"
                                    title="Edit"
                                  >
                                    <i className="fas fa-edit mr-1"></i> Edit
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="py-8 text-center text-gray-500">
                          No staff records found for selected date
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Check-In Form Modal */}
          {showCheckInForm && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Check In - {selectedStaff.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Date: {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    handleCheckIn(data);
                  }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time *</label>
                      <input 
                        type="time" 
                        name="checkInTime"
                        defaultValue={new Date().toTimeString().substring(0, 5)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                        readOnly={currentUserRole !== 'admin'}
                        />
                      <p className="text-xs text-gray-500 mt-1">
                        Shift will be automatically determined: Morning if before 12 PM, Afternoon if at or after 12 PM
                      </p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select 
                        name="status"
                        defaultValue="present"
                        className="w-full border rounded-md px-3 py-2"
                        required
                      >
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                      <textarea 
                        name="remarks"
                        className="w-full border rounded-md px-3 py-2"
                        rows="2"
                        placeholder="Any additional notes..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowCheckInForm(false);
                          setSelectedStaff(null);
                        }}
                        className="px-4 py-2 border rounded-md"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : 'Check In'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Attendance Form Modal */}
          {editingAttendance && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Edit Attendance - {editingAttendance.name}
                  </h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    handleUpdateAttendance(data);
                  }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name *</label>
                      <select 
                        name="name"
                        defaultValue={editingAttendance.name}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select Staff</option>
                        {staffList.map(staff => (
                          <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time *</label>
                      <input 
                        type="time" 
                        name="checkInTime"
                        defaultValue={extractTimeFromISO(editingAttendance.checkInTime)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                        onChange={(e) => {
                          // Recalculate time lost when check-in time changes
                          const checkInTime = createDateTime(e.target.value, selectedDate);
                          const shiftTime = determineShift(e.target.value);
                          const timeLostMinutes = calculateTimeLost(checkInTime, shiftTime);
                          const deductionPercentage = calculateDeductionPercentage(timeLostMinutes, shiftTime);
                          
                          // Update the displayed time lost
                          document.getElementById('timeLostDisplay').value = formatTimeLost(timeLostMinutes);
                          document.getElementById('deductionDisplay').value = `${deductionPercentage.toFixed(2)}%`;
                        }}
                        readOnly={currentUserRole !== 'admin'}
                        />
                      <p className="text-xs text-gray-500 mt-1">
                        Shift will be automatically determined: Morning if before 12 PM, Afternoon if at or after 12 PM
                      </p>
                    </div>
                    <div className="mb-4">
                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">Check Out Time</label> */}
                      <input 
                        type="time" 
                        name="checkOutTime"
                        defaultValue={extractTimeFromISO(editingAttendance.checkOutTime)}
                        className="w-full border rounded-md px-3 py-2"
                        hidden={currentUserRole !== 'admin'} // Show only for admin users
                        />
                    </div>
                    {/* <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select 
                        name="status"
                        defaultValue={editingAttendance.status}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      >
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div> */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Lost</label>
                      <input 
                        id="timeLostDisplay"
                        type="text" 
                        value={formatTimeLost(editingAttendance.timeLost)}
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deduction Percentage</label>
                      <input 
                        id="deductionDisplay"
                        type="text" 
                        value={`${editingAttendance.deductionPercentage?.toFixed(2) || '0.00'}%`}
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                      <textarea 
                        name="remarks"
                        defaultValue={editingAttendance.remarks}
                        className="w-full border rounded-md px-3 py-2"
                        rows="2"
                        placeholder="Any additional notes..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingAttendance(null);
                        }}
                        className="px-4 py-2 border rounded-md"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : 'Update'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}