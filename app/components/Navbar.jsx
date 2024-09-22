"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();

    const router = useRouter();

    const handleLogout = async (e) => {
      e.preventDefault();
  
      try {
      
        const res = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
      })
       if (res.ok) {
        router.replace("/");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    return (
        // <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
            <div style={{ flex: 0.4 }}></div>
      <div className="font-bold page-title" href={"/"}>
        {Array.from("HYBE Food & Drinks").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}    
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
      <Link className="px-6 py-2 mt-3 add-table" href={"/addTable"}>
        Add Table
      </Link>
      <Link className="px-6 py-2 mt-3 add-table" href={"/listReport"}>
        Sales Report
      </Link>
      <button
        onClick={(e) => handleLogout(e)} className="bg-red-500 text-white font-bold px-6 py-2 mt-3">
            Logout
        </button>
      </div>
        </nav>
    )
}