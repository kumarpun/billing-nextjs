"use client";
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiX, FiAlertTriangle, FiCalendar } from "react-icons/fi";
import { FaWineBottle, FaGlassWhiskey, FaBeer } from "react-icons/fa";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";
import toast from "react-hot-toast";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [opening, setOpening] = useState(0);
  const [received, setReceived] = useState(0);
  const [sales, setSales] = useState(0);
  const [title, setTitle] = useState(0);
  const [manualOrderAdjustment, setManualOrderAdjustment] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Form state for adding new item
  const [formData, setFormData] = useState({
    title: '',
    opening: '',
    ml: '',
    bottle: '',
    received: '',
    category: '',
    threshold: ''
  });

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch inventory data with date filter on initial load
  useEffect(() => {
    fetchData();
  }, []);

  const buildApiUrl = () => {
    let url = '/api/inventory?';
    
    switch(dateFilter) {
      case 'today':
        url += 'today=true';
        break;
      case 'lastWeek':
        url += 'lastWeek=true';
        break;
      case 'lastMonth':
        url += 'lastMonth=true';
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          url += `startDate=${customStartDate}&endDate=${customEndDate}`;
        } else {
          // Fallback to today if custom dates not set
          url += 'today=true';
        }
        break;
      default:
        url += 'today=true';
    }
    
    return url;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build API URL based on selected filters
      const apiUrl = buildApiUrl();
      
      // Fetch inventory items
      const inventoryResponse = await fetch(apiUrl);
      if (!inventoryResponse.ok) {
        const errorData = await inventoryResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch inventory');
      }
      const inventoryData = await inventoryResponse.json();
      
      // Fetch order data for the same date range
      const orderResponse = await fetch(`/api/inventoryOrder?${apiUrl.split('?')[1]}`);
      if (!orderResponse.ok) throw new Error('Failed to fetch order data');
      const orderData = await orderResponse.json();
      
      // Transform API data to match UI expectations
      const normalizeText = (text) => text.toLowerCase().trim();

      const transformedData = inventoryData.inventory.map(item => {
        const normalizedTitle = normalizeText(item.title);
        let orderSentValue = 0;
        
        // Check if this is an ML-based product and get the corresponding order data
        if (normalizedTitle.includes("8848")) {
          orderSentValue = orderData.total_8848_ml || 0;
        } else if (normalizedTitle.includes("nude")) {
          orderSentValue = orderData.total_Nude_ml || 0;
        } else if (normalizedTitle.includes("absolute")) {
          orderSentValue = orderData.total_Absolute_ml || 0;
        } else if (normalizedTitle.includes("old durbar regular")) {
          orderSentValue = orderData.total_Old_Durbar_Regular_ml || 0;
        } else if (normalizedTitle.includes("chimney")) {
          orderSentValue = orderData.total_Chimney_ml || 0;
        } else if (normalizedTitle.includes("gurkhas") || normalizedTitle.includes("guns")) {
          orderSentValue = orderData.total_Gurkhas_Guns_ml || 0;
        } else if (normalizedTitle.includes("jack daniel")) {
          orderSentValue = orderData.total_Jack_Daniel_ml || 0;
        } else if (normalizedTitle.includes("glenfiddich")) {
          orderSentValue = orderData.total_Glenfiddich_ml || 0;
        } else if (normalizedTitle.includes("jw double")) {
          orderSentValue = orderData.total_JW_Double_ml || 0;
        } else if (normalizedTitle.includes("jw black")) {
          orderSentValue = orderData.total_JW_Black_ml || 0;
        } else if (normalizedTitle.includes("chivas")) {
          orderSentValue = orderData.total_Chivas_ml || 0;
        } else if (normalizedTitle.includes("jameson")) {
          orderSentValue = orderData.total_Jameson_ml || 0;
        } else if (normalizedTitle.includes("baileys")) {
          orderSentValue = orderData.total_Baileys_ml || 0;
        } else if (normalizedTitle.includes("triple")) {
          orderSentValue = orderData.total_Triple_ml || 0;
        } else if (normalizedTitle.includes("khukri rum light")) {
          orderSentValue = orderData.total_Khukri_Rum_light_ml || 0;
        } else if (normalizedTitle.includes("khukri rum dark")) {
          orderSentValue = orderData.total_Khukri_Rum_dark_ml || 0;
        } else if (normalizedTitle.includes("khukri spiced rum")) {
          orderSentValue = orderData.total_Khukri_Spiced_Rum_ml || 0;
        } else if (normalizedTitle.includes("beefeater")) {
          orderSentValue = orderData.total_Beefeater_ml || 0;
        } else if (normalizedTitle.includes("snow man")) {
          orderSentValue = orderData.total_Snow_man_ml || 0;
        } else if (normalizedTitle.includes("agavita")) {
          orderSentValue = orderData.total_Agavita_ml || 0;
        } else {
          // For non-ML products, use the title as the key (case-insensitive)
          const matchingKey = Object.keys(orderData).find(key => 
            normalizeText(key) === normalizedTitle
          );
          orderSentValue = matchingKey ? orderData[matchingKey] : 0;
        }
        
        // Calculate total order sent (customer orders + manual adjustment)
        const totalOrderSent = orderSentValue + (item.manualOrderAdjustment || 0);
        
        return {
          id: item._id,
          name: item.title,
          category: item.category || "Other",
          opening: item.opening || 0,
          received: item.received || 0,
          sales: item.sales || 0,
          closing: item.closing || 0,
          ml: item.ml || null,
          bottle: item.bottle || null,
          threshold: item.threshold || 5,
          lastUpdated: item.updatedAt || item.date,
          orderSent: totalOrderSent,
          customerOrder: orderSentValue,
          manualOrderAdjustment: item.manualOrderAdjustment || 0
        };
      });
      
      setInventoryItems(transformedData);
      setOrderData(orderData);
      setFiltersApplied(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setFiltersApplied(false);
  };

  // Handle custom date changes
  const handleCustomStartDateChange = (e) => {
    setCustomStartDate(e.target.value);
    setFiltersApplied(false);
  };

  const handleCustomEndDateChange = (e) => {
    setCustomEndDate(e.target.value);
    setFiltersApplied(false);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (dateFilter === 'custom' && (!customStartDate || !customEndDate)) {
      setError('Please select both start and end dates for custom range');
      return;
    }
    fetchData();
    setShowFilters(false);
  };

  const handleCreateOpeningStock = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventoryOpening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || 'Failed to create opening stock');
  
      // Refresh inventory after creating opening stock
      await fetchData();
  
      toast.success(data.message || "Opening stock created successfully");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for add form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add item submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsAddLoading(true);
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          opening: parseFloat(formData.opening) || 0,
          ml: parseFloat(formData.ml) || 0,
          bottle: formData.bottle || null,
          received: parseFloat(formData.received) || 0,
          category: formData.category || "Other",
          threshold: parseFloat(formData.threshold) || 5
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add inventory item');

      setFormData({ title: '', opening: '', ml: '', received: '', category: '', threshold: '', bottle: '' });
      setIsAddModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setOpening(item.opening);
    setReceived(item.received);
    setSales(item.sales);
    setTitle(item.name);
    setManualOrderAdjustment(item.manualOrderAdjustment);
    setIsEditModalOpen(true);
  };

  // Handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/inventory/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opening: parseFloat(opening),
          received: parseFloat(received),
          sales: parseFloat(sales),
          title: title,
          manualOrderAdjustment: parseFloat(manualOrderAdjustment)
        }),
      });

      if (!response.ok) throw new Error('Failed to update inventory');

      setIsEditModalOpen(false);
      fetchData();
      toast.success("Inventory updated successfully");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to update inventory");
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
      case 'whiskey':
        return <FaGlassWhiskey className="text-amber-600" />;
      case 'beer':
        return <FaBeer className="text-yellow-500" />;
      case 'vodka':
      case 'wine':
        return <FaWineBottle className="text-blue-500" />;
      default:
        return <FaWineBottle className="text-purple-500" />;
    }
  };

  // Get current filter display text
  const getFilterDisplayText = () => {
    switch(dateFilter) {
      case 'today':
        return 'Today';
      case 'lastWeek':
        return 'Last 7 Days';
      case 'lastMonth':
        return 'Last 30 Days';
      case 'custom':
        return customStartDate && customEndDate 
          ? `${customStartDate} to ${customEndDate}`
          : 'Custom Range';
      default:
        return 'Today';
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
                <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Opening Stock
                    </label>
                    <input
                      type="number"
                      value={opening}
                      onChange={(e) => setOpening(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Received Today
                    </label>
                    <input
                      type="number"
                      value={received}
                      onChange={(e) => setReceived(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Sales
                    </label>
                    <input
                      type="number"
                      value={sales}
                      onChange={(e) => setSales(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Manual Order Adjustment
                    </label>
                    <input
                      type="number"
                      value={manualOrderAdjustment}
                      onChange={(e) => setManualOrderAdjustment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Customer orders: {currentItem?.customerOrder || 0}
                    </p>
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
          
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-none p-8 w-full max-w-lg border-4 border-black shadow-xl">       
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="title">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                      disabled={isAddLoading}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="opening">
                      Opening Stock (in ml for liquor)
                    </label>
                    <input
                      type="number"
                      id="opening"
                      name="opening"
                      value={formData.opening}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                      disabled={isAddLoading}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="btl">
                    Liquor (in bottle)
                    </label>
                    <input
                      type="text"
                      id="bottle"
                      name="bottle"
                      value={formData.bottle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      disabled={isAddLoading}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      disabled={isAddLoading}
                    >
                      <option value="">Select Category</option>
                      <option value="Whiskey">Whiskey</option>
                      <option value="Vodka">Vodka</option>
                      <option value="Beer">Beer</option>
                      <option value="Wine">Wine</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="threshold">
                      Threshold (Low Stock Alert)
                    </label>
                    <input
                      type="number"
                      id="threshold"
                      name="threshold"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      disabled={isAddLoading}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setFormData({ title: '', opening: '', ml: '', received: '', category: '', threshold: '', bottle: '' });
                      }}
                      className="px-6 py-3 border-2 border-black bg-white text-black hover:bg-gray-100 font-medium transition-colors duration-200"
                      disabled={isAddLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-medium flex items-center gap-2 transition-colors duration-200"
                      disabled={isAddLoading}
                    >
                      {isAddLoading ? (
                        <span className="animate-spin">↻</span>
                      ) : null}
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <br />
          <div className="max-w-7xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <FiAlertTriangle className="mr-2" />
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-700 hover:text-red-900"
                >
                  <FiX />
                </button>
              </div>
            )}
            
            {/* Header with Date Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">Bar Inventory</h3>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 text-black"
                    >
                      <FiFilter className="mr-2" />
                      {getFilterDisplayText()}
                      {!filtersApplied && dateFilter !== 'today' && (
                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                    
                    {showFilters && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
                        <div className="space-y-3 text-black">
                          <button
                            onClick={() => handleDateFilterChange('today')}
                            className={`block w-full text-left px-4 py-2 rounded-md ${dateFilter === 'today' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                          >
                            Today
                          </button>
                          <button
                            onClick={() => handleDateFilterChange('lastWeek')}
                            className={`block w-full text-left px-4 py-2 rounded-md ${dateFilter === 'lastWeek' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                          >
                            Last 7 Days
                          </button>
                          <button
                            onClick={() => handleDateFilterChange('lastMonth')}
                            className={`block w-full text-left px-4 py-2 rounded-md ${dateFilter === 'lastMonth' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                          >
                            Last 30 Days
                          </button>
                          <button
                            onClick={() => handleDateFilterChange('custom')}
                            className={`block w-full text-left px-4 py-2 rounded-md ${dateFilter === 'custom' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                          >
                            Custom Range
                          </button>
                          
                          {/* Custom date range inputs */}
                          {dateFilter === 'custom' && (
                            <div className="pt-3 border-t">
                              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={customStartDate}
                                onChange={handleCustomStartDateChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                              />
                              <label className="block text-xs text-gray-500 mb-1">End Date</label>
                              <input
                                type="date"
                                value={customEndDate}
                                onChange={handleCustomEndDateChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          )}
                          
                          <button
                            onClick={handleSearchClick}
                            disabled={dateFilter === 'custom' && (!customStartDate || !customEndDate)}
                            className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${dateFilter === 'custom' && (!customStartDate || !customEndDate) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                          >
                            <FiSearch className="mr-2" />
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors duration-200"
                >
                  <FiPlus className="mr-2" />
                  Add Item
                </button>
                <button 
                        onClick={handleCreateOpeningStock}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors duration-200"
                    >
                        <FiCalendar className="mr-2" />
                        Create Opening Stock
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
                        Opening Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Sent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Closing Stock
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
                          <div className="text-sm font-medium text-gray-700">
                            {item.opening} {item.ml && `(${item.ml}ml)`}
                            {item.bottle && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.bottle})
                            </span>
                          )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.received}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">
                            {item.orderSent}
                            {item.manualOrderAdjustment > 0 && (
                              <span className="text-xs text-green-600 ml-1">
                                (+{item.manualOrderAdjustment} manual)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">
                            {item.closing} {item.ml && `(${item.ml}ml)`}
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
          </div>
        </div>
      </div>
    </div>
  );
}