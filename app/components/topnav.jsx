"use client";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function TopNav({ isSidebarCollapsed, toggleSidebar }) {
  return (
    <div>
         <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 bg-[#232b38]">  
         <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-300 hover:bg-[#3a4659] transition"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </button>          
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/dashReport"}>
      HYBE Food & Drinks
      </Link>
        {/* {Array.from("HYBE Food & Drinks").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}     */}
      <div style={{ display: 'flex', gap: '12px' }}>
      {/* <Link className="px-6 py-2 mt-3 add-table" href={"/listReport"}>
        Sales Report
      </Link> */}
       <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/tables"}>
         Tables
      </Link>
        <a
                        className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button"
                        href="https://docs.google.com/spreadsheets/d/1bsYPfCKZkcrKZrWfRqS4RiKmwOXwLMQ3USFfJ9wiKwg/edit?gid=1009457690#gid=1009457690"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Credit
                    </a>
   
      </div>
        </nav>
    </div>
  );
}