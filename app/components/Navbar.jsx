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
        <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
        <div style={{ flex: 0.4 }}></div>
        <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/dashReport"}>
      HYBE Food & Drinks
      </Link>
      <div style={{ display: 'flex', gap: '12px' }}>
      <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/dashReport"}>
        Dashboard
      </Link>
      <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/addTable"}>
        Add Table
      </Link>
      <button
        onClick={(e) => handleLogout(e)} className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button">
            Logout
        </button>
      </div>
        </nav>
    )
}