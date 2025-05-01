"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaTable } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

export default function LandingPage() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 bg-[#283141] p-4 relative overflow-hidden">
      
      {/* Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <br></br>
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
          The HYBE
        </h1>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        
        {/* View Tables Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link
            href="/tables"
            className="block border border-gray-400 bg-white bg-opacity-30 backdrop-blur-lg rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 hover:bg-opacity-50 hover:shadow-2xl"
          >
             <FaTable className="w-16 h-16 text-pink-500 mb-4" /> 
            <h2 className="text-3xl font-bold mb-4 text-gray-800 transition-colors duration-300">
             Tables
            </h2>
            <p className="text-gray-600">View Tables</p>
          </Link>
        </motion.div>

        {/* View Sales Report Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link
            href="/listReport"
            className="block border border-gray-400 bg-white bg-opacity-30 backdrop-blur-lg rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 hover:bg-opacity-50 hover:shadow-2xl"
          >
            <FaChartBar className="w-16 h-16 text-purple-500 mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800 transition-colors duration-300">
            Sales Report
            </h2>
            <p className="text-gray-600">View Sales Report</p>
          </Link>
        </motion.div>

      </div>

    </div>
  );
}
