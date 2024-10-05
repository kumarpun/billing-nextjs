// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";

// export default function AddBillForm({ initialOriginalPrice, initialBillId, onBillAdded }) {
//     const [originalPrice, setOriginalPrice] = useState(initialOriginalPrice || "");
//     const [finalPrice, setFinalPrice] = useState("");
//     const [discountPercent, setDiscountPercent] = useState("");
//     const [remarks, setRemarks] = useState("");
//     const [tablebill_id, setTableBillId] = useState(initialBillId || "");
//     const [billStatus, setBillStatus] = useState("pending");

//     const router = useRouter();

//     useEffect(() => {
//         setOriginalPrice(initialOriginalPrice);
//         setTableBillId(initialBillId);
//     }, [initialOriginalPrice, initialBillId]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//           try {
//             const res = await fetch("http://localhost:3000/api/bill", {
//               method: "POST",
//               headers: {
//                 "Content-type": "application/json",
//               },
//               body: JSON.stringify({ originalPrice, finalPrice, discountPercent, remarks, tablebill_id, billStatus}),
//             });
      
//             if (res.ok) {
//               // router.push("/");
//               toast.success("Bill added!");
//               router.refresh();
//               // Clear all fields except originalPrice
//               setFinalPrice("");
//               setDiscountPercent("");
//               setRemarks("");
//               onBillAdded(finalPrice);
//             } else {
//               throw new Error("Failed to create a bill");
//             }
//           } catch (error) {
//             console.log(error);
//           }
//         };

//     return (
//         <div>       
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//                 <input
//                    onChange={(e) => setTableBillId(e.target.value)} 
//                    value={tablebill_id}
//                    className="border border-slate-500 px-8 py-2" type="text" placeholder="Table id" readOnly />

//                    <input
//                    onChange={(e) => setOriginalPrice(e.target.value)} 
//                    value={originalPrice}
//                    className="border border-slate-500 px-8 py-2" type="number" placeholder="Original bill" readOnly />

//                   <input
//                    onChange={(e) => setDiscountPercent(e.target.value)}
//                     value={discountPercent}
//                     className="border border-slate-500 px-8 py-2" type="number" placeholder="Discount %" />

//                    <input
//                     onChange={(e) => setFinalPrice(e.target.value)} 
//                     value={finalPrice}
//                    className="border border-slate-500 px-8 py-2" type="number" placeholder="Final discounted bill" />

//                     <input
//                     onChange={(e) => setRemarks(e.target.value)}
//                     value={remarks}
//                     className="border border-slate-500 px-8 py-2" type="text" placeholder="Remarks" />

//                     <input
//                     onChange={(e) => setBillStatus(e.target.value)}
//                     value={billStatus}
//                     className="border border-slate-500 px-8 py-2" type="text" placeholder="Bill Status" readOnly />

//                <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
//                Add Bill
//                </button>
//                </form>
//                   </div>
//     );
// }

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
            const res = await fetch("http://localhost:3000/api/bill", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ originalPrice, finalPrice, kitchenPrice, barPrice, discountPercent, remarks, tablebill_id, billStatus }),
            });

            if (res.ok) {
                toast.success("Bill added!");
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
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    id="tablebill_id"
                    onChange={(e) => setTableBillId(e.target.value)} 
                    value={tablebill_id}
                    className="border border-slate-500 px-8 py-2" 
                    type="text" 
                    placeholder="Table ID" 
                    hidden
                />

                <label htmlFor="originalPrice">Original Bill</label>
                <input
                    id="originalPrice"
                    onChange={(e) => setOriginalPrice(e.target.value)} 
                    value={originalPrice}
                    className="border border-slate-500 px-8 py-2" 
                    type="number" 
                    placeholder="Original bill" 
                    readOnly 
                />

                <label htmlFor="kitchenPrice">Kitchen Price</label>
                <input
                    id="kitchenPrice"
                    onChange={(e) => setKitchenPrice(e.target.value)} 
                    value={kitchenPrice}
                    className="border border-slate-500 px-8 py-2" 
                    type="number" 
                    placeholder="Kitchen Price" 
                    readOnly 
                />

                <label htmlFor="barPrice">Bar Price</label>
                <input
                    id="barPrice"
                    onChange={(e) => setBarPrice(e.target.value)} 
                    value={barPrice}
                    className="border border-slate-500 px-8 py-2" 
                    type="number" 
                    placeholder="Bar Price" 
                    readOnly 
                />

                <label htmlFor="discountPercent">Discount % (Applies to Kitchen Price only)</label>
                <input
                    id="discountPercent"
                    onChange={(e) => setDiscountPercent(e.target.value)} 
                    value={discountPercent}
                    className="border border-slate-500 px-8 py-2" 
                    type="number" 
                    placeholder="Discount %" 
                />

                <label htmlFor="finalPrice">Final Discount (KOT Discounted Price + BOT Price)</label>
                <input
                    id="finalPrice"
                    value={finalPrice}
                    className="border border-slate-500 px-8 py-2" 
                    type="number" 
                    placeholder="Final price" 
                    required 
                />

                <label htmlFor="remarks">Remarks</label>
                <input
                    id="remarks"
                    onChange={(e) => setRemarks(e.target.value)} 
                    value={remarks}
                    className="border border-slate-500 px-8 py-2" 
                    type="text" 
                    placeholder="Remarks" 
                />

                <input
                    id="billStatus"
                    onChange={(e) => setBillStatus(e.target.value)} 
                    value={billStatus}
                    className="border border-slate-500 px-8 py-2" 
                    type="text" 
                    placeholder="Bill Status" 
                    hidden
                />

                <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
                    Add Bill
                </button>
            </form>
        </div>
    );
}
