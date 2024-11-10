'use client';

import { useEffect, useState } from "react";

export default function OrderQuantityDetails() {
    const [orderQuantities, setOrderQuantities] = useState({});
    const [filter, setFilter] = useState("today"); // Default to "today"
    const [isOpen, setIsOpen] = useState(false); // Track dropdown open/close state

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`/api/orderdetails?${filter}=true`);
                const data = await response.json();
                setOrderQuantities(data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchOrderData();
    }, [filter]); // Refetch when filter changes

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div>
            <h2>Order Quantities</h2>

            {/* Filter Selection Dropdown */}
            <div className="filter-options">
                <label htmlFor="filter">Select Filter: </label>
                <div className="dropdown">
                    <button onClick={() => setIsOpen((prev) => !prev)}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)} {/* Capitalize filter display */}
                    </button>
                    {isOpen && (
                        <ul className="dropdown-options">
                            {["today", "lastWeek", "lastMonth"].map((option) => (
                                <li key={option} onClick={() => handleFilterChange(option)}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize option display */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="sales-body">
                <main className="table" id="customers_table">
                    <section className="table-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order Title</th>
                                    <th>Total Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(orderQuantities).map(([title, quantity]) => (
                                    <tr key={title}>
                                        <td>{title}</td>
                                        <td>{quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>  
                </main>
            </div>
        </div>
    );
}
