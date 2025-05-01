"use client";
import { useState } from "react";

export default function Complement() {
    const [orderTitle, setOrderTitle] = useState("");
    const [orderDescription, setOrderDescription] = useState("");
    const [orderQuantity, setOrderQuantity] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_title: orderTitle, order_description: orderDescription, order_quantity: orderQuantity })
            });
            const data = await response.json();
            setResponseMessage(data.message);
        } catch (error) {
            console.error("Error fetching count:", error);
            setResponseMessage("Error submitting order.");
        }
    };

    return (
        <div className="search-container p-8" style={{ position: "relative", zIndex: 10 }}>
            <h2 className="text-lg font-bold mb-4">Create a New Order</h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    placeholder="Enter order Name"
                    value={orderTitle}
                    onChange={(e) => setOrderTitle(e.target.value)}
                    className="border p-2 rounded w-full max-w-xs"
                    required
                    style={{ zIndex: 10 }} // Ensure this is above other elements
                />
                <input
                    type="text"
                    placeholder="Remarks"
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    className="border p-2 rounded w-full max-w-xs"
                    required
                    style={{ zIndex: 10 }}
                />

                    <input
                    type="number"
                    placeholder="Quantity"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="border p-2 rounded w-full max-w-xs"
                    required
                    style={{ zIndex: 10 }}
                />
                <button type="submit" className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button py-3 px-6 w-fit">
                    Submit
                </button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}