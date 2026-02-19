"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Select from 'react-select';
import { FiArrowLeft } from "react-icons/fi";
import PageNav from "./PageNav";

export default function EditOrderStatus({ id, order_title, order_description, order_status }) {
    const [newOrderTitle, setNewOrderTitle] = useState(order_title);
    const [newOrderDescription, setNewOrderDescription] = useState(order_description);
    const [newOrderStatus, setNewOrderStatus] = useState(order_status);
    const [newOrderQuantity, setNewOrderQuantity] = useState("");

    const options = [
      { value: 'Order accepted', label: 'Order accepted' },
      { value: 'Order cooking', label: 'Order cooking' },
      { value: 'Order delivered', label: 'Order delivered' },
    ];

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
      const orderQuantity = searchParams.get('order_quantity');
      if (orderQuantity) {
          setNewOrderQuantity(orderQuantity);
      }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/orders/${id}`, {
              method: "PUT",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({ newOrderTitle, newOrderDescription, newOrderStatus, newOrderQuantity }),
            });

            if (!res.ok) throw new Error("Failed to update order status");

            toast.success("Order updated!");
            router.back();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update order");
        }
    };

    const handleBack = () => {
        router.back();
    };

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            padding: '2px',
            fontSize: '0.875rem',
            minHeight: '42px',
            color: '#f3f4f6',
        }),
        singleValue: (provided) => ({ ...provided, color: '#f3f4f6' }),
        menu: (provided) => ({ ...provided, backgroundColor: '#1f2937', borderRadius: '0.5rem', border: '1px solid #374151' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#374151' : '#1f2937',
            color: '#f3f4f6',
            fontSize: '0.875rem',
        }),
        placeholder: (provided) => ({ ...provided, color: '#6b7280' }),
    };

    return (
        <div className="min-h-screen bg-[#283141]">
            <PageNav
                titleHref="/dashboard"
                buttons={[{ label: "Back", onClick: handleBack, icon: FiArrowLeft }]}
            />

            {/* Form */}
            <div className="p-3 sm:p-6 max-w-lg mx-auto">
                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
                    {/* Order title header */}
                    <h2 className="text-base sm:text-lg font-semibold text-white mb-1">Edit Order</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mb-5">{order_title}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Quantity</label>
                            <input
                                onChange={(e) => setNewOrderQuantity(e.target.value)}
                                value={newOrderQuantity}
                                className="w-full p-2.5 text-sm text-gray-100 bg-gray-900 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                                type="number"
                                placeholder="Enter quantity"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Order Status</label>
                            <Select
                                options={options}
                                onChange={(opt) => setNewOrderStatus(opt.value)}
                                value={options.find(o => o.value === newOrderStatus) || null}
                                styles={selectStyles}
                                placeholder="Select status"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium text-sm rounded-lg transition-all duration-200 shadow hover:shadow-md"
                        >
                            Update Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
