'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch } from 'react-icons/fi';

export default function OrderQuantityDetails() {
    const [orderQuantities, setOrderQuantities] = useState({});
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                let url = `/api/orderdetails?${selectedFilter}=true`;
                
                if (selectedFilter === "custom" && startDate && endDate) {
                    url = `/api/orderdetails?custom=true&startDate=${startDate}&endDate=${endDate}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                setOrderQuantities(data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchOrderData();
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

    return (
        <div className="p-6 text-black">
            {/* Filter Selection */}
            <div className="filter-options mb-6 flex items-center text-black">
                <label htmlFor="filter" className="mr-2 text-black">Select Filter: </label>
                <select 
                    id="filter"
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-black"
                >
                    <option value="today" className="text-black">Today</option>
                    <option value="lastWeek" className="text-black">Last Week</option>
                    <option value="lastMonth" className="text-black">Last Month</option>
                    <option value="custom" className="text-black">Custom Date Range</option>
                </select>
            </div>

            {/* Search Order Button */}
            <div className="flex mb-6">
                <Link className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" href={"/salesCalculation"}>
                    <FiSearch className="mr-2" />
                    Search Order
                </Link>
            </div>

            {/* Modal for custom date selection */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
                        <h3 className="text-lg font-semibold mb-4 text-black">Select Date Range</h3>
                        <div className="space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Start Date:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">End Date:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-black"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={applyCustomDateFilter}
                                disabled={!startDate || !endDate}
                                className={`px-4 py-2 rounded-md ${(!startDate || !endDate) ? 'bg-gray-300 cursor-not-allowed text-black' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Quantities Table */}
            <div className="border rounded-lg overflow-hidden shadow-sm text-black">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 text-black">
                        <thead className="bg-gray-50 text-black">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">Order Title</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">Total Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-black">
                            {Object.entries(orderQuantities).map(([title, quantity]) => (
                                <tr key={title} className="hover:bg-gray-50 text-black">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{title}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{quantity}</td>
                                </tr>
                            ))}
                            {Object.keys(orderQuantities).length === 0 && (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-black">
                                        No order data available for the selected filter
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}