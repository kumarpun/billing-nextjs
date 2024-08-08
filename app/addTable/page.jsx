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
            const res = await fetch("http://localhost:3000/api/tables", {
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
 <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
 <div style={{ flex: 0 }}></div>
 <Link className="page-title font-bold" href={"/"}>
      {Array.from("HYBE Food & Drinks").map((char, index) => (
            <span key={index} className={`char-${index}`}>{char}</span>
           ))}
      </Link>
      <Link href="#" onClick={handleBack} className="bg-white px-6 py-2 mt-3 add-table">
                    Back
                </Link>
      </nav>
      <hr className="separator" />
                    <br/>
                    <div className="bg-page">

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Table Name" />
            <input
             onChange={(e) => setDescription(e.target.value)} 
             value={description}
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Table description" />
        <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Add table
        </button>
        </form>
           </div>
        </div>
    )
}