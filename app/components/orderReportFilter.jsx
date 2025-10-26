"use client";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function SalesReportClient() {
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [ordersWithTables, setOrdersWithTables] = useState([]);
    const [totalFinalPrice, setTotalFinalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    
    // Custom date states
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleFilterChange = (filter) => {
        if (filter === "custom") {
            setShowCustomDatePicker(true);
            setIsOpen(false);
        } else {
            setSelectedFilter(filter);
            setShowCustomDatePicker(false);
            setIsOpen(false);
        }
    };

    const handleCustomDateApply = () => {
        if (customStartDate && customEndDate) {
            setSelectedFilter("custom");
            setShowCustomDatePicker(false);
        } else {
            alert("Please select both start and end dates");
        }
    };

    const handleCustomDateCancel = () => {
        setShowCustomDatePicker(false);
        setCustomStartDate("");
        setCustomEndDate("");
        // Reset to today if no other filter is selected
        if (selectedFilter === "custom") {
            setSelectedFilter("today");
        }
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
        fetchSalesReport();
        fetchCurrentUser();
    }, [selectedFilter, customStartDate, customEndDate]);

    const fetchSalesReport = async () => {
        try {
            let url = `/api/orders?${selectedFilter}=true`;
            
            if (selectedFilter === "custom" && customStartDate && customEndDate) {
                url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
            }
            
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch report");
            const data = await res.json();
            setOrdersWithTables(data.ordersWithTables || []);
            setTotalFinalPrice(data.ordersWithTables.reduce((total, group) => total + group.total_bill, 0));
        } catch (error) {
            console.error("Error loading report:", error);
            setOrdersWithTables([]);
            setTotalFinalPrice(0);
        }
    };

    const getFilterDisplayText = () => {
        if (selectedFilter === "custom" && customStartDate && customEndDate) {
            return `Custom (${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()})`;
        }
        return selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1);
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!orderToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/orders/${orderToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            // Remove the deleted order from the state
            const updatedOrders = ordersWithTables.map(group => ({
                ...group,
                orders: group.orders.filter(order => order._id !== orderToDelete._id)
            })).filter(group => group.orders.length > 0);

            setOrdersWithTables(updatedOrders);
            
            // Recalculate total price
            const newTotalPrice = updatedOrders.reduce((total, group) => total + group.total_bill, 0);
            setTotalFinalPrice(newTotalPrice);

            setIsDeleteModalOpen(false);
            setOrderToDelete(null);
            
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    const handleExportClick = () => {
        if (ordersWithTables.length === 0) {
            alert("No data available to export.");
            return;
        }
        setIsExportModalOpen(true);
    };

    const handleExportConfirm = () => {
        setIsExporting(true);
        try {
            exportToCSV();
            setIsExportModalOpen(false);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportCancel = () => {
        setIsExportModalOpen(false);
    };

    const exportToCSV = () => {
        // Flatten all orders from all groups
        const allOrders = ordersWithTables.flatMap(group => group.orders);
        
        if (allOrders.length === 0) {
            alert("No data available to export.");
            return;
        }

        // Define CSV headers
        const headers = [
            'SN',
            'Date',
            'Order Title',
            'Status',
            'Quantity',
            'Price',
            'Table',
            'Total Price',
            'Remarks',
            'Order Type',
        ];

        // Prepare data rows
        const csvData = allOrders.map((order, index) => [
            index + 1,
            new Date(order.createdAt).toLocaleDateString(),
            `"${order.order_title}"`, // Wrap in quotes to handle commas
            order.order_status,
            order.order_quantity,
            order.order_price,
            order.table[0]?.title || "N/A",
            order.total_price,
            `"${order.order_description}"`, // Wrap in quotes to handle commas
            order.order_type,
        ]);

        // Add total row
        csvData.push([]); // Empty row
        csvData.push(['', '', '', '', '', '', '', 'Total Sales:', totalFinalPrice, '', '']);

        // Convert to CSV string
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const fileName = `sales-report-${selectedFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Check if user is admin
    const isAdmin = currentUserRole === 'admin';

    return (
        <div className="flex min-h-screen bg-white text-black overflow-x-hidden">
            {/* Side Navigation with collapse state */}
            <SideNav activeTab="orders" isCollapsed={isSidebarCollapsed} />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation with toggle button */}
                <TopNav 
                    isSidebarCollapsed={isSidebarCollapsed} 
                    toggleSidebar={toggleSidebar} 
                />
                
                {/* Content with dynamic margin */}
                <div className={`flex-1 p-6 transition-all duration-300 relative z-50 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
                    {/* Filter and Export Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="filter-options relative">
                            <label className="mr-2 mt-2">Select Filter:</label>
                            <div className="inline-block">
                                <button 
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-40 text-left flex justify-between items-center"
                                >
                                    <span>{getFilterDisplayText()}</span>
                                    <span className="ml-2">▼</span>
                                </button>
                                {isOpen && (
                                    <ul className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {["today", "lastWeek", "lastMonth", "custom"].map((filter) => (
                                            <li 
                                                key={filter}
                                                onClick={() => handleFilterChange(filter)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                                            >
                                                {filter}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Custom Date Picker */}
                            {showCustomDatePicker && (
                                <div className="absolute z-20 mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg">
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={handleCustomDateCancel}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCustomDateApply}
                                            disabled={!customStartDate || !customEndDate}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={handleExportClick}
                            disabled={ordersWithTables.length === 0}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export CSV
                        </button>
                    </div>

                    {/* Export Confirmation Modal */}
                    {isExportModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 text-green-600">Confirm Export</h3>
                                <p className="mb-4">
                                    Are you sure you want to export the sales data to CSV? 
                                    This will download a file containing {ordersWithTables.flatMap(group => group.orders).length} records.
                                </p>
                                <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <p><strong>Filter:</strong> {getFilterDisplayText()}</p>
                                    <p><strong>Total Records:</strong> {ordersWithTables.flatMap(group => group.orders).length}</p>
                                    <p><strong>Total Sales:</strong> NRs. {totalFinalPrice.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button 
                                        onClick={handleExportCancel}
                                        disabled={isExporting}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleExportConfirm}
                                        disabled={isExporting}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                                    >
                                        {isExporting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Exporting...
                                            </>
                                        ) : (
                                            "Export"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal - Only show for admin */}
                    {isDeleteModalOpen && isAdmin && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h3>
                                <p className="mb-4">
                                    Are you sure you want to delete this order? This action cannot be undone.
                                </p>
                                {orderToDelete && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded">
                                        <p><strong>Order:</strong> {orderToDelete.order_title}</p>
                                        <p><strong>Table:</strong> {orderToDelete.table[0]?.title || "N/A"}</p>
                                        <p><strong>Quantity:</strong> {orderToDelete.order_quantity}</p>
                                        <p><strong>Price:</strong> NRs. {orderToDelete.order_price}</p>
                                        <p><strong>Date:</strong> {new Date(orderToDelete.createdAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                                <div className="flex justify-end space-x-3">
                                    <button 
                                        onClick={handleDeleteCancel}
                                        disabled={isDeleting}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Total Sales Display */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-xl font-bold text-center text-black">
                            Total Sales: NRs. {totalFinalPrice.toLocaleString()}
                        </h3>
                        {selectedFilter === "custom" && customStartDate && customEndDate && (
                            <p className="text-center text-sm text-gray-600 mt-1">
                                Period: {new Date(customStartDate).toLocaleDateString()} - {new Date(customEndDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Sales Table */}
                    <div className="border rounded-lg overflow-hidden shadow-sm max-w-6xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Sn</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Title</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Table</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Remarks</th>
                                        {isAdmin && (
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ordersWithTables.length > 0 ? (
                                        ordersWithTables.flatMap((salesGroup, groupIndex) =>
                                            salesGroup.orders.map((sales, orderIndex) => (
                                                <tr key={`${groupIndex}-${orderIndex}`} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {groupIndex * salesGroup.orders.length + orderIndex + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {new Date(sales.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.order_title}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.order_status}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.order_quantity}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.order_price}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.table[0]?.title || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.total_price}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {sales.order_description}
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => handleDeleteClick(sales)}
                                                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                                title="Delete Order"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? "10" : "9"} className="px-6 py-4 text-center text-sm">
                                                No sales records available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}