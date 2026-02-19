"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaChartBar,
  FaUsers,
  FaHome,
  FaSignOutAlt,
  FaReceipt,
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
      { key: "menu", label: "Menu", path: "/menuList" },
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

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-12 sm:top-14 bottom-0 z-40 bg-[#283141] transition-[width,transform] duration-300 ease-in-out flex flex-col
          w-64 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
          md:translate-x-0 md:w-64
        `}
      >

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <nav className="space-y-2 px-4 pb-4">
            {/* Regular navigation links */}
            {navLinks.map(({ key, label, icon: Icon, path }) => (
              <Link
                key={key}
                href={path}
                onClick={handleNavClick}
                className={`flex items-center p-3 rounded-lg hover:bg-[#3a4659] transition ${
                  activeTab === key ? "bg-[#3a4659] text-white" : "text-gray-300"
                }`}
              >
                <Icon className="shrink-0 mr-3" />
                <span className="truncate">{label}</span>
              </Link>
            ))}

            {/* Accordion sections */}
            {accordionSections.map((section) => (
              <div key={section.key} className="border-t border-gray-700 pt-2 first:border-t-0">
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(section.key)}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-[#3a4659] transition text-gray-300 hover:text-white justify-between"
                >
                  <div className="flex items-center">
                    <section.icon className="shrink-0 mr-3" />
                    <span className="truncate">{section.label}</span>
                  </div>
                  <span>
                    {isSectionOpen(section.key) ?
                      <FaChevronDown className="text-sm flex-shrink-0" /> :
                      <FaChevronRight className="text-sm flex-shrink-0" />
                    }
                  </span>
                </button>

                {/* Accordion content - expanded view */}
                {isSectionOpen(section.key) && (
                  <div className="ml-4 space-y-1 border-l border-gray-600 pl-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.key}
                        href={item.path}
                        onClick={handleNavClick}
                        className={`flex items-center p-2 rounded-lg hover:bg-[#3a4659] transition ${
                          activeTab === item.key ? "bg-[#3a4659] text-white" : "text-gray-300"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
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
            className="flex items-center w-full p-3 rounded-lg hover:bg-[#3a4659] transition text-gray-300 hover:text-white"
          >
            <FaSignOutAlt className="shrink-0 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

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
    </>
  );
}