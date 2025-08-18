'use client';
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function SalesReportClient() {
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [ordersWithTables, setOrdersWithTables] = useState([]);
    const [totalFinalPrice, setTotalFinalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setIsOpen(false);
    };

    useEffect(() => {
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

        fetchSalesReport();
    }, [selectedFilter]);

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
                                                </tr>
                                            ))
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-4 text-center text-sm">
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