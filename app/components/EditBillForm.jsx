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
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">

            {/* <label className="font-bold">Bill</label>
                <input
                    onChange={(e) => setNewBill(e.target.value)}
                    value={newBill}
                    className="border border-slate-500 px-8 py-2"
                    type="number"
                    placeholder="Bill amount"
                    required
                /> */}

                <label className="font-bold">Final Price</label>
                <input
                    onChange={(e) => setNewFinalPrice(e.target.value)}
                    value={newFinalPrice}
                    className="border border-slate-500 px-8 py-2"
                    type="number"
                    placeholder="Final price"
                    required
                />

                <label className="font-bold">Bill Status</label>
                <Select
                    options={options}
                    onChange={Dropdown}
                    value={options.find(option => option.value === newBillStatus) || null}
                    styles={{
                        control: (provided) => ({ ...provided, width: 400 }),
                        menu: (provided) => ({ ...provided, width: 400 }),
                    }}
                    placeholder="Select bill status"
                    required
                />

                <label className="font-bold">Payment Mode</label>
                <Select
                    options={paymentModeOptions}
                    onChange={handlePaymentModeChange}
                    value={paymentModeOptions.find(option => option.value === newBillPaymentMode) || null}
                    styles={{
                        control: (provided) => ({ ...provided, width: 400 }),
                        menu: (provided) => ({ ...provided, width: 400 }),
                    }}
                    placeholder="Select payment mode"
                />

                {/* Conditionally render QR and Cash amount input fields if 'Both QR and Cash' is selected */}
                {newBillPaymentMode === 'Both QR and Cash' && (
                    <>
                        <label className="font-bold">QR Amount</label>
                        <input
                            onChange={(e) => setQrAmount(e.target.value)}
                            value={qrAmount}
                            className="border border-slate-500 px-8 py-2"
                            type="number"
                            placeholder="QR Amount"
                            required
                        />
                        
                        <label className="font-bold">Cash Amount</label>
                        <input
                            onChange={(e) => setCashAmount(e.target.value)}
                            value={cashAmount}
                            className="border border-slate-500 px-8 py-2"
                            type="number"
                            placeholder="Cash Amount"
                            required
                        />
                    </>
                )}

                <label className="font-bold">Remarks</label>
                <input
                    onChange={(e) => setRemarks(e.target.value)}
                    value={newRemarks}
                    className="border border-slate-500 px-8 py-2"
                    type="text"
                    placeholder="Remarks"
                    required
                />

                <button className={`bg-green-600 font-bold text-white py-3 px-6 w-fit ${!isBillStatusValid ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isBillStatusValid}>
                    Update Bill
                </button>
            </form>
        </>
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