'use client'; // Mark this component as a client component

import { useEffect, useState } from "react";

export default function SalesReportClient() {
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [ordersWithTables, setOrdersWithTables] = useState([]);
    const [totalFinalPrice, setTotalFinalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false); // Track dropdown open/close state

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setIsOpen(false); // Close dropdown after selection
        console.log("Selected Filter:", filter); // Check the filter value
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
        <>
            <div className="filter-options">
                <label htmlFor="filter">Select Filter: </label>
                <div className="dropdown">
                    <button onClick={() => setIsOpen((prev) => !prev)}>
                        {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} {/* Capitalize filter display */}
                    </button>
                    {isOpen && (
                        <ul className="dropdown-options">
                            {["today", "lastWeek", "lastMonth"].map((filter) => (
                                <li key={filter} onClick={() => handleFilterChange(filter)}>
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)} {/* Capitalize filter option */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="font-bold text-center">Total Sales: NRs. {totalFinalPrice}</div>
            <div className="sales-body">
                <main className="table" id="customers_table">
                    <section className="table-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sn</th>
                                    <th>Date</th>
                                    <th>Order Title</th>
                                    <th>Order Status</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Table</th>
                                    <th>Total Price</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersWithTables.length > 0 ? (
                                    ordersWithTables.map((salesGroup, groupIndex) =>
                                        salesGroup.orders.map((sales, orderIndex) => (
                                            <tr key={`${groupIndex}-${orderIndex}`}>
                                                <td>{groupIndex * ordersWithTables.length + orderIndex + 1}</td>
                                                <td>{new Date(sales.createdAt).toLocaleDateString()}</td>
                                                <td>{sales.order_title}</td>
                                                <td>{sales.order_status}</td>
                                                <td>{sales.order_quantity}</td>
                                                <td>{sales.order_price}</td>
                                                <td>{sales.table[0]?.title || "N/A"}</td>
                                                <td>{sales.total_price}</td>
                                                <td>{sales.order_description}</td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No sales records available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>
    );
}
