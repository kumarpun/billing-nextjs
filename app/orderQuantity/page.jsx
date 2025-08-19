"use client";
import { useState } from "react";
import OrderQuantityDetails from "../components/orderDetailsClient";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function OrderQuantity() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
      <SideNav activeTab="orderQuantity" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopNav 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
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