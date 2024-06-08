"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        // <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar">
      <Link className="text-white font-bold" href={"/"}>
      Vivid Cafe & Booze
      </Link>
      <div style={{ display: 'flex', gap: '12px' }}>
      <Link className="bg-white px-6 py-2 mt-3" href={"/addTable"}>
        Add Table
      </Link>
      <button
        onClick={() => signOut()} className="bg-red-500 text-white font-bold px-6 py-2 mt-3">
            Logout
        </button>
      </div>
        </nav>
    )
}