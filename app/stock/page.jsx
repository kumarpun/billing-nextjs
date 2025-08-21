"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";
import { FiRefreshCw, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Stock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const months = [
    { name: "August", link: "https://docs.google.com/spreadsheets/d/12cSkaLAunGLEOEAz5ytbAYpqXnfs5pfw_JEZgOyNL34/edit?gid=255479975#gid=255479975" },
    { name: "September", link: "https://docs.google.com/spreadsheets/d/1HVqVvQU58YrIAV4AxgTMhgJE_U47lCnlxcCS-qu50mg/edit?gid=0#gid=0" },
    { name: "October", link: "https://docs.google.com/spreadsheets/d/1eJCpPH35KrkQJvccUFyVVnZAeap0b-qzMvmMllkbeoc/edit?gid=0#gid=0" },
    { name: "November", link: "https://docs.google.com/spreadsheets/d/1BERVUYDkpE0r1Rkqn_YzFgTO0kzoiHRdoKUqWPZUQ0Q/edit?gid=0#gid=0" },
    { name: "December", link: "https://docs.google.com/spreadsheets/d/1N7yTMKdFG4W05GjVUQX7Dtt0ahFGhYgm8ssApNTNC_w/edit?gid=0#gid=0" }
  ];

  if (loading) {
    return (
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
        <SideNav activeTab="employee" isCollapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col">
          <TopNav 
            isSidebarCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
            <div className="flex items-center justify-center h-full w-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FiRefreshCw className="h-12 w-12 text-gradient bg-gradient-to-r from-blue-500 to-purple-600" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
        <SideNav activeTab="employee" isCollapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col">
          <TopNav 
            isSidebarCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
            <div className="text-red-500 text-lg bg-white p-4 rounded-xl shadow-lg">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
      <SideNav activeTab="stock" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopNav 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        <br></br>
        <br></br>
        <br></br> 
        <br></br> 
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Beverage Stock 2025
                </h1>
                <p className="text-gray-600 mt-3 text-lg">Access monthly stock records and analytics</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {months.map((month, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br rounded-2xl ${getRandomGradient()} opacity-80 group-hover:opacity-100 transition-all duration-300`}></div>
                  <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-white/20">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">{month.name}</h2>
                          <p className="text-gray-600 mt-1">Stock records</p>
                        </div>
                        <div className={`text-4xl ${getRandomIconColor()} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                          {getMonthIcon(month.name)}
                        </div>
                      </div>
                      <div className="mt-8 flex justify-between items-center">
                        <a
                          href={month.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-5 py-2.5 bg-white text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium group-hover:bg-gray-50"
                        >
                          Open Sheet
                          <FiExternalLink className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </a>
                      </div>
                    </div>
                    {hoveredCard === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for dynamic styling
function getRandomGradient() {
  const gradients = [
    "from-blue-400 to-cyan-400",
    "from-purple-400 to-pink-400",
    "from-green-400 to-teal-400",
    "from-yellow-400 to-orange-400",
    "from-indigo-400 to-blue-400"
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

function getRandomIconColor() {
  const colors = [
    "text-blue-500",
    "text-purple-500",
    "text-green-500",
    "text-yellow-500",
    "text-pink-500"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getMonthIcon(monthName) {
  const icons = {
    January: "❄️",
    February: "💝",
    March: "🌷",
    April: "🌧️",
    May: "🌻",
    June: "☀️",
    July: "🏖️",
    August: "🍦",
    September: "🍁",
    October: "🎃",
    November: "🦃",
    December: "🎄"
  };
  return icons[monthName] || "📊";
}