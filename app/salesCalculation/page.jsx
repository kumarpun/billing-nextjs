"use client";
import { useState } from "react";
import PageNav from "../components/PageNav";

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
            <PageNav
                titleHref="/dashboard"
                centerTitle
                buttons={[{ label: "Tables", href: "/tables" }]}
            />

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
