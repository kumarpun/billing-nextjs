"use client";

import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

export default function InventoryWarning() {
  const [showInventoryWarning, setShowInventoryWarning] = useState(false);
  const [inventoryLastUpdated, setInventoryLastUpdated] = useState(null);

  const checkInventoryUpdates = async () => {
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if ANY item was updated today
      const anyUpdatedToday = data.inventory.some(item => {
        const updatedDate = new Date(item.updatedAt).toISOString().split('T')[0];
        return updatedDate === today;
      });
      
      if (!anyUpdatedToday) {
        // Find the oldest update date among all items
        const oldestUpdate = data.inventory.reduce((oldest, item) => {
          const itemDate = new Date(item.updatedAt);
          return itemDate < oldest ? itemDate : oldest;
        }, new Date());
        
        setInventoryLastUpdated(oldestUpdate.toISOString().split('T')[0]);
        setShowInventoryWarning(true);
      } else {
        setShowInventoryWarning(false);
      }
    } catch (error) {
      console.error("Error checking inventory updates:", error);
    }
  };

  useEffect(() => {
    checkInventoryUpdates();
  }, []);

  if (!showInventoryWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Inventory Update Required</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Some inventory items haven't been updated today. Last update was on {new Date(inventoryLastUpdated).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}.</p>
              <p className="mt-2">Please update your inventory to ensure accurate stock levels.</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                href="/inventory"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};