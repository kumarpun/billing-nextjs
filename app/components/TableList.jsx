import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import ActionBtn from "./ActionBtn";
import dynamic from "next/dynamic";
import ToastMessage from "./ToastMessage";
import { FaCrown, FaGlassCheers, FaUmbrellaBeach } from "react-icons/fa";
import { GiRoundTable } from "react-icons/gi";
import React from 'react';


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
     <div className="text-center text-red-600 dark:text-red-400 py-6">
       Error loading tables.
     </div>
   );
 }


 if (tables.length === 0) {
   return (
     <div className="text-center text-gray-600 dark:text-gray-300 py-6">
       No tables available.
     </div>
   );
 }


 const vipTables = tables.slice(0, 4);
 const premiumTables = tables.slice(4, 6).reverse();
 const standardTables = tables.slice(6, 10).reverse();
 const terraceTables = tables.slice(10);


 return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black px-4 py-6 sm:px-8 transition-colors duration-300 table-top">
     {/* Header */}
     {/* <div className="mb-8 text-center">
       <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 mb-2">
         Table Management
       </h1>
       <p className="text-gray-500 dark:text-gray-400 italic">
         Premium dining experience control panel
       </p>
     </div> */}


     {/* Notifications */}
     <div className="mb-8 space-y-4 max-w-4xl mx-auto">
       <ToastMessage />
       <ChecklistWrapper />
     </div>


     <div className="space-y-[-8px] max-w-7xl mx-auto">
       <TableSection
         tables={vipTables}
         gradient="from-amber-600 to-amber-800 dark:from-amber-700 dark:to-amber-900"
       />
       <TableSection
         tables={premiumTables}
         gradient="from-purple-600 to-indigo-800 dark:from-purple-700 dark:to-indigo-900"
       />
       <TableSection
         tables={standardTables}
         gradient="from-blue-600 to-cyan-800 dark:from-blue-700 dark:to-cyan-900"
       />
       <TableSection
         title="Terrace"
         tables={terraceTables}
         icon={<FaUmbrellaBeach className="text-emerald-500" />}
         gradient="from-emerald-600 to-teal-800 dark:from-emerald-700 dark:to-teal-900"
         isTerrace
       />
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
       className={`relative z-10 h-full p-2 rounded-3xl border-2 transition-all duration-500 overflow-hidden
         ${isTerrace ? 'border-amber-300/30 dark:border-amber-500/30' : 'border-gray-200/30 dark:border-gray-600/30'}
         ${isRunning ? 'bg-white/90 dark:bg-gray-800/90' : 'bg-white/80 dark:bg-gray-800/80'}
         backdrop-blur-sm shadow-md group-hover:shadow-lg`}
     >
       {/* Decorative elements */}
       <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full bg-gradient-to-br from-amber-200/20 to-amber-400/10 dark:from-amber-600/10 dark:to-amber-800/10"></div>
      
       {/* Header */}
       <div className="relative z-20 flex justify-between items-start mb-4">
         <div>
           <h3 className={`text-xl p-1 font-bold mb-1 ${isTerrace ? 'text-amber-800 dark:text-amber-300' : 'text-gray-800 dark:text-white'}`}>
             {table.title}
           </h3>
           <p className={`text-sm ${isTerrace ? 'text-amber-600/80 dark:text-amber-400/80' : 'text-gray-500/80 dark:text-gray-400/80'}`}>
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
                   'text-amber-600 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900' :
                   'text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
                 hover:shadow-sm hover:scale-110`}
             />
           </Link>
         </div>
       </div>


       {/* Status indicator */}
       <div className="relative z-20 mb-5 -mt-3">
         {isRunning ? (
           <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border border-green-200 dark:border-emerald-800 shadow-inner">
             <span className="relative flex h-3 w-3 mr-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
             </span>
             <span className="text-sm font-medium text-green-800 dark:text-green-300">Active</span>
             <span className="ml-1 text-[0.65rem] text-green-600 dark:text-green-400">Running</span>
           </div>
         ) : (
           <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-800/50 border border-gray-300 dark:border-gray-600 shadow-inner">
             <span className="w-2 h-2 mr-2 bg-gray-400 rounded-full"></span>
             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
           </div>
         )}
       </div>


       {/* Total Bill - appears only when table is running */}
       {isRunning && (
         <div className="relative z-20 p-2 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-100 dark:border-gray-700 shadow-inner overflow-hidden -mt-3">
           {/* Decorative accent */}
           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-300 dark:from-amber-600 dark:to-amber-400"></div>
          
           <div className="flex justify-between items-center">
             <div>
               <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                 Current Bill
               </p>
               <p className="text-sm font-bold text-gray-800 dark:text-white">
                 रू {table.totalPrice.toLocaleString()}
               </p>
             </div>
             <div className="text-xs px-2 py-1 rounded bg-amber-100/50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
               {table.orders.orderbyTableId.length} items
             </div>
           </div>
         </div>
       )}


       {/* Subtle pattern overlay */}
       <div className="absolute inset-0 opacity-5 pattern-dots pattern-gray-400 pattern-size-2 dark:pattern-gray-600"></div>
     </div>
   </div>
 );
}
