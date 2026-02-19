"use client";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function Inventory() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('/api/inventory?lastMonth=true');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory data');
        }
        const data = await response.json();
        setInventoryData(data.inventory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Process data to get accurate monthly summary
  const processMonthlySummary = () => {
    const summary = {};
    
    // First, sort data by date to ensure proper sequence
    const sortedData = [...inventoryData].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Process each item
    sortedData.forEach(item => {
      if (!summary[item.title]) {
        summary[item.title] = {
          title: item.title,
          category: item.category,
          totalSales: 0,
          totalReceived: 0,
          openingStock: 0,
          closingStock: 0,
          isMl: item.isMl,
          threshold: item.threshold,
          daysWithData: 0,
          lastRecordedDate: null
        };
      }
      
      // Update summary
      summary[item.title].totalSales += item.sales || 0;
      summary[item.title].totalReceived += item.received || 0;
      
      // For the first record of each product, capture the opening stock
      if (summary[item.title].daysWithData === 0) {
        summary[item.title].openingStock = item.opening || 0;
      }
      
      // Always update closing stock to the latest value
      summary[item.title].closingStock = item.closing || 0;
      summary[item.title].daysWithData += 1;
      summary[item.title].lastRecordedDate = item.date;
    });
    
    return Object.values(summary);
  };

  const monthlySummary = processMonthlySummary();

  // Calculate totals for summary cards
  const totalOpening = monthlySummary.reduce((sum, item) => sum + item.openingStock, 0);
  const totalReceived = monthlySummary.reduce((sum, item) => sum + item.totalReceived, 0);
  const totalSales = monthlySummary.reduce((sum, item) => sum + item.totalSales, 0);
  const totalClosing = monthlySummary.reduce((sum, item) => sum + item.closingStock, 0);

  if (loading) {
    return (
      <div className="flex bg-white min-h-screen w-full">
        <SideNav activeTab="inventory" isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <TopNav 
            isSidebarCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 p-3 sm:p-6 transition-all duration-300 ml-0 md:ml-64 mt-12 sm:mt-14`}>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-white min-h-screen w-full">
        <SideNav activeTab="inventory" isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <TopNav 
            isSidebarCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 p-3 sm:p-6 transition-all duration-300 ml-0 md:ml-64 mt-12 sm:mt-14`}>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen w-full">
      <SideNav activeTab="inventory" isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <TopNav 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        <div className={`flex-1 p-3 sm:p-6 transition-all duration-300 ml-0 md:ml-64 mt-12 sm:mt-14`}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Monthly Inventory Summary</h1>
            <p className="text-gray-600">Overview of inventory performance for the selected period</p>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Opening Stock</h3>
              <p className="text-2xl font-bold text-blue-600">{totalOpening.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Received</h3>
              <p className="text-2xl font-bold text-green-600">{totalReceived.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
              <p className="text-2xl font-bold text-red-600">{totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Closing Stock</h3>
              <p className={`text-2xl font-bold ${totalClosing < 0 ? 'text-red-600' : 'text-purple-600'}`}>
                {totalClosing.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Inventory Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
                <p className="text-sm text-gray-600 mt-1">Detailed inventory breakdown by product</p>
              </div>
              <div className="flex space-x-2">
                <select 
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  <option value={0}>January</option>
                  <option value={1}>February</option>
                  <option value={2}>March</option>
                  <option value={3}>April</option>
                  <option value={4}>May</option>
                  <option value={5}>June</option>
                  <option value={6}>July</option>
                  <option value={7}>August</option>
                  <option value={8}>September</option>
                  <option value={9}>October</option>
                  <option value={10}>November</option>
                  <option value={11}>December</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opening Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Closing Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Threshold
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlySummary.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.isMl ? 'Liquid (ml)' : 'Units'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.openingStock.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{item.totalReceived.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{item.totalSales.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.closingStock < 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.closingStock.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.threshold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.closingStock <= item.threshold 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.closingStock <= item.threshold ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                      Totals:
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {totalOpening.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-green-600">
                      +{totalReceived.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-red-600">
                      -{totalSales.toLocaleString()}
                    </td>
                    <td className={`px-6 py-3 text-sm font-medium ${
                      totalClosing < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {totalClosing.toLocaleString()}
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Showing {monthlySummary.length} products • Data from the selected period
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}