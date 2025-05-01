"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditTableForm({ id, title, description }) {
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`https://billing-nextjs.vercel.app/api/tables/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ newTitle, newDescription }),
            });
      
            if (!res.ok) {
              throw new Error("Failed to update tables");
            }
      
            router.push("/");
            router.refresh();
          } catch (error) {
            console.log(error);
          }
        };

    return (
        <>
     <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/tables"}>
      HYBE Food & Drinks
      </Link>
      <div style={{ display: 'flex', gap: '12px' }}>
      <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/tables"}>
         Table List
      </Link>
      <button
        onClick={(e) => handleLogout(e)} className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button">
            Logout
        </button>
      </div>
        </nav>
        {/* <hr className="separator" /> */}
        <br/>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
         onChange={(e) => setNewTitle(e.target.value)}
         value={newTitle}
         className="border border-slate-500 px-8 py-2 text-black" type="text" placeholder="Table Name" />
        <input
         onChange={(e) => setNewDescription(e.target.value)}
         value={newDescription}
        className="border border-slate-500 px-8 py-2 text-black" type="text" placeholder="Table description" />
    <button className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button py-3 px-6 w-fit">
    Update table
    </button>
    </form>
    </>
    );
}