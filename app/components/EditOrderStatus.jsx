"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditOrderStatus({ id, order_title, order_description }) {
    const [newOrderTitle, setNewOrderTitle] = useState(order_title);
    const [newOrderDescription, setNewOrderDescription] = useState(order_description);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ newOrderTitle, newOrderDescription }),
            });
      
            if (!res.ok) {
              throw new Error("Failed to update orderr status");
            }
      
            // router.push(`/`);
            router.refresh();
          } catch (error) {
            console.log(error);
          }
        };

        const handleBack = () => {
            router.back(); // Go back one step in browser history
        };

    return (
        <>
            <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
    <Link className="text-white font-bold" href={"/"}>
    MiZone
    </Link>
    <Link href="#" onClick={handleBack} className="bg-white px-6 py-2 mt-3">
        Back
     </Link>
      </nav>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* <input
       onChange={(e) => setNewOrderTitle(e.target.value)}
       value={newOrderTitle}
       className="border border-slate-500 px-8 py-2" type="text" placeholder="Order Name" /> */}
      <input
       onChange={(e) => setNewOrderDescription(e.target.value)}
       value={newOrderDescription}
      className="border border-slate-500 px-8 py-2" type="text" placeholder="Order description" />
  <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
  Update Order
  </button>
  </form>
  </>
    )
}