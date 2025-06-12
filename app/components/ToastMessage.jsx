"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ToastMessage() {
  const [activeToast, setActiveToast] = useState(0); // 0 = thirsty, 1 = inventory, null = none
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setActiveToast(prev => {
        if (prev === null) return 0;
        return (prev + 1) % 2; // Cycle between 0 and 1
      });
    }, 20 * 60 * 1000); // 20 minutes in milliseconds

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  const handleClose = () => {
    setActiveToast(null);
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Plant Watering Toast */}
      {activeToast === 0 && (
        <div className="bg-green-50 border border-green-100 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 max-w-xs animate-fade-in">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </span>
              <strong className="block font-semibold">🌿 I am thirsty</strong>
            </div>
            <p className="mt-1 ml-7 text-sm">Please water me (Plants)</p>
          </div>
          <button
            onClick={handleClose}
            className="text-green-500 hover:text-green-700 transition-colors duration-200"
            aria-label="Close toast"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Bar Inventory Toast */}
      {activeToast === 1 && (
        <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 max-w-xs animate-fade-in">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V6z" clipRule="evenodd" />
                </svg>
              </span>
              <strong className="block font-semibold">🍸 Bar Inventory</strong>
            </div>
            <p className="mt-1 ml-7 text-sm">Did you update bar inventory? If not please update</p>
          </div>
          <button
            onClick={handleClose}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            aria-label="Close toast"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}