"use client";
import Link from "next/link";
import { useState } from "react";
import { 
  FaChartBar, 
  FaUsers, 
  FaHome, 
  FaSignOutAlt, 
  FaReceipt, 
  FaBars, 
  FaTimes, 
  FaDollarSign, 
  FaClipboardList, 
  FaWineBottle,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";

const navLinks = [
  { key: "dashboard", label: "Dashboard", icon: FaHome, path: "/dashReport" },
  { key: "attendance", label: "Attendance", icon: FaUsers, path: "/attendance" },
  { key: "inventory", label: "Inventory", icon: FaWineBottle, path: "/inventory" },
  { key: "sales", label: "Sales Report", icon: FaChartBar, path: "/listReport" },
  { key: "orders", label: "Order Report", icon: FaReceipt, path: "/listSales" },
  { key: "credit", label: "Credit", icon: FaUsers, path: "/credit" },
  { key: "note", label: "Note", icon: FaUsers, path: "/note" },
];

const accordionSections = [
  {
    key: "management",
    label: "Management",
    icon: FaClipboardList,
    items: [
      { key: "duty", label: "Duty Roster", path: "/dutyRoster" },
      { key: "price", label: "Item Price", path: "/priceList" },
      { key: "employee", label: "Employee", path: "/employee" },
      { key: "orderQuantity", label: "Order Quantity", path: "/orderQuantity" },
      { key: "stock", label: "Stock", path: "/stock" },
    ]
  }
];

export default function SideNav({ activeTab, onLogout, isCollapsed, toggleSidebar }) {
  const [openSections, setOpenSections] = useState(new Set());

  const toggleSection = (sectionKey) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionKey)) {
      newOpenSections.delete(sectionKey);
    } else {
      newOpenSections.add(sectionKey);
    }
    setOpenSections(newOpenSections);
  };

  const isSectionOpen = (sectionKey) => openSections.has(sectionKey);

  return (
    <div className="flex fixed left-0 top-0 h-screen">
      {/* Sidebar */}
      <div 
        className={`bg-[#283141] h-full pt-16 transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <br></br>
        
        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <nav className="space-y-2 px-4 pb-4">
            {/* Regular navigation links */}
            {navLinks.map(({ key, label, icon: Icon, path }) => (
              <Link
                key={key}
                href={path}
                className={`flex items-center p-3 rounded-lg hover:bg-[#3a4659] transition ${
                  activeTab === key ? "bg-[#3a4659] text-white" : "text-gray-300"
                }`}
                title={isCollapsed ? label : ""}
              >
                <Icon className={`${isCollapsed ? "mx-auto" : "mr-3"}`} />
                {!isCollapsed && (
                  <span className="truncate">{label}</span>
                )}
              </Link>
            ))}

            {/* Accordion sections */}
            {accordionSections.map((section) => (
              <div key={section.key} className="border-t border-gray-700 pt-2 first:border-t-0">
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(section.key)}
                  className={`flex items-center w-full p-3 rounded-lg hover:bg-[#3a4659] transition text-gray-300 hover:text-white ${
                    isCollapsed ? "justify-center" : "justify-between"
                  }`}
                  title={isCollapsed ? section.label : ""}
                >
                  <div className="flex items-center">
                    <section.icon className={isCollapsed ? "" : "mr-3"} />
                    {!isCollapsed && (
                      <span className="truncate">{section.label}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    isSectionOpen(section.key) ? 
                      <FaChevronDown className="text-sm flex-shrink-0" /> : 
                      <FaChevronRight className="text-sm flex-shrink-0" />
                  )}
                </button>

                {/* Accordion content */}
                {!isCollapsed && isSectionOpen(section.key) && (
                  <div className="ml-4 space-y-1 border-l border-gray-600 pl-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.key}
                        href={item.path}
                        className={`flex items-center p-2 rounded-lg hover:bg-[#3a4659] transition ${
                          activeTab === item.key ? "bg-[#3a4659] text-white" : "text-gray-300"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Collapsed view - show items directly when collapsed */}
                {isCollapsed && isSectionOpen(section.key) && (
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.key}
                        href={item.path}
                        className={`flex items-center justify-center p-2 rounded-lg hover:bg-[#3a4659] transition ${
                          activeTab === item.key ? "bg-[#3a4659] text-white" : "text-gray-300"
                        }`}
                        title={item.label}
                      >
                        •
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Fixed Logout Section */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-700 px-4 pb-4">
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

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a2530;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
}