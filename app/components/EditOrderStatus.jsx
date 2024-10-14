"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Select from 'react-select';

export default function EditOrderStatus({ id, order_title, order_description, order_status }) {
    const [newOrderTitle, setNewOrderTitle] = useState(order_title);
    const [newOrderDescription, setNewOrderDescription] = useState(order_description);
    const [newOrderStatus, setNewOrderStatus] = useState(order_status);
    const [newOrderQuantity, setNewOrderQuantity] = useState("");

    const options = [
      { value: 'Order accepted', label: 'Order accepted' },
      { value: 'Order cooking', label: 'Order cooking' },
      { value: 'Order delivered', label: 'Order delivered' },
    ];

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
      // Get the 'order_quantity' from query parameters
      const orderQuantity = searchParams.get('order_quantity');
      if (orderQuantity) {
          setNewOrderQuantity(orderQuantity);
      }
  }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`https://billing-nextjs.vercel.app/api/orders/${id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ newOrderTitle, newOrderDescription, newOrderStatus, newOrderQuantity }),
            });
      
            if (!res.ok) {
              throw new Error("Failed to update order status");
            }
            
            // Show toast message on successful update
            toast.success("Order status updated!");

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    const handleBack = () => {
        router.back(); // Go back one step in browser history
    };

      const Dropdown = (selectedOption) => {
        console.log('Selected:', selectedOption)
        setNewOrderStatus(selectedOption.value)
      }
    
    return (
        <>
            <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
            <div style={{ flex: 0 }}></div>
            <Link className="page-title font-bold" href={"/"}>
            {Array.from("HYBE Food & Drinks").map((char, index) => (
            <span key={index} className={`char-${index}`}>{char}</span>
           ))}                
                </Link>
                <Link href="#" onClick={handleBack} className="bg-white px-6 py-2 mt-3 add-table">
                    Back
                </Link>
            </nav>
            <hr className="separator" />
                    <br/>
                    <div className="bg-page">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* <input
                    onChange={(e) => setNewOrderDescription(e.target.value)}
                    value={newOrderDescription}
                    className="border border-slate-500 px-8 py-2" type="text" placeholder="Order description" /> */}

<div className="flex items-center">
  <label className="mr-4 w-32 order-label">Quantity:</label>
  <input
         onChange={(e) => setNewOrderQuantity(e.target.value)}
         value={newOrderQuantity}
         className="border border-slate-500 px-8 py-2" type="number" placeholder="Order Quantity" />
</div>

<div className="flex items-center">
<label className="mr-4 w-32 order-label">Order Status:</label>
<Select
      options={options}
      onChange={Dropdown}
      value={{ value: newOrderStatus, label: newOrderStatus }}      
      styles={{ control: (provided) => ({ ...provided, width: 400 }),
      menu: (provided) => ({ ...provided, width: 400 })
     }}
      placeholder="Select an option"
    />
    </div>

                <div>
                    <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
                        Update Order
                    </button>
                </div>
            </form>
          </div>
        </>
    )
}
