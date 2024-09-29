"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function AddBillForm({ initialOriginalPrice, initialBillId, onBillAdded }) {
    const [originalPrice, setOriginalPrice] = useState(initialOriginalPrice || "");
    const [finalPrice, setFinalPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [remarks, setRemarks] = useState("");
    const [tablebill_id, setTableBillId] = useState(initialBillId || "");
    const [billStatus, setBillStatus] = useState("pending");

    const router = useRouter();

    useEffect(() => {
        setOriginalPrice(initialOriginalPrice);
        setTableBillId(initialBillId);
    }, [initialOriginalPrice, initialBillId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
          try {
            const res = await fetch("https://billing-nextjs.vercel.app/api/bill", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ originalPrice, finalPrice, discountPercent, remarks, tablebill_id, billStatus}),
            });
      
            if (res.ok) {
              // router.push("/");
              toast.success("Bill added!");
              router.refresh();
              // Clear all fields except originalPrice
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
                   onChange={(e) => setTableBillId(e.target.value)} 
                   value={tablebill_id}
                   className="border border-slate-500 px-8 py-2" type="text" placeholder="Table id" readOnly />

                   <input
                   onChange={(e) => setOriginalPrice(e.target.value)} 
                   value={originalPrice}
                   className="border border-slate-500 px-8 py-2" type="number" placeholder="Original bill" readOnly />

                  <input
                   onChange={(e) => setDiscountPercent(e.target.value)}
                    value={discountPercent}
                    className="border border-slate-500 px-8 py-2" type="number" placeholder="Discount %" />

                   <input
                    onChange={(e) => setFinalPrice(e.target.value)} 
                    value={finalPrice}
                   className="border border-slate-500 px-8 py-2" type="number" placeholder="Final discounted bill" required />

                    <input
                    onChange={(e) => setRemarks(e.target.value)}
                    value={remarks}
                    className="border border-slate-500 px-8 py-2" type="text" placeholder="Remarks" />

                    <input
                    onChange={(e) => setBillStatus(e.target.value)}
                    value={billStatus}
                    className="border border-slate-500 px-8 py-2" type="text" placeholder="Bill Status" readOnly />

               <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
               Add Bill
               </button>
               </form>
                  </div>
    );
}