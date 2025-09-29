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

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setIsOpen(false);
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
    }, [selectedFilter]);

    const fetchSalesReport = async () => {
        try {
            const res = await fetch(`/api/orders?${selectedFilter}=true`, { cache: "no-store" });
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
                <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
                    {/* Filter Dropdown */}
                    <div className="filter-options mb-6 relative">
                        <label className="mr-2 mt-2">Select Filter:</label>
                        <div className="inline-block">
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                            >
                                {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                                <span className="ml-2">▼</span>
                            </button>
                            {isOpen && (
                                <ul className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                                    {["today", "lastWeek", "lastMonth"].map((filter) => (
                                        <li 
                                            key={filter}
                                            onClick={() => handleFilterChange(filter)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

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