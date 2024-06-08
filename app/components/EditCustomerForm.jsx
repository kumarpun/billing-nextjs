"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function EditCustomerForm({ id, customer_status }) {
    const [newCustomerStatus, setNewCustomerStatus] = useState(customer_status);

    const options = [
        { value: 'Bill paid', label: 'Bill paid' },
        { value: 'Customer left', label: 'Customer left' }
      ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ newCustomerStatus }),
            });
      
            if (!res.ok) {
              throw new Error("Failed to update customer status");
            }
            toast.success("Customer status updated!");

            // router.push("/");
            router.refresh();
          } catch (error) {
            console.log(error);
          }
        };

        const Dropdown = (selectedOption) => {
            console.log('Selected:', selectedOption)
            setNewCustomerStatus(selectedOption.value)
          }

    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* <input
         onChange={(e) => setNewCustomerStatus(e.target.value)}
         value={newCustomerStatus}
         className="border border-slate-500 px-8 py-2" type="text" placeholder="Customer Status" /> */}
<br/>
<Select
      options={options}
      onChange={Dropdown}
      value={{ value: newCustomerStatus, label: newCustomerStatus }}      
      styles={{ control: (provided) => ({ ...provided, width: 400 }),
      menu: (provided) => ({ ...provided, width: 400 })
     }}
      placeholder="Select an option"
    />

    <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
    Update Customer
    </button>
    </form>
    </>
    );
}