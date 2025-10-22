"use client";

// import Navbar from "../components/Navbar";
import LandingPage from "../components/LandingPage";
import TableList from "../components/TableList";
import Link from "next/link";

export default function Dashboard() {

  return (
    <>
     <div>
      {/* <Navbar /> */}

      {/* <UserInfoForm /> */}
      <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
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
       <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/dashReport"}>
        Dashboard
      </Link>
      <button
        onClick={(e) => handleLogout(e)} className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button">
            Logout
        </button>
      </div>
        </nav>
      <TableList />
    </div>
    </>
  );
}
