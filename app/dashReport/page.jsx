"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import EmployeeBirthday from "../empbirthday/page";
import DutyRosterWarning from "../components/dutyWarning";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

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
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [showInventoryWarning, setShowInventoryWarning] = useState(false);
  const [inventoryLastUpdated, setInventoryLastUpdated] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    alert("Logging out...");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const checkInventoryUpdates = async () => {
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      
      const anyUpdatedToday = data.inventory.some(item => {
        const updatedDate = new Date(item.updatedAt).toISOString().split('T')[0];
        return updatedDate === today;
      });
      
      if (!anyUpdatedToday) {
        const oldestUpdate = data.inventory.reduce((oldest, item) => {
          const itemDate = new Date(item.updatedAt);
          return itemDate < oldest ? itemDate : oldest;
        }, new Date());
        
        setInventoryLastUpdated(oldestUpdate.toISOString().split('T')[0]);
        setShowInventoryWarning(true);
      } else {
        setShowInventoryWarning(false);
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
        setIsLoadingTables(false);
      }
    };

    fetchReport();
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Side Navigation */}
      <SideNav 
        activeTab={activeTab} 
        onLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* Top Navigation */}
      <TopNav isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Inventory Warning Modal */}
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
                  <p>Some inventory items haven't been updated today. Last update was on {new Date(inventoryLastUpdated).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}.</p>
                  <p className="mt-2">Please update your inventory to ensure accurate stock levels.</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href="/inventory"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Inventory
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DutyRosterWarning />

      {/* Main Content Area */}
      <div className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? "ml-24" : "ml-72"} mt-16`}>
        {activeTab === "dashboard" && (
          <>           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Today's Revenue</h3>
                <p className="text-2xl font-bold text-[#283141]">Rs. {totalFinalPrice.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Running Tables</h3>
                {isLoadingTables ? (
                  <div className="flex items-center justify-center h-8">
                    <div className="flex space-x-1 items-center">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-[#283141]">{runningTablesCount}</p>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <EmployeeBirthday />
            </div>
          </>
        )}
      </div>
    </div>
  );
}