"use client";

import { useEffect, useState } from "react";
import { FiGift, FiCalendar } from "react-icons/fi";
import { FaBirthdayCake } from "react-icons/fa";

export default function EmployeeBirthday() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employee');
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        setEmployees(data.employee || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Check if birthday is today or within next 25 days
  const getDaysUntilBirthday = (dobString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
  
    const birthDate = new Date(dobString);
    const nextBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    nextBirthday.setHours(0, 0, 0, 0); // Normalize to midnight
  
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
  
    const diffTime = nextBirthday - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };
  

  // Filter employees with birthdays
  const upcomingBirthdays = employees.filter(emp => {
    const days = getDaysUntilBirthday(emp.dob);
    return days <= 25;
  }).sort((a, b) => {
    return getDaysUntilBirthday(a.dob) - getDaysUntilBirthday(b.dob);
  });

  // Separate today's birthdays from upcoming ones
  const todaysBirthdays = upcomingBirthdays.filter(emp => getDaysUntilBirthday(emp.dob) === 0);
  const futureBirthdays = upcomingBirthdays.filter(emp => getDaysUntilBirthday(emp.dob) > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-sm font-semibold text-red-800">Error: {error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* <div className="flex items-center mb-6">
        <FiGift className="text-pink-500 text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Birthday Celebrations</h1>
      </div> */}

      {/* Today's Birthdays Section */}
      {todaysBirthdays.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaBirthdayCake className="text-pink-500 text-xl mr-2 -mt-5" />
            <h2 className="text-xl font-semibold text-pink-700">Today's Birthdays</h2>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl border-l-4 border-pink-500">
            {todaysBirthdays.map((employee) => (
              <div key={employee._id} className="mb-4 last:mb-0">
                <div className="flex items-center">
                  <div className="bg-pink-200 p-3 rounded-full mr-4">
                    <FaBirthdayCake className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-pink-800">
                      🎉 Happy Birthday, {employee.name}! 🎉
                    </h3>
                    <p className="text-pink-700">{employee.designation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Birthdays Section */}
      {futureBirthdays.length > 0 ? (
        <div>
         <div className="flex items-center mb-4">
            <FiGift className="text-purple-700 text-xl mr-2 -mt-5" />
            <h2 className="text-xl font-semibold text-purple-700 leading-none">Upcoming Birthdays</h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureBirthdays.map((employee) => {
              const daysUntil = getDaysUntilBirthday(employee.dob);
              
              return (
                <div 
                  key={employee._id} 
                  className="relative p-5 rounded-xl shadow-sm border-l-4 bg-white border-purple-300"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600">
                      <FiGift className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {employee.name}
                      </h3>
                      <div className="mt-1">
                        <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          In {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(employee.dob).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : upcomingBirthdays.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiCalendar className="text-blue-500 mr-3" />
            <p className="text-blue-800">No upcoming birthdays in the next 25 days</p>
          </div>
        </div>
      )}
    </div>
  );
}