"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import PageNav from "../../components/PageNav";

// Cache key constant
const MENU_CACHE_KEY = 'menu_items_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function AddOrder({ params }) {
    const { id } = params;
    const [order_title, setTitle] = useState("");
    const [order_description, setDescription] = useState("");
    const [table_id, setTableId] = useState("");
    const [order_status, setOrderStatus] = useState("Order accepted");
    const [customer_status, setCustomerStatus] = useState("Customer accepted");
    const [newOrdertitle, setnewOrdertitle] = useState(order_title);
    const [order_price, setOrderPrice] = useState("");
    const [order_quantity, setOrderQuantity] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [order_type, setOrderType] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [menuOptions, setMenuOptions] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);

    const router = useRouter();

    // Check if cache is valid
    const isCacheValid = (cache) => {
        if (!cache || !cache.timestamp) return false;
        return Date.now() - cache.timestamp < CACHE_DURATION;
    };

    // Fetch menu items from API with caching
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                setMenuLoading(true);
                
                // Check cache first
                const cached = localStorage.getItem(MENU_CACHE_KEY);
                if (cached) {
                    const cacheData = JSON.parse(cached);
                    if (isCacheValid(cacheData)) {
                        setMenuOptions(cacheData.menuOptions);
                        setMenuLoading(false);
                        return;
                    }
                }

                // If no valid cache, fetch from API
                const response = await fetch('/api/menu');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch menu');
                }
                
                const data = await response.json();
                
                if (data.menuList && Array.isArray(data.menuList)) {
                    // Transform API data to match the expected format
                    const options = data.menuList.map(item => ({
                        value: item.value,
                        label: item.label,
                        price: item.price,
                        order_type: item.order_type
                    }));
                    
                    // Update state
                    setMenuOptions(options);
                    
                    // Cache the data
                    const cacheData = {
                        menuOptions: options,
                        timestamp: Date.now()
                    };
                    localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(cacheData));
                } else {
                    console.error("Invalid menu data format:", data);
                    setMenuOptions([]);
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
                
                // Try to use stale cache if available, even if expired
                const cached = localStorage.getItem(MENU_CACHE_KEY);
                if (cached) {
                    const cacheData = JSON.parse(cached);
                    setMenuOptions(cacheData.menuOptions);
                } else {
                    setMenuOptions([]);
                }
            } finally {
                setMenuLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    // Function to manually refresh cache (optional)
    const refreshMenuCache = async () => {
        try {
            setMenuLoading(true);
            localStorage.removeItem(MENU_CACHE_KEY);
            
            const response = await fetch('/api/menu');
            const data = await response.json();
            
            if (data.menuList && Array.isArray(data.menuList)) {
                const options = data.menuList.map(item => ({
                    value: item.value,
                    label: item.label,
                    price: item.price,
                    order_type: item.order_type
                }));
                
                setMenuOptions(options);
                
                const cacheData = {
                    menuOptions: options,
                    timestamp: Date.now()
                };
                localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(cacheData));
            }
        } catch (error) {
            console.error("Error refreshing menu cache:", error);
        } finally {
            setMenuLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (selectedItems.length === 0) {
            newErrors.selectedItems = "Please select at least one item";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isLoading) return;
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Create an array of orders from selected items
            const orders = selectedItems.map(item => ({
                table_id: id,
                order_title: item.value,
                order_description,
                order_status,
                customer_status,
                order_price: item.price,
                order_quantity: item.quantity || 1,
                order_type: item.order_type
            }));

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(orders),
            });

            if (res.ok) {
                router.push(`/listOrder/${id}`);
                router.refresh();
            } else {
                throw new Error("Failed to create orders");
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleItemSelect = (selectedOptions) => {
        // Preserve existing items and their quantities
        const existingItemsMap = new Map();
        selectedItems.forEach(item => {
            existingItemsMap.set(item.value, item);
        });

        // Merge existing items with new selections, preserving quantities
        const mergedItems = selectedOptions.map(option => {
            const existingItem = existingItemsMap.get(option.value);
            if (existingItem) {
                return {
                    ...existingItem,
                    order_type: option.order_type
                };
            } else {
                return {
                    ...option,
                    quantity: 1
                };
            }
        });

        setSelectedItems(mergedItems);
        
        // Clear error if items are selected
        if (selectedOptions.length > 0 && errors.selectedItems) {
            setErrors(prev => ({...prev, selectedItems: ""}));
        }
    };

    const updateItemQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;
        
        setSelectedItems(prev => 
            prev.map((item, i) => 
                i === index ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (index) => {
        setSelectedItems(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllItems = () => {
        setSelectedItems([]);
    };

    const ClearIndicator = () => null;

    // Calculate total price
    const totalPrice = selectedItems.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);

    try {
        return (
            <>
                <div className="min-h-screen" style={{ backgroundColor: "#1a202c" }}>
                <PageNav
                    titleHref="/dashboard"
                    centerTitle
                    leftButton={{ label: "く", href: `/listOrder/${id}` }}
                    showLogout
                    onBeforeLogout={() => localStorage.removeItem(MENU_CACHE_KEY)}
                />
                    
                    <div className="max-w-6xl mx-auto p-4 mt-4">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-6 text-center">Add New Order</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Left Column - Selection and Info */}
                                    <div className="xl:col-span-1 space-y-6">
                                        {/* Item Selection with Clear All Button */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-gray-300 text-sm font-medium">Select Items</label>
                                                {selectedItems.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={clearAllItems}
                                                        className="text-red-400 hover:text-red-300 text-xs font-medium flex items-center transition-colors"
                                                        disabled={isLoading}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Clear All
                                                    </button>
                                                )}
                                            </div>
                                            <Select 
                                                isMulti
                                                options={menuOptions}
                                                onChange={handleItemSelect}
                                                value={selectedItems}
                                                isLoading={menuLoading}
                                                loadingMessage={() => "Loading menu items..."}
                                                noOptionsMessage={() => menuLoading ? "Loading..." : "No menu items found"}
                                                styles={{
                                                    control: (provided, state) => ({ 
                                                        ...provided, 
                                                        backgroundColor: '#2d3748',
                                                        borderColor: errors.selectedItems ? '#e53e3e' : state.isFocused ? '#4a5568' : '#4a5568',
                                                        color: 'white',
                                                        minHeight: '40px',
                                                        fontSize: '14px',
                                                        boxShadow: errors.selectedItems ? '0 0 0 1px #e53e3e' : provided.boxShadow,
                                                    }),
                                                    menu: (provided) => ({ 
                                                        ...provided, 
                                                        backgroundColor: '#2d3748',
                                                        color: 'white',
                                                        zIndex: 20
                                                    }),
                                                    multiValue: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: '#4a5568',
                                                    }),
                                                    multiValueLabel: (provided) => ({
                                                        ...provided,
                                                        color: 'white',
                                                        fontSize: '12px'
                                                    }),
                                                    multiValueRemove: () => ({
                                                        display: 'none'
                                                    }),
                                                    clearIndicator: () => ({
                                                        display: 'none'
                                                    }),
                                                    singleValue: (provided) => ({
                                                        ...provided,
                                                        color: 'white',
                                                        fontSize: '14px'
                                                    }),
                                                    input: (provided) => ({
                                                        ...provided,
                                                        color: 'white',
                                                        fontSize: '14px'
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        backgroundColor: state.isFocused ? '#4a5568' : '#2d3748',
                                                        color: 'white',
                                                        fontSize: '14px',
                                                        padding: '8px 12px'
                                                    }),
                                                    loadingIndicator: (provided) => ({
                                                        ...provided,
                                                        color: 'white'
                                                    })
                                                }}
                                                components={{
                                                    ClearIndicator,
                                                    IndicatorSeparator: null,
                                                }}
                                                placeholder={menuLoading ? "Loading menu..." : "Search and select items..."}
                                            />
                                            {errors.selectedItems && (
                                                <p className="text-red-400 text-xs mt-1 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.selectedItems}
                                                </p>
                                            )}
                                        </div>

                                        {/* Order Summary Card */}
                                        {selectedItems.length > 0 && (
                                            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                                <h3 className="text-white font-semibold mb-3 text-sm">Order Summary</h3>
                                                
                                                <div className="space-y-2 mb-3">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-300">Items:</span>
                                                        <span className="text-white">{selectedItems.length}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-300">Total Quantity:</span>
                                                        <span className="text-white">
                                                            {selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                                                        </span>
                                                    </div>
                                                  
                                                </div>
                                            </div>
                                        )}

                                        {/* Table Info */}
                                        <div className="md:col-span-2">
                                    <label className="block text-gray-300 mb-1 text-sm font-medium">Table Number</label>
                                    <div className="bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm">
                                        {id}
                                    </div>
                                </div>

                                        {/* Special Instructions */}
                                        <div>
                                            <label className="block text-gray-300 mb-2 text-sm font-medium">Special Instructions</label>
                                            <textarea
                                                onChange={(e) => setDescription(e.target.value)}
                                                value={order_description}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                                rows="3"
                                                placeholder="Any special requests or notes for all items..."
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column - Selected Items */}
                                    <div className="xl:col-span-3">
                                        {selectedItems.length > 0 ? (
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-gray-300 text-sm font-medium">
                                                        Selected Items ({selectedItems.length})
                                                    </label>
                                                </div>
                                                
                                                {/* Items Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
                                                    {selectedItems.map((item, index) => (
                                                        <div key={index} className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors">
                                                            {/* Item Header */}
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-white font-medium text-sm truncate">{item.label.split(' - ')[0]}</h4>
                                                                    <p className="text-gray-300 text-xs">NRs. {item.price} each</p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                                                                    title="Remove item"
                                                                    disabled={isLoading}
                                                                >
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            {/* Order Type Display */}
                                                            <div className="mb-3">
                                                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                    item.order_type === "Kitchen" 
                                                                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                                                                    : item.order_type === "Bar"
                                                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                                                    : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                                                                }`}>
                                                                    {item.order_type || "Not specified"}
                                                                </div>
                                                                </div>

                                                            {/* Quantity Controls */}
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center space-x-3">
                                                                    <span className="text-gray-300 text-xs font-medium">Qty:</span>
                                                                    <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600">
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => updateItemQuantity(index, (item.quantity || 1) - 1)}
                                                                            className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-l text-sm transition-colors ${
                                                                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                                            }`}
                                                                            disabled={isLoading}
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <div className="bg-gray-800 text-white text-center py-1 px-3 min-w-8 border-x border-gray-600 text-sm font-medium">
                                                                            {item.quantity || 1}
                                                                        </div>
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => updateItemQuantity(index, (item.quantity || 1) + 1)}
                                                                            className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-r text-sm transition-colors ${
                                                                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                                            }`}
                                                                            disabled={isLoading}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="text-right">
                                                                    <div className="text-white text-sm font-semibold">
                                                                        NRs. {item.price * (item.quantity || 1)}
                                                                    </div>
                                                                    <div className={`text-xs ${
                                                                        item.order_type === "Kitchen" ? "text-green-400" : 
                                                                        item.order_type === "Bar" ? "text-blue-400" : 
                                                                        "text-gray-400"
                                                                    }`}>
                                                                        {item.order_type || "No type"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Empty State */
                                            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                                                {menuLoading ? (
                                                    <>
                                                        <svg className="animate-spin w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <p className="text-lg mb-2">Loading Menu...</p>
                                                        <p className="text-sm text-center">Please wait while we load the menu items</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <p className="text-lg mb-2">No items selected</p>
                                                        <p className="text-sm text-center">Select items from the dropdown to start creating your order</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Submit Button */}
                                {selectedItems.length > 0 && (
                                    <div className="pt-4 border-t border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <div className="text-white">
                                                <div className="text-sm text-gray-300">Total for {selectedItems.length} items</div>
                                                <div className="text-2xl font-bold">NRs. {totalPrice}</div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform min-w-40 flex items-center justify-center ${
                                                    isLoading 
                                                    ? 'opacity-70 cursor-not-allowed' 
                                                    : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                                                }`}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Place Order'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                
                <style jsx>{`
                    .navbar {
                        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
                    }
                    
                    /* Custom scrollbar for selected items */
                    .overflow-y-auto::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .overflow-y-auto::-webkit-scrollbar-track {
                        background: #2d3748;
                        border-radius: 3px;
                    }
                    
                    .overflow-y-auto::-webkit-scrollbar-thumb {
                        background: #4a5568;
                        border-radius: 3px;
                    }
                    
                    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                        background: #718096;
                    }
                `}</style>
            </>
        );
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Error Adding Order</h2>
                    <p>Please try again later or contact support if the problem persists.</p>
                    <Link 
                        href={`/listOrder/${id}`}
                        className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }
}