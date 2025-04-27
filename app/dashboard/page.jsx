"use client";

// import Navbar from "../components/Navbar";
import LandingPage from "../components/LandingPage";
import Link from "next/link";

export default function Dashboard() {

  return (
    <>
     <div>
      {/* <Navbar /> */}

      {/* <UserInfoForm /> */}
      <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#cfcece" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/"}>
        {Array.from("HYBE Food & Drinks").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}    
      </Link>
      <div style={{ display: 'flex', gap: '12px' }}>
      {/* <Link className="px-6 py-2 mt-3 add-table" href={"/listReport"}>
        Sales Report
      </Link> */}
      <button
        onClick={(e) => handleLogout(e)} className="bg-red-500 text-white font-bold px-6 py-2 mt-3">
            Logout
        </button>
      </div>
        </nav>
      <LandingPage />
    </div>
    </>
  );
}
