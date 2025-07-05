"use client";
import Link from "next/link";
import { FaChartBar, FaUsers, FaHome, FaSignOutAlt, FaReceipt, FaBars, FaTimes, FaDollarSign, FaClipboardList, FaWineBottle } from "react-icons/fa";

const navLinks = [
  { key: "dashboard", label: "Dashboard", icon: FaHome, path: "/dashReport" },
  { key: "price", label: "Item Price", icon: FaDollarSign, path: "/priceList" },
  { key: "duty", label: "Duty Roster", icon: FaClipboardList, path: "/dutyRoster" },
  { key: "sales", label: "Sales Report", icon: FaChartBar, path: "/listReport" },
  { key: "orders", label: "Order Report", icon: FaReceipt, path: "/listSales" },
  { key: "inventory", label: "Inventory", icon: FaWineBottle, path: "/inventory" },
  { key: "employee", label: "Employee", icon: FaUsers, path: "/employee" },
];

export default function SideNav({ activeTab, onLogout, isCollapsed, toggleSidebar }) {
  return (
    <div className="flex fixed left-0 top-0 h-screen">
      {/* Sidebar */}
      <div 
        className={`bg-[#283141] h-full pt-16 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <br></br>
        <nav className="space-y-2 px-4">
          {navLinks.map(({ key, label, icon: Icon, path }) => (
            <Link
              key={key}
              href={path}
              className={`flex items-center p-3 rounded-lg hover:bg-[#3a4659] transition ${
                activeTab === key ? "bg-[#3a4659] text-white" : "text-gray-300"
              }`}
              title={isCollapsed ? label : ""} // Show tooltip when collapsed
            >
              <Icon className={`${isCollapsed ? "mx-auto" : "mr-3"}`} />
              {!isCollapsed && label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-700 px-4">
          <button
            onClick={onLogout}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-[#3a4659] transition text-gray-300 hover:text-white ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <FaSignOutAlt className={isCollapsed ? "" : "mr-3"} />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`self-start mt-4 ml-2 p-2 rounded-md bg-[#283141] text-white hover:bg-[#3a4659] transition z-50 ${
          isCollapsed ? "ml-2" : "ml-0"
        }`}
      >
        {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </button>
    </div>
  );
}