"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddOrder() {
    const [order_title, setTitle] = useState("");
    const [order_description, setDescription] = useState("");
    const [table_id, setTableId] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!order_title || !order_description) {
            alert("Title and description are required.");
            return;
          }
      
          try {
            const res = await fetch("http://localhost:3000/api/orders", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ 
                table_id: id, 
                order_title, 
                order_description,
               }),
            });
      
            if (res.ok) {
              router.push("/");
              router.refresh();
            } else {
              throw new Error("Failed to create a topic");
            }
          } catch (error) {
            console.log(error);
          }
        };
      

    return (
        <div>
 <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar">
      <Link className="text-white font-bold" href={"/"}>
    HYBE Food & Drinks
      </Link></nav>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
            onChange={(e) => setTableId(e.target.value)} 
            value={id}
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Order id" />
            <input
            onChange={(e) => setTitle(e.target.value)} 
            value={order_title}
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Order Name" />
            <input
             onChange={(e) => setDescription(e.target.value)} 
             value={order_description}
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Order description" />
            
        <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Add Order
        </button>
        </form>
        </div>
    )
}