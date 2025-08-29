// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import Select from 'react-select';

// export default function EditBillForm({ id, billStatus, finalPrice, billPaymentMode, remarks, onBillAdded }) {
//     const [newBillStatus, setNewBillStatus] = useState(billStatus);
//     const [newFinalPrice, setNewFinalPrice] = useState(finalPrice);
//     const [newBillPaymentMode, setNewBillPaymentMode] = useState(billPaymentMode);
//     const [qrAmount, setQrAmount] = useState('');
//     const [cashAmount, setCashAmount] = useState('');
//     const [newRemarks, setRemarks] = useState(remarks);

//     const options = [
//       { value: 'pending', label: 'Pending' },
//       { value: 'paid', label: 'Paid' }
//     ];

//     const paymentModeOptions = [
//       { value: 'QR Payment', label: 'QR Payment' },
//       { value: 'Cash Payment', label: 'Cash Payment' },
//       { value: 'Both QR and Cash', label: 'Both QR and Cash' }
//     ];

//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const res = await fetch(`/api/bill/${id}`, {
//               method: "PUT",
//               headers: {
//                 "Content-type": "application/json",
//               },
//               body: JSON.stringify({ 
//                 billStatus: newBillStatus, 
//                 finalPrice: newFinalPrice, 
//                 billPaymentMode: newBillPaymentMode,
//                 qrAmount: newBillPaymentMode === 'Both QR and Cash' ? qrAmount : undefined,
//                 cashAmount: newBillPaymentMode === 'Both QR and Cash' ? cashAmount : undefined,
//                 remarks: newRemarks
//               }),
//             });
      
//             if (!res.ok) {
//               throw new Error("Failed to update bill status");
//             }
//             toast.success("Bill status updated!");

//             router.refresh();
//             onBillAdded(finalPrice);
//           } catch (error) {
//             console.log(error);
//           }
//         };

//         const Dropdown = (selectedOption) => {
//           setNewBillStatus(selectedOption.value);
//         };

//         const handlePaymentModeChange = (selectedOption) => {
//           setNewBillPaymentMode(selectedOption.value);
//         };

//     return (
//       <>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//             <label className="font-bold">Final Price</label>
//             <input
//                 onChange={(e) => setNewFinalPrice(e.target.value)}
//                 value={newFinalPrice}
//                 className="border border-slate-500 px-8 py-2"
//                 type="number"
//                 placeholder="Final price"
//                 required
//             />

//             <label className="font-bold">Bill Status</label>
//             <Select
//               options={options}
//               onChange={Dropdown}
//               value={{ value: newBillStatus, label: newBillStatus }}      
//               styles={{ control: (provided) => ({ ...provided, width: 400 }),
//                         menu: (provided) => ({ ...provided, width: 400 })
//               }}
//               placeholder="Select bill status"
//               required
//             />

//             <label className="font-bold">Payment Mode</label>
//             <Select
//               options={paymentModeOptions}
//               onChange={handlePaymentModeChange}
//               value={{ value: newBillPaymentMode, label: newBillPaymentMode }}      
//               styles={{ control: (provided) => ({ ...provided, width: 400 }),
//                         menu: (provided) => ({ ...provided, width: 400 }) }}
//               placeholder="Select payment mode"
//               required
//             />

//             {/* Conditionally render QR and Cash amount input fields if 'Both QR and Cash' is selected */}
//             {newBillPaymentMode === 'Both QR and Cash' && (
//               <>
//                 <label className="font-bold">QR Amount</label>
//                 <input
//                   onChange={(e) => setQrAmount(e.target.value)}
//                   value={qrAmount}
//                   className="border border-slate-500 px-8 py-2"
//                   type="number"
//                   placeholder="QR Amount"
//                   required
//                 />
                
//                 <label className="font-bold">Cash Amount</label>
//                 <input
//                   onChange={(e) => setCashAmount(e.target.value)}
//                   value={cashAmount}
//                   className="border border-slate-500 px-8 py-2"
//                   type="number"
//                   placeholder="Cash Amount"
//                   required
//                 />
//               </>
//             )}

//             <label className="font-bold">Remarks</label>
//             <input
//               onChange={(e) => setRemarks(e.target.value)}
//               value={newRemarks}
//               className="border border-slate-500 px-8 py-2"
//               type="text"
//               placeholder="Remarks"
//               required
//             />

//             <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
//               Update Bill
//             </button>
//         </form>
//       </>
//     );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Select from 'react-select';

export default function EditBillForm({ id, bill, billStatus, finalPrice, billPaymentMode, remarks, onBillAdded }) {
    const [newBillStatus, setNewBillStatus] = useState(billStatus);
    const [newFinalPrice, setNewFinalPrice] = useState(finalPrice);
    const [newBillPaymentMode, setNewBillPaymentMode] = useState(billPaymentMode);
    const [qrAmount, setQrAmount] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [newRemarks, setRemarks] = useState(remarks);
    const [newBill, setNewBill] = useState(bill); // Initialize with the passed bill prop
    const [isBillStatusValid, setIsBillStatusValid] = useState(true); // Track bill status validity

      const options = [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' }
    ];

    const paymentModeOptions = [
      { value: 'QR Payment', label: 'QR Payment' },
      { value: 'Cash Payment', label: 'Cash Payment' },
      { value: 'Both QR and Cash', label: 'Both QR and Cash' }
    ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if bill status is selected
        if (!newBillStatus) {
            setIsBillStatusValid(false);
            toast.error("Please select a bill status.");
            return; // Prevent form submission
        }

        try {
            const res = await fetch(`/api/bill/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ 
                billStatus: newBillStatus, 
                finalPrice: newFinalPrice, 
                billPaymentMode: newBillPaymentMode,
                qrAmount: newBillPaymentMode === 'Both QR and Cash' ? qrAmount : undefined,
                cashAmount: newBillPaymentMode === 'Both QR and Cash' ? cashAmount : undefined,
                remarks: newRemarks
              }),
            });
      
            if (!res.ok) {
              throw new Error("Failed to update bill status");
            }
            toast.success("Bill status updated!");

            router.refresh();
            onBillAdded(finalPrice);
        } catch (error) {
            console.log(error);
        }
    };

    const Dropdown = (selectedOption) => {
        setNewBillStatus(selectedOption.value);
        setIsBillStatusValid(true); // Reset validity on selection
    };

    const handlePaymentModeChange = (selectedOption) => {
        setNewBillPaymentMode(selectedOption.value);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-xl shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="finalPrice" className="block text-xs font-medium text-gray-700 mb-1">Final Amount</label>
                    <input
                        id="finalPrice"
                        onChange={(e) => setNewFinalPrice(e.target.value)}
                        value={newFinalPrice}
                        className="w-full p-2 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-300 bg-yellow-50" 
                        type="number" 
                        placeholder="0.00" 
                        required
                    />
                </div>
    
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="billStatus" className="block text-xs font-medium text-gray-700 mb-1">Bill Status</label>
                        <Select
                            id="billStatus"
                            options={options}
                            onChange={Dropdown}
                            value={options.find(option => option.value === newBillStatus) || null}
                            className="w-full p-2 text-sm text-gray-700 bg-blue-50 rounded-lg" 
                            styles={{
                                control: (provided) => ({ 
                                    ...provided, 
                                    backgroundColor: '#eff6ff',
                                    borderColor: '#d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    fontSize: '0.8rem',
                                    minHeight: '52px'
                                }),
                            }}
                            placeholder="Select bill status"
                            required
                        />
                    </div>
    
                    <div>
                        <label htmlFor="paymentMode" className="block text-xs font-medium text-gray-700 mb-1">Payment Mode</label>
                        <Select
                            id="paymentMode"
                            options={paymentModeOptions}
                            onChange={handlePaymentModeChange}
                            value={paymentModeOptions.find(option => option.value === newBillPaymentMode) || null}
                            className="w-full p-2 text-sm text-gray-700 bg-blue-50 rounded-lg" 
                            styles={{
                                control: (provided) => ({ 
                                    ...provided, 
                                    backgroundColor: '#eff6ff',
                                    borderColor: '#d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    fontSize: '0.8rem',
                                    minHeight: '52px'
                                }),
                            }}
                            placeholder="Select payment"
                        />
                    </div>
                </div>
    
                {/* Conditionally render QR and Cash amount input fields if 'Both QR and Cash' is selected */}
                {newBillPaymentMode === 'Both QR and Cash' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="qrAmount" className="block text-xs font-medium text-gray-700 mb-1">QR Amount</label>
                            <input
                                id="qrAmount"
                                onChange={(e) => setQrAmount(e.target.value)}
                                value={qrAmount}
                                className="w-full p-2 text-sm text-gray-700 bg-blue-50 rounded-lg border border-gray-300" 
                                type="number" 
                                placeholder="0.00" 
                                required
                            />
                        </div>
                        
                        <div>
                        <label htmlFor="cashAmount" className="block text-xs font-medium text-gray-700 mb-1">Cash Amount</label>
                            <input
                                id="cashAmount"
                                onChange={(e) => setCashAmount(e.target.value)}
                                value={cashAmount}
                                className="w-full p-2 text-sm text-gray-700 bg-blue-50 rounded-lg border border-gray-300" 
                                type="number" 
                                placeholder="0.00" 
                                required
                            />
                        </div>
                    </div>
                )}
    
                <div>
                    <label htmlFor="remarks" className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                    <input
                        id="remarks"
                        onChange={(e) => setRemarks(e.target.value)}
                        value={newRemarks}
                        className="w-full p-2 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-300 bg-yellow-5" 
                        type="text" 
                        placeholder="Additional notes..." 
                        required
                    />
                </div>
    
                <div className="pt-4">
                    <button 
                        type="submit" 
                        className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${!isBillStatusValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isBillStatusValid}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Update Bill
                    </button>
                </div>
            </form>
        </div>
    );
}

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import Select from 'react-select';

// export default function EditBillForm({ id, bill, billStatus, finalPrice, billPaymentMode, remarks, onBillAdded }) {
//     const [newBillStatus, setNewBillStatus] = useState(billStatus);
//     const [newFinalPrice, setNewFinalPrice] = useState(finalPrice);
//     const [newBillPaymentMode, setNewBillPaymentMode] = useState(billPaymentMode);
//     const [qrAmount, setQrAmount] = useState('');
//     const [cashAmount, setCashAmount] = useState('');
//     const [newRemarks, setRemarks] = useState(remarks);
//     const [newBill, setNewBill] = useState(bill); // Initialize with the passed bill prop
//     const [discount, setDiscount] = useState(0); // New state for discount
//     const [isBillStatusValid, setIsBillStatusValid] = useState(true); // Track bill status validity
//     const [isAutoCalculation, setIsAutoCalculation] = useState(true); // Track if final price is auto-calculated or manually edited

//     const options = [
//         { value: 'pending', label: 'Pending' },
//         { value: 'paid', label: 'Paid' }
//     ];

//     const paymentModeOptions = [
//         { value: 'QR Payment', label: 'QR Payment' },
//         { value: 'Cash Payment', label: 'Cash Payment' },
//         { value: 'Both QR and Cash', label: 'Both QR and Cash' }
//     ];

//     const router = useRouter();

//     useEffect(() => {
//         // Calculate the final price based on the bill and discount only if auto-calculation is enabled
//         if (isAutoCalculation) {
//             const discountedPrice = newBill - (newBill * (discount / 100));
//             setNewFinalPrice(Number(discountedPrice).toString().replace(/\.?0+$/, '')); // Remove trailing zeros and decimals if not needed
//         }
//     }, [newBill, discount, isAutoCalculation]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Check if bill status is selected
//         if (!newBillStatus) {
//             setIsBillStatusValid(false);
//             toast.error("Please select a bill status.");
//             return; // Prevent form submission
//         }

//         try {
//             const res = await fetch(`/api/bill/${id}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     billStatus: newBillStatus,
//                     finalPrice: newFinalPrice,
//                     billPaymentMode: newBillPaymentMode,
//                     qrAmount: newBillPaymentMode === 'Both QR and Cash' ? qrAmount : undefined,
//                     cashAmount: newBillPaymentMode === 'Both QR and Cash' ? cashAmount : undefined,
//                     remarks: newRemarks
//                 }),
//             });

//             if (!res.ok) {
//                 throw new Error("Failed to update bill status");
//             }
//             toast.success("Bill status updated!");

//             router.refresh();
//             onBillAdded(finalPrice);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const Dropdown = (selectedOption) => {
//         setNewBillStatus(selectedOption.value);
//         setIsBillStatusValid(true); // Reset validity on selection
//     };

//     const handlePaymentModeChange = (selectedOption) => {
//         setNewBillPaymentMode(selectedOption.value);
//     };

//     const handleFinalPriceChange = (e) => {
//         setNewFinalPrice(e.target.value);
//         setIsAutoCalculation(false); // Disable auto-calculation if user manually edits the final price
//     };

//     return (
//         <>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//                 <label className="font-bold">Bill</label>
//                 <input
//                     onChange={(e) => {
//                         setNewBill(e.target.value);
//                         setIsAutoCalculation(true); // Re-enable auto-calculation when the bill amount changes
//                     }}
//                     value={newBill}
//                     className="border border-slate-500 px-8 py-2"
//                     type="number"
//                     placeholder="Bill amount"
//                     required
//                 />

//                 <label className="font-bold">Discount (%)</label>
//                 <input
//                     onChange={(e) => {
//                         setDiscount(e.target.value);
//                         setIsAutoCalculation(true); // Re-enable auto-calculation when the discount changes
//                     }}
//                     value={discount}
//                     className="border border-slate-500 px-8 py-2"
//                     type="number"
//                     placeholder="Discount"
//                 />

//                 <label className="font-bold">Final Price</label>
//                 <input
//                     onChange={handleFinalPriceChange}
//                     value={newFinalPrice}
//                     className="border border-slate-500 px-8 py-2"
//                     type="text"
//                     placeholder="Final price"
//                     required
//                 />

//                 <label className="font-bold">Bill Status</label>
//                 <Select
//                     options={options}
//                     onChange={Dropdown}
//                     value={options.find(option => option.value === newBillStatus) || null}
//                     styles={{
//                         control: (provided) => ({ ...provided, width: 400 }),
//                         menu: (provided) => ({ ...provided, width: 400 }),
//                     }}
//                     placeholder="Select bill status"
//                     required
//                 />

//                 <label className="font-bold">Payment Mode</label>
//                 <Select
//                     options={paymentModeOptions}
//                     onChange={handlePaymentModeChange}
//                     value={paymentModeOptions.find(option => option.value === newBillPaymentMode) || null}
//                     styles={{
//                         control: (provided) => ({ ...provided, width: 400 }),
//                         menu: (provided) => ({ ...provided, width: 400 }),
//                     }}
//                     placeholder="Select payment mode"
//                 />

//                 {newBillPaymentMode === 'Both QR and Cash' && (
//                     <>
//                         <label className="font-bold">QR Amount</label>
//                         <input
//                             onChange={(e) => setQrAmount(e.target.value)}
//                             value={qrAmount}
//                             className="border border-slate-500 px-8 py-2"
//                             type="number"
//                             placeholder="QR Amount"
//                             required
//                         />
                        
//                         <label className="font-bold">Cash Amount</label>
//                         <input
//                             onChange={(e) => setCashAmount(e.target.value)}
//                             value={cashAmount}
//                             className="border border-slate-500 px-8 py-2"
//                             type="number"
//                             placeholder="Cash Amount"
//                             required
//                         />
//                     </>
//                 )}

//                 <label className="font-bold">Remarks</label>
//                 <input
//                     onChange={(e) => setRemarks(e.target.value)}
//                     value={newRemarks}
//                     className="border border-slate-500 px-8 py-2"
//                     type="text"
//                     placeholder="Remarks"
//                     required
//                 />

//                 <button className={`bg-green-600 font-bold text-white py-3 px-6 w-fit ${!isBillStatusValid ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isBillStatusValid}>
//                     Update Bill
//                 </button>
//             </form>
//         </>
//     );
// }