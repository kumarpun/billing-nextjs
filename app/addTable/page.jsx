"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTable() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("Title and description are required.");
            return;
          }
      
          try {
            const res = await fetch("https://billing-nextjs.vercel.app/api/tables", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ title, description }),
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

        const handleBack = () => {
          router.back(); // Go back one step in browser history
      };

    return (
        <div>
 <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/tables"}>
      HYBE Food & Drinks
      </Link>
      <Link href="#" onClick={handleBack} className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button">
                    Back
                </Link>
      </nav>
                    <br/>
                    <div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
            className="border border-slate-500 px-8 py-2 text-black" type="text" placeholder="Table Name" />
            <input
             onChange={(e) => setDescription(e.target.value)} 
             value={description}
            className="border border-slate-500 px-8 py-2 text-black" type="text" placeholder="Table description" />
        <button type="submit" className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button py-3 px-6 w-fit">
        Add table
        </button>
        </form>
           </div>
        </div>
    )
}