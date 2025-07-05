"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaExclamationTriangle, FaFire, FaChartLine, FaMoneyBillWave, FaUtensils, FaBirthdayCake } from "react-icons/fa";
import { motion } from "framer-motion";
import EmployeeBirthday from "../empbirthday/page";
import DutyRosterWarning from "../components/dutyWarning";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";
import SalesTrendChart from "../components/SalesTrends";

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
  const [topItems, setTopItems] = useState([]);
  const [isLoadingTopItems, setIsLoadingTopItems] = useState(true);

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

  const fetchTopItems = async () => {
    try {
      const res = await fetch('/api/orderdetails?today=true', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch top items");
      const data = await res.json();
      
      // Group hookah items
      let hookahCount = 0;
      const otherItems = [];
      
      Object.entries(data).forEach(([name, quantity]) => {
        if (name.toLowerCase().includes('hookah')) {
          hookahCount += quantity;
        } else if (!["Shikhar Ice", "Water"].includes(name)) {
          otherItems.push({ name, quantity });
        }
      });

      // Add combined hookah if there are any hookah items
      if (hookahCount > 0) {
        otherItems.push({ name: "Hookah (All Types)", quantity: hookahCount });
      }

      // Sort and get top 5
      const itemsArray = otherItems
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      
      setTopItems(itemsArray);
    } catch (error) {
      console.error("Error loading top items:", error);
      setTopItems([]);
    } finally {
      setIsLoadingTopItems(false);
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
        await fetchTopItems();
      } catch (error) {
        console.error("Error loading report:", error);
        setTotalFinalPrice(0);
        setRunningTablesCount(0);
        setTopItems([]);
      } finally {
        setIsLoadingTables(false);
      }
    };

    fetchReport();
  }, [selectedFilter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const cardHover = {
    scale: 1.01,
    transition: { duration: 0.2 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Inventory Update Required</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Some inventory items haven't been updated today. Last update was on {new Date(inventoryLastUpdated).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}.</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href="/inventory"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      <div className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"} mt-16`}>
        {activeTab === "dashboard" && (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-4"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <FaMoneyBillWave className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">Today's Revenue</h3>
                    <p className="text-xl font-bold text-black">Rs. {totalFinalPrice.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <FaUtensils className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">Running Tables</h3>
                    {isLoadingTables ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-black">{runningTablesCount}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Half Row Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Compact Top Selling Items */}
              <motion.div 
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
                    <FaFire className="text-orange-500 text-sm" />
                    <span>Top Selling Items</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    Today
                  </span>
                </div>
                
                {isLoadingTopItems ? (
                  <div className="flex justify-center py-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  </div>
                ) : topItems.length > 0 ? (
                  <div className="space-y-2">
                    {topItems.map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between py-1.5 px-2 text-sm hover:bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className={`font-medium ${
                            index === 0 ? 'text-yellow-600' : 
                            index === 1 ? 'text-gray-600' : 
                            index === 2 ? 'text-amber-600' : 'text-blue-600'
                          }`}>
                            {index + 1}.
                          </span>
                          <span className="truncate text-black">{item.name}</span>
                        </div>
                        <span className="font-medium text-black">{item.quantity}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500 py-3">No sales data available</p>
                )}
              </motion.div>

              {/* Sales Trend */}
              <motion.div 
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-teal-500"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <FaChartLine className="text-teal-500 text-sm" />
                  <h3 className="text-md font-semibold text-gray-800">Sales Trend</h3>
                </div>
                {/* <div className="flex items-center justify-center h-28 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Chart visualization coming soon</p>
                </div> */}
                <SalesTrendChart />
              </motion.div>
            </div>

            {/* Employee Birthdays - Full Width */}
       
              <EmployeeBirthday compactMode={true} />
            </motion.div>
        )}
      </div>
    </div>
  );
}