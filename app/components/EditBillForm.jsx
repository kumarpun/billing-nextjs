"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditBillForm({id, billStatus, finalPrice, onBillAdded}) {
    const [newBillStatus, setNewBillStatus] = useState(billStatus);
    const [newFinalPrice, setNewFinalPrice] = useState(finalPrice);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:3000/api/bill/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ billStatus: newBillStatus, finalPrice: newFinalPrice})
            });
      
            if (!res.ok) {
              throw new Error("Failed to update bill status");
            }
            toast.success("Bill status updated!");

            router.refresh();
            onBillAdded(finalPrice);
          } catch (error) {
            console.log(error);
          }
        };

    return(
     <>
     <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
            onChange={(e) => setNewFinalPrice(e.target.value)}
            value={newFinalPrice}
            className="border border-slate-500 px-8 py-2" type="number" placeholder="Final price" />

     <input
         onChange={(e) => setNewBillStatus(e.target.value)}
         value={newBillStatus}
         className="border border-slate-500 px-8 py-2" type="text" placeholder="Bill status" />

        <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
    Update Bill
    </button>
     </form>
     </>
    )
}