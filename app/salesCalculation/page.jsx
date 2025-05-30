"use client";
import { useState } from "react";
import Link from "next/link";

export default function SalesCalculation() {
    const [orderTitle, setOrderTitle] = useState("");
    const [filter, setFilter] = useState(""); // New state for the filter option
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle form submission and fetch count from API
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setCount(null); // Reset the count when searching

        try {
            const response = await fetch("/api/orderitem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_title: orderTitle, filter }) // Include filter in the request body
            });
            const data = await response.json();
            setCount(data.count);
        } catch (error) {
            console.error("Error fetching count:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/listReport"}>
      HYBE Food & Drinks
      </Link>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <a
                        className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button"
                        href="https://docs.google.com/spreadsheets/d/1LnrugVBIRQ9ZPBkJqHcLTVdJuBnq1O-ovg9xcZJ9M3I/edit?gid=0#gid=0"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Inventory
                    </a>
                    <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href="/">
                        Back
                    </Link>
                </div>
            </nav>

            <div className="search-container p-8">
                <h2 className="text-lg font-bold mb-4">Search Order Count by Title</h2>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter order name"
                        value={orderTitle}
                        onChange={(e) => setOrderTitle(e.target.value)}
                        className="border p-2 rounded rounded w-full max-w-xs"
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border p-2 rounded rounded w-full max-w-xs"
                    >
                        <option value="">Select Date</option>
                        <option value="today">Today</option>
                        <option value="last_week">Last 7 Days</option>
                        <option value="last_month">Last 30 Days</option>
                    </select>

                    <button type="submit" className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button py-3 px-6 w-fit">
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>

                {count !== null && (
                    <div className="mt-4">
                        <p>Count of Orders Found: <strong>{count}</strong></p>
                    </div>
                )}
            </div>
        </>
    );
}
