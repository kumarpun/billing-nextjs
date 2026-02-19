"use client";
import { useState } from "react";
import OrderQuantityDetails from "../components/orderDetailsClient";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function OrderQuantity() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
      <SideNav activeTab="orderQuantity" isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <TopNav 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        
        <div className={`flex-1 p-3 sm:p-6 transition-all duration-300 ml-0 md:ml-64 mt-12 sm:mt-14`}>
          <div className="max-w-7xl mx-auto">        
            <div>
              <OrderQuantityDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}