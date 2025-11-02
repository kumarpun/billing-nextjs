"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AddBillForm({ initialOriginalPrice, initialBillId, initialKitchenPrice, initialBarPrice, onBillAdded }) {
    const [originalPrice, setOriginalPrice] = useState(initialOriginalPrice || "");
    const [finalPrice, setFinalPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [remarks, setRemarks] = useState("");
    const [tablebill_id, setTableBillId] = useState(initialBillId || "");
    const [billStatus, setBillStatus] = useState("pending");
    const [kitchenPrice, setKitchenPrice] = useState(initialKitchenPrice || "");
    const [barPrice, setBarPrice] = useState(initialBarPrice || "");

    const router = useRouter();

    useEffect(() => {
        setOriginalPrice(initialOriginalPrice);
        setTableBillId(initialBillId);
        setKitchenPrice(initialKitchenPrice);
        setBarPrice(initialBarPrice);
    }, [initialOriginalPrice, initialBillId, initialKitchenPrice, initialBarPrice]);

    // Calculate the final price for kitchen orders only when discount or kitchenPrice changes
    useEffect(() => {
        let discountedKitchenPrice = kitchenPrice;

        if (kitchenPrice && discountPercent) {
            const discountAmount = (discountPercent / 100) * kitchenPrice;
            discountedKitchenPrice = kitchenPrice - discountAmount;
        }

        const totalFinalPrice = Math.round(discountedKitchenPrice) + Math.round(barPrice);
        setFinalPrice(totalFinalPrice); // Update final price to include bar price
    }, [discountPercent, kitchenPrice, barPrice]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/bill", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ originalPrice, finalPrice, kitchenPrice, barPrice, discountPercent, remarks, tablebill_id, billStatus }),
            });

            if (res.ok) {
                toast.success("Bill added successfully!");
                router.refresh();
                // Clear all fields except kitchenPrice
                setFinalPrice("");
                setDiscountPercent("");
                setRemarks("");
                onBillAdded(finalPrice);
            } else {
                throw new Error("Failed to create a bill");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error adding bill");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-xl shadow-md">
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    id="tablebill_id"
                    onChange={(e) => setTableBillId(e.target.value)} 
                    value={tablebill_id}
                    className="border border-slate-500 px-8 py-2" 
                    type="text" 
                    placeholder="Table ID" 
                    hidden
                />

                <div>
                    <div>
                        <label htmlFor="originalPrice" className="block text-xs font-medium text-gray-700 mb-1">Original Bill</label>
                        <input
                            id="originalPrice"
                            onChange={(e) => setOriginalPrice(e.target.value)} 
                            value={originalPrice}
                            className="w-full p-2 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-300 bg-yellow-50" 
                            type="number" 
                            placeholder="0.00" 
                            readOnly 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="kitchenPrice" className="block text-xs font-medium text-gray-700 mb-1">Kitchen</label>
                        <input
                            id="kitchenPrice"
                            onChange={(e) => setKitchenPrice(e.target.value)} 
                            value={kitchenPrice}
                            className="w-full p-2 text-base text-gray-700 bg-blue-50 rounded-lg border border-gray-300" 
                            type="number" 
                            placeholder="0.00" 
                            readOnly 
                        />
                    </div>

                    <div>
                        <label htmlFor="barPrice" className="block text-xs font-medium text-gray-700 mb-1">Bar</label>
                        <input
                            id="barPrice"
                            onChange={(e) => setBarPrice(e.target.value)} 
                            value={barPrice}
                            className="w-full p-2 text-base text-gray-700 bg-blue-50 rounded-lg border border-gray-300" 
                            type="number" 
                            placeholder="0.00" 
                            readOnly 
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="discountPercent" className="block text-xs font-medium text-gray-700">
                            Discount %
                        </label>
                        {discountPercent && (
                            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                Save: ₹{Math.round((discountPercent / 100) * kitchenPrice)}
                            </span>
                        )}
                    </div>
                    <input
                        id="discountPercent"
                        onChange={(e) => setDiscountPercent(e.target.value)} 
                        value={discountPercent}
                        className="w-full p-2 text-base text-blue-700 bg-blue-50 rounded-lg border border-gray-300" 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        max="100"
                    />
                </div>

                <div>
                        <label htmlFor="finalPrice" className="block text-xs font-medium text-gray-700 mb-1">Final Amount</label>
                        <input
                            id="finalPrice"
                            onChange={(e) => setFinalPrice(e.target.value)}
                            value={finalPrice}
                            className="w-full p-2 text-base font-medium text-green-700 bg-green-50 rounded-lg border border-gray-300" 
                            type="number" 
                            placeholder="0.00" 
                        />
                    </div>

                <div>
                    <label htmlFor="remarks" className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                    <input
                        id="remarks"
                        onChange={(e) => setRemarks(e.target.value)} 
                        value={remarks}
                        className="w-full p-2 text-base text-gray-700 bg-blue-50 rounded-lg border border-gray-300" 
                        type="text" 
                        placeholder="Additional notes..." 
                    />
                </div>

                <input
                    id="billStatus"
                    onChange={(e) => setBillStatus(e.target.value)} 
                    value={billStatus}
                    className="border border-slate-500 px-8 py-2" 
                    type="text" 
                    placeholder="Bill Status" 
                    hidden
                />

                <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Add Bill
                    </button>
                </div>
            </form>
        </div>
    );
}