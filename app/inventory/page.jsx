"use client";
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiX, FiAlertTriangle } from "react-icons/fi";
import { FaWineBottle, FaGlassWhiskey, FaBeer } from "react-icons/fa";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [ml, setMl] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Calculate low stock items count
  const lowStockItems = inventoryItems.filter(item => item.stock <= item.threshold);
  const lowStockCount = lowStockItems.length;

  // Fetch inventory data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch inventory items
      const inventoryResponse = await fetch('/api/inventory');
      if (!inventoryResponse.ok) throw new Error('Failed to fetch inventory');
      const inventoryData = await inventoryResponse.json();
      
      // Fetch order data for today
      const orderResponse = await fetch('/api/inventoryOrder?today=true');
      if (!orderResponse.ok) throw new Error('Failed to fetch order data');
      const orderData = await orderResponse.json();
      
      // Transform API data to match our UI structure
      const transformedData = inventoryData.inventory.map(item => ({
        id: item._id,
        name: item.title,
        category: item.title.includes("8848") || item.title.includes("Nude") ? "Vodka" : "Beer",
        stock: item.quantity,
        ml: item.ml || null,
        threshold: (item.title.includes("8848") || item.title.includes("Nude")) ? 1 : 5,
        lastUpdated: new Date(item.updatedAt).toISOString().split('T')[0],
        price: 650,
        // Handle special cases for 8848 and Nude items
        orderSent: item.title.includes("8848") 
          ? orderData.total_8848_ml 
          : item.title.includes("Nude")
            ? orderData.total_Nude_ml
            : orderData[item.title] || 0,
        stockRemaining: item.quantity - (orderData[item.title] || 0)
      }));
      
      setInventoryItems(transformedData);
      setOrderData(orderData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setQuantity(item.stock);
    setMl(item.ml);
    setIsEditModalOpen(true);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(parseFloat(e.target.value));
  };

  const handleMlChange = (e) => {
    setMl(parseInt(e.target.value));
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/inventory/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newTitle: currentItem.name,
          newQuantity: quantity,
          newMl: ml
        }),
      });

      if (!response.ok) throw new Error('Failed to update inventory');

      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'whisky':
        return <FaGlassWhiskey className="text-amber-600" />;
      case 'beer':
        return <FaBeer className="text-yellow-500" />;
      case 'vodka':
        return <FaWineBottle className="text-blue-500" />;
      default:
        return <FaWineBottle className="text-purple-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex bg-white min-h-screen w-full">
        <SideNav activeTab="inventory" isCollapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col">
          <TopNav 
            isSidebarCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"} flex items-center justify-center`}>
            <FiRefreshCw className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-white min-h-screen w-full">
        <SideNav activeTab="inventory" isCollapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col">
          <TopNav 
            isSidebarCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
            <div className="text-red-500 text-lg">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen w-full">
      <SideNav activeTab="inventory" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopNav 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit {currentItem?.name}</h2>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Ml
                    </label>
                    <input
                      type="number"
                      value={ml}
                      onChange={handleMlChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <br />
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">Bar Inventory</h3>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
              <a
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        href="https://docs.google.com/spreadsheets/d/12cSkaLAunGLEOEAz5ytbAYpqXnfs5pfw_JEZgOyNL34/edit?gid=255479975#gid=255479975"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Beverage stock
                    </a>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <FiPlus className="mr-2" />
                  Add Item
                </button>
                <button 
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => fetchData()}
                >
                  <FiRefreshCw className="mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {lowStockCount > 0 && (
              <div className="mb-6 bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl border-l-4 border-pink-500">
                <div className="flex items-center">
                  <FiAlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <h3 className="text-sm font-semibold text-red-800">
                    Low stock - {lowStockCount}{" "}
                    ({lowStockItems.map(item => item.name).join(", ")})
                  </h3>
                </div>
              </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Sent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Remaining
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2.5 rounded-full ${item.stock <= item.threshold ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.min(100, (item.stock / (item.threshold * 2)) * 100)}%` }}></div>
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              {item.stock} 
                              {item.ml && ` (${item.ml}ml)`}
                              {item.stock <= item.threshold && <span className="text-red-500"> (Low)</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">
                            {item.name.includes("8848") 
                              ? `${item.orderSent}ml`
                              : item.name.includes("Nude")
                                ? `${item.orderSent}ml`
                                : item.orderSent}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            item.stockRemaining <= item.threshold ? 'text-red-500' : 'text-gray-700'
                          }`}>
                            {item.name.includes("8848") 
                              ? `${(item.ml || 750) - (orderData.total_8848_ml || 0)}ml`
                              : item.name.includes("Nude")
                                ? `${(item.ml || 180) - (orderData.total_Nude_ml || 0)}ml`
                                : item.stockRemaining}
                            {item.stockRemaining <= item.threshold && (
                              <span className="ml-1 text-red-500 text-xs">(Reorder needed)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.lastUpdated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 bg-white px-6 py-3 rounded-xl shadow-sm">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{inventoryItems.length}</span> of <span className="font-medium">{inventoryItems.length}</span> items
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}