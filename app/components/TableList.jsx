import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import ActionBtn from "./ActionBtn";
import dynamic from "next/dynamic";
import ToastMessage from "./ToastMessage";
import { FaCrown, FaGlassCheers, FaUmbrellaBeach } from "react-icons/fa";
import { GiRoundTable } from "react-icons/gi";
import React from 'react';
import InventoryWarning from "./InventoryWarning";

const ChecklistWrapper = dynamic(() => import("./ChecklistWrapper"), {
  ssr: false,
  loading: () => null,
});

const getTables = async () => {
  try {
    const res = await fetch("https://billing-nextjs.vercel.app/api/tables", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch tables");

    const data = await res.json();
    const tables = data.tables;

    if (!Array.isArray(tables)) return [];

    const tablesWithOrders = await Promise.all(
      tables.map(async (table) => {
        const orderRes = await fetch(
          `https://billing-nextjs.vercel.app/api/orders/${table._id}`,
          { cache: "no-store" }
        );
        const orders = await orderRes.json();
        const totalPrice =
          orders.orderbyTableId?.reduce((sum, order) => {
            return sum + (order.final_price || 0);
          }, 0) || 0;

        return { ...table, orders, totalPrice };
      })
    );

    return tablesWithOrders;
  } catch (error) {
    console.error("Error loading tables: ", error);
    return [];
  }
};

export default async function TableList() {
  const tables = await getTables();

  if (!Array.isArray(tables)) {
    return (
      <div className="text-center text-red-400 py-6">
        Error loading tables.
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="text-center text-gray-300 py-6">
        No tables available.
      </div>
    );
  }

  const vipTables = tables.slice(0, 4);
  const premiumTables = tables.slice(4, 6).reverse();
  const standardTables = tables.slice(6, 10).reverse();
  const terraceTables = tables.slice(10);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 transition-colors duration-300 relative" style={{backgroundColor: '#283141'}}>
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10" style={{backgroundColor: '#283141'}} />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Notifications */}
        <div className="mb-8 space-y-4 max-w-4xl mx-auto">
          {/* <ToastMessage /> */}
          <ChecklistWrapper />
          <InventoryWarning />
        </div>

        <div className="space-y-[-8px] max-w-7xl mx-auto">
          <TableSection
            tables={vipTables}
            gradient="from-amber-600 to-amber-800"
          />
          <TableSection
            tables={premiumTables}
            gradient="from-purple-600 to-indigo-800"
          />
          <TableSection
            tables={standardTables}
            gradient="from-blue-600 to-cyan-800"
          />
          <TableSection
            title="Terrace"
            tables={terraceTables}
            icon={<FaUmbrellaBeach className="text-emerald-500" />}
            gradient="from-emerald-600 to-teal-800"
            isTerrace
          />
        </div>
      </div>
    </div>
  );
}

function TableSection({ title, tables, icon, gradient, isTerrace = false }) {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="relative -mt-16">
      <div className="absolute -top-8 -left-4 w-16 h-16 opacity-20">
        {icon && React.cloneElement(icon, { className: `${icon.props.className} w-full h-full` })}
      </div>
    
      <h2 className={`text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${gradient} inline-flex items-center gap-3`}>
        {icon && React.cloneElement(icon, { size: 28 })}
        {title}
      </h2>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:mx-auto">
        {tables.map((t) => (
          <LuxuryTableCard
            key={t._id}
            table={t}
            gradient={gradient}
            isTerrace={isTerrace}
          />
        ))}
      </div>
    </div>
  );
}

function LuxuryTableCard({ table, gradient, isTerrace = false }) {
  const isRunning = table.orders.orderbyTableId.length > 0;
  const animationDelay = Math.random() * 0.5;

  return (
    <div
      className={`relative group transform transition-all duration-500 hover:-translate-y-2`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Floating effect */}
      <div className="absolute inset-0 rounded-3xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:shadow-xl"></div>
    
      {/* Glowing aura */}
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${gradient} blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
    
      {/* Main card */}
      <div
        className="relative z-10 h-full p-2 rounded-3xl border-2 transition-all duration-500 overflow-hidden backdrop-blur-sm shadow-md group-hover:shadow-lg"
        style={{
          backgroundColor: '#222937',
          borderColor: isTerrace ? 'rgba(252, 211, 77, 0.3)' : 'rgba(229, 231, 235, 0.3)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'}}></div>
      
        {/* Header */}
        <div className="relative z-20 flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-xl p-1 font-bold mb-1 ${isTerrace ? 'text-amber-200' : 'text-white'}`}>
              {table.title}
            </h3>
            <p className={`text-sm ${isTerrace ? 'text-amber-100/80' : 'text-gray-100/80'}`}>
              {table.description}
            </p>
          </div>
        
          <div className="flex space-x-3">
            <Link href={`/listOrder/${table._id}`}>
              <ActionBtn className="hover:scale-110 transition-transform" />
            </Link>
            <Link href={`/editTable/${table._id}`}>
              <HiPencilAlt
                className={`text-2xl p-1 rounded-full transition-all
                  ${isTerrace ?
                    'text-amber-200 hover:bg-amber-500/30' :
                    'text-gray-200 hover:bg-gray-500/30'}
                  hover:shadow-sm hover:scale-110`}
              />
            </Link>
          </div>
        </div>

        {/* Status indicator */}
        <div className="relative z-20 mb-5 -mt-3">
          {isRunning ? (
            <div className="inline-flex items-center px-4 py-2 rounded-full border shadow-inner" style={{background: 'linear-gradient(to right, rgba(187, 247, 208, 0.3) 0%, rgba(167, 243, 208, 0.3) 100%)', borderColor: 'rgba(187, 247, 208, 0.4)'}}>
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-100">Active</span>
              <span className="ml-1 text-[0.65rem] text-green-200">Running</span>
            </div>
          ) : (
            <div className="inline-flex items-center px-4 py-2 rounded-full border shadow-inner" style={{background: 'linear-gradient(to right, rgba(255, 255, 255, 0.2) 0%, rgba(243, 244, 246, 0.2) 100%)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
              <span className="w-2 h-2 mr-2 bg-gray-300 rounded-full"></span>
              <span className="text-sm font-medium text-gray-100">Available</span>
            </div>
          )}
        </div>

        {/* Total Bill - appears only when table is running */}
        {isRunning && (
          <div className="relative z-20 p-2 rounded-xl border shadow-inner overflow-hidden -mt-3" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(243, 244, 246, 0.15) 100%)', borderColor: 'rgba(255, 255, 255, 0.2)'}}>
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-1 h-full" style={{background: 'linear-gradient(to bottom, rgb(245, 158, 11) 0%, rgb(252, 211, 77) 100%)'}}></div>
          
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-1">
                  Current Bill
                </p>
                <p className="text-sm font-bold text-white">
                  रू {table.totalPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-xs px-2 py-1 rounded border" style={{backgroundColor: 'rgba(253, 230, 138, 0.2)', borderColor: 'rgba(253, 230, 138, 0.3)', color: '#fef3c7'}}>
                {table.orders.orderbyTableId.length} items
              </div>
            </div>
          </div>
        )}

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 pattern-dots pattern-white pattern-size-2"></div>
      </div>
    </div>
  );
}