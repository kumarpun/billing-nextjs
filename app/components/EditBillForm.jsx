"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Select from 'react-select';

export default function EditBillForm({id, billStatus, finalPrice, onBillAdded}) {
    const [newBillStatus, setNewBillStatus] = useState(billStatus);
    const [newFinalPrice, setNewFinalPrice] = useState(finalPrice);
    // const [isError, setIsError] = useState(false); // Track validation error

    const options = [
      { value: 'pending', label: 'pending' },
      { value: 'Paid', label: 'Paid' }
    ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!newBillStatus) {
        //   setIsError(true);
        //   return;
        // }

        try {
            const res = await fetch(`https://billing-nextjs.vercel.app/api/bill/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ billStatus: newBillStatus, finalPrice: newFinalPrice})
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
          console.log('Selected:', selectedOption)
          setNewBillStatus(selectedOption.value)
          // setIsError(false); // Reset error if value is selected
        }

    return(
     <>
     <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
            onChange={(e) => setNewFinalPrice(e.target.value)}
            value={newFinalPrice}
            className="border border-slate-500 px-8 py-2" type="number" placeholder="Final price" required />

     {/* <input
         onChange={(e) => setNewBillStatus(e.target.value)}
         value={newBillStatus}
         className="border border-slate-500 px-8 py-2" type="text" placeholder="Bill status" /> */}
         <Select
      options={options}
      onChange={Dropdown}
      value={{ value: newBillStatus, label: newBillStatus }}      
      styles={{ control: (provided) => ({ ...provided, width: 400 }),
      menu: (provided) => ({ ...provided, width: 400 })
     }}
      placeholder="Select bill status"
    />
        {/* {isError && <span style={{ color: 'red' }}>Please select a bill status</span>} */}

        <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
    Update Bill
    </button>
     </form>
     </>
    )
}