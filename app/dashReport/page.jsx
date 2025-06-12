"use client";
import Link from "next/link";
import { FaChartBar, FaMoneyBillWave, FaUsers, FaUtensils, FaHome, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
import { useState, useEffect } from "react";
import SalesReportFilter from "../components/SalesReportFilter";
import SalesReportClient from "../components/orderReportFilter";
import Employee from "../employee/page";
import Inventory from "../inventory/page";
import EmployeeBirthday from "../empbirthday/page";

// Add this at the top of dashReport.jsx
const getRunningTablesCount = async () => {
  try {
    const res = await fetch('https://billing-nextjs.vercel.app/api/tables', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tables");
    }

    const data = await res.json();
    const tables = data.tables;

    if (!Array.isArray(tables)) {
      return 0;
    }

    // Fetch orders for each table and count running tables
    const runningTablesCount = await Promise.all(tables.map(async (table) => {
        const orderRes = await fetch(`https://billing-nextjs.vercel.app/api/orders/${table._id}`, {
        cache: 'no-store',
      });
      const orders = await orderRes.json();
      return orders.orderbyTableId.length > 0;
    })).then(results => results.filter(Boolean).length);

    return runningTablesCount;
  } catch (error) {
    console.error("Error loading tables: ", error);
    return 0;
  }
};

export default function DashReport() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedFilter] = useState("today");
  const [totalFinalPrice, setTotalFinalPrice] = useState(0);
  const [runningTablesCount, setRunningTablesCount] = useState(0);
  const [isLoadingTables, setIsLoadingTables] = useState(true); // New loading state
  const [showInventoryWarning, setShowInventoryWarning] = useState(false);
  const [inventoryLastUpdated, setInventoryLastUpdated] = useState(null);

  const [salesData] = useState([
    { id: 1, date: "2023-10-01", amount: 1200, items: 45 },
    { id: 2, date: "2023-10-02", amount: 1850, items: 62 },
    { id: 3, date: "2023-10-03", amount: 2100, items: 78 },
  ]);

  const handleLogout = (e) => {
    e.preventDefault();
    alert("Logging out..."); // Replace with actual logout logic
  };

  const checkInventoryUpdates = async () => {
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if ANY item was updated today
      const anyUpdatedToday = data.inventory.some(item => {
        const updatedDate = new Date(item.updatedAt).toISOString().split('T')[0];
        return updatedDate === today;
      });
      
      if (!anyUpdatedToday) {
        // Find the oldest update date among all items
        const oldestUpdate = data.inventory.reduce((oldest, item) => {
          const itemDate = new Date(item.updatedAt);
          return itemDate < oldest ? itemDate : oldest;
        }, new Date());
        
        setInventoryLastUpdated(oldestUpdate.toISOString().split('T')[0]);
        setShowInventoryWarning(true);
      } else {
        setShowInventoryWarning(false); // Hide warning if any item was updated today
      }
    } catch (error) {
      console.error("Error checking inventory updates:", error);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
        try {
            let query = `/api/bill?${selectedFilter}=true`;
            const res = await fetch(query, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch report");
            const data = await res.json();
            setTotalFinalPrice(data.totalFinalPrice || 0);

            const count = await getRunningTablesCount();
            setRunningTablesCount(count);

            await checkInventoryUpdates();
        } catch (error) {
            console.error("Error loading report:", error);
            setTotalFinalPrice(0);
            setRunningTablesCount(0);
        } finally {
          setIsLoadingTables(false); // Set loading to false when done
      }
    };

    fetchReport();
}, [selectedFilter]);

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col">
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

        {showInventoryWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Inventory Update Required</h3>
                <div className="mt-2 text-sm text-gray-500">
                  {/* <p>Some inventory items haven't been updated today. Last update was on {inventoryLastUpdated}.</p> */}
                  <p>Some inventory items haven't been updated today. Last update was on {new Date(inventoryLastUpdated).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}.</p>
                  <p className="mt-2">Please update your inventory to ensure accurate stock levels.</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => setShowInventoryWarning(false)}
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar + Main Content Layout */}
      <div className="flex">
        {/* Sidebar (Dark Theme) */}
        <div className="w-64 fixed h-screen bg-[#283141]">
          <div className="flex items-center justify-center mb-8 mt-8">
            {/* <h1 className="text-xl font-bold">HYBE Admin</h1> */}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link
              href="#"
              className={`flex items-center p-3 rounded-lg hover:bg-[#283141] transition ${activeTab === "dashboard" ? "bg-[#283141]" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
            <Link
              href="#"
              className={`flex items-center p-3 rounded-lg hover:bg-[#283141] transition ${activeTab === "sales" ? "bg-[#283141]" : ""}`}
              onClick={() => setActiveTab("sales")}
            >
              <FaChartBar className="mr-3" />
              Sales Report
            </Link>

            <Link
              href="#"
              className={`flex items-center p-3 rounded-lg hover:bg-[#283141] transition ${activeTab === "orders" ? "bg-[#283141]" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <FaChartBar className="mr-3" />
              Order Report
            </Link>

            <Link
              href="#"
              className={`flex items-center p-3 rounded-lg hover:bg-[#283141] transition ${activeTab === "inventory" ? "bg-[#283141]" : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              <FaUtensils className="mr-3" />
              Inventory
            </Link>

            <Link
              href="#"
              className={`flex items-center p-3 rounded-lg hover:bg-[#283141] transition ${activeTab === "employee" ? "bg-[#283141]" : ""}`}
              onClick={() => setActiveTab("employee")}
            >
              <FaUsers className="mr-3" />
              Employee
            </Link>
           
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg hover:bg-[#283141] transition"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === "sales" ? "Sales Report" : 
               activeTab === "orders" ? "Orders" : 
               activeTab === "customers" ? "Customers" : "Dashboard"}
            </h2>
          </div>

          {activeTab === "dashboard" && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ml-64 flex-1">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Today's Revenue</h3>
        <p className="text-2xl font-bold text-[#283141]">Rs. {totalFinalPrice.toLocaleString("en-IN")}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Table running</h3>
        {isLoadingTables ? (
          <div className="flex items-center justify-center h-8">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-2xl font-bold text-[#283141]">{runningTablesCount}</p>
        )}
      </div>
    </div>
    
    {/* Employee Birthday Section - Full width below the cards */}
    <div className="ml-64 flex-1">
      <EmployeeBirthday />
    </div>
  </>
)}

          {/* Sales Report Table (Visible on Sales Tab) */}
            {activeTab === "sales" && (
            <div className="ml-64 flex-1 -mt-20"> {/* Content area */} 
            <SalesReportFilter />
          </div>
          )}

        {activeTab === "orders" && (
                    <div className="ml-64 flex-1 -mt-20"> {/* Content area */} 
                    <SalesReportClient />
                </div>
                )}

        {activeTab === "inventory" && (
                            <div className="ml-64 flex-1 -mt-20"> {/* Content area */} 
                            <Inventory />
                        </div>
                        )}


          {activeTab === "employee" && (
                              <div className="ml-64 flex-1 -mt-20"> {/* Content area */} 
                              <Employee />
                          </div>
                          )}      
          {/* Placeholder for Other Tabs */}
          {/* {(activeTab === "employee" || activeTab === "customers") && (
            <div className="bg-white p-8 rounded-lg shadow text-center ml-64">
              <h3 className="text-xl font-semibold mb-4">
                {activeTab === "employee" ? "Employee Management" : "Customers Management"}
              </h3>
              <p className="text-gray-600">Content will appear here soon!</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}