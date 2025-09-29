"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function SalesReportFilter() {
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [bills, setBills] = useState([]);
    const [totalFinalPrice, setTotalFinalPrice] = useState(0);
    const [totalKitchenPrice, setTotalKitchenPrice] = useState(0);
    const [totalBarPrice, setTotalBarPrice] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [billToDelete, setBillToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    useEffect(() => {
        if (selectedFilter === "custom" && !startDate && !endDate) {
            setIsModalOpen(true);
        }
    }, [selectedFilter, startDate, endDate]);

    const handleFilterChange = (event) => {
        const filter = event.target.value;
        setSelectedFilter(filter);
        if (filter === "custom") {
            setIsModalOpen(true);
        } else {
            setStartDate("");
            setEndDate("");
        }
    };

    const applyCustomDateFilter = () => {
        if (startDate && endDate) {
            setIsModalOpen(false);
            setSelectedFilter("custom");
        }
    };

    const fetchReport = async () => {
        try {
            let query = `/api/bill?${selectedFilter}=true`;

            if (selectedFilter === "custom" && startDate && endDate) {
                query = `/api/bill?custom=true&startDate=${startDate}&endDate=${endDate}`;
            }
            const res = await fetch(query, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch report");
            const data = await res.json();
            setBills(data.bills || []);
            setTotalFinalPrice(data.totalFinalPrice || 0);
            setTotalKitchenPrice(data.totalKitchenPrice || 0);
            setTotalBarPrice(data.totalBarPrice || 0);
        } catch (error) {
            console.error("Error loading report:", error);
            setBills([]);
            setTotalFinalPrice(0);
            setTotalKitchenPrice(0);
            setTotalBarPrice(0);
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
        fetchReport();
        fetchCurrentUser();
    }, [selectedFilter, startDate, endDate]);

    const handleDeleteClick = (bill) => {
        setBillToDelete(bill);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!billToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/bill/${billToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete bill');
            }

            // Remove the deleted bill from the state
            setBills(bills.filter(bill => bill._id !== billToDelete._id));
            
            // Recalculate totals
            const updatedBills = bills.filter(bill => bill._id !== billToDelete._id);
            const newTotalFinalPrice = updatedBills.reduce((sum, bill) => sum + (bill.finalPrice || 0), 0);
            const newTotalKitchenPrice = updatedBills.reduce((sum, bill) => sum + (bill.kitchenPrice || 0), 0);
            const newTotalBarPrice = updatedBills.reduce((sum, bill) => sum + (bill.barPrice || 0), 0);
            
            setTotalFinalPrice(newTotalFinalPrice);
            setTotalKitchenPrice(newTotalKitchenPrice);
            setTotalBarPrice(newTotalBarPrice);

            setIsDeleteModalOpen(false);
            setBillToDelete(null);
            
        } catch (error) {
            console.error('Error deleting bill:', error);
            alert('Failed to delete bill. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setBillToDelete(null);
    };

    // Check if user is admin
    const isAdmin = currentUserRole === 'admin';

    return (
        <div className="flex min-h-screen bg-white text-black overflow-x-hidden">
            {/* Side Navigation with collapse state */}
            <SideNav activeTab="sales" isCollapsed={isSidebarCollapsed} />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation with toggle button */}
                <TopNav 
                    isSidebarCollapsed={isSidebarCollapsed} 
                    toggleSidebar={toggleSidebar} 
                />
                
                {/* Content with dynamic margin */}
                <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
                    <div className="filter-options mb-6">
                        <label htmlFor="filter" className="mr-2 mt-2">Select Filter:</label>
                        <select 
                            id="filter" 
                            value={selectedFilter} 
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
                            onChange={handleFilterChange}
                        >
                            <option value="today">Today</option>
                            <option value="custom">Select Custom Date</option>
                            <option value="lastWeek">Last Week</option>
                            <option value="lastMonth">Last Month</option>
                        </select>
                    </div>

                    {/* Modal for custom date selection */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Start Date:</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">End Date:</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={applyCustomDateFilter}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Apply
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
                                    Are you sure you want to delete this bill? This action cannot be undone.
                                </p>
                                {billToDelete && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded">
                                        <p><strong>Date:</strong> {new Date(billToDelete.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Amount:</strong> NRs. {billToDelete.finalPrice}</p>
                                        <p><strong>Payment Mode:</strong> {billToDelete.billPaymentMode}</p>
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

                    {/* Sales Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold">Total Sales</h3>
                            <p className="text-xl font-bold">NRs. {totalFinalPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold">Kitchen Sales</h3>
                            <p className="text-xl font-bold">NRs. {totalKitchenPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold">Bar Sales</h3>
                            <p className="text-xl font-bold">NRs. {totalBarPrice.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Sales Table with Delete Actions */}
                    <div className="border rounded-lg overflow-hidden shadow-sm max-w-6xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Sn</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Original</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount %</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Final</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">QR</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Cash</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Remarks</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Kitchen</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Bar</th>
                                        {isAdmin && (
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bills.length > 0 ? (
                                        bills.map((sales, index) => (
                                            <tr key={sales._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{index + 1}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    {new Date(sales.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.originalPrice}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.discountPercent}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.finalPrice}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.billPaymentMode}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.qrAmount}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.cashAmount}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.remarks}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.kitchenPrice}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{sales.barPrice}</td>
                                                {isAdmin && (
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => handleDeleteClick(sales)}
                                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                            title="Delete Bill"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? "12" : "11"} className="px-6 py-4 text-center text-sm">
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