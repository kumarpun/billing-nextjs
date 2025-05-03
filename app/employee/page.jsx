"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/employee');
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        // Map the API data to our expected format
        const formattedEmployees = data.employee.map(emp => ({
          id: emp._id,
          name: emp.name,
          phone: `+977 ${emp.phone.toString().substring(0, 3)}${emp.phone.toString().substring(3)}`,
          dob: emp.dob,
          designation: emp.designation,
          image: emp.image || "/mam.jpg" // Use API image if available, otherwise fallback
        }));
        setEmployees(formattedEmployees);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-semibold text-red-800">Error: {error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Employee Directory</h1>
      
      {employees.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-semibold text-blue-800">No employees found</h3>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3 p-4 flex justify-center">
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                    <Image 
                      src={employee.image}
                      alt={employee.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      unoptimized={employee.image.startsWith("http")} // Disable optimization for external images
                    />
                  </div>
                </div>
                <div className="w-full sm:w-2/3 p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{employee.name}</h2>
                  <div className="mt-3 space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Position:</span> {employee.designation}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Phone:</span> {employee.phone}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">DOB:</span> {formatDate(employee.dob)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}