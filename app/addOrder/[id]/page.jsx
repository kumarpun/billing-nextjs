"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select';

export default function AddOrder({ params }) {
    const { id } = params;
    const [order_title, setTitle] = useState("");
    const [order_description, setDescription] = useState("");
    const [table_id, setTableId] = useState("");
    const [order_status, setOrderStatus] = useState("Order accepted");
    const [customer_status, setCustomerStatus] = useState("Customer accepted");
    const [newOrdertitle, setnewOrdertitle] = useState(order_title);
    const [order_price, setOrderPrice] = useState("");

    const options = [
        { value: 'Momo fry', label: 'Momo fry - NRs 200', price: 200 },
        { value: 'Chicken chilly', label: 'Chicken chilly - NRs 300', price: 300 }
      ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newOrdertitle || !order_status || !customer_status) {
            alert("Title is required.");
            return;
          }
      
          try {
            const res = await fetch("http://localhost:3000/api/orders", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ 
                table_id: id, 
                order_title: newOrdertitle, 
                order_description,
                order_status,
                customer_status,
                order_price
             }),
            });
      
            if (res.ok) {
              router.push(`/listOrder/${id}`);
              router.refresh();
            } else {
              throw new Error("Failed to create a topic");
            }
          } catch (error) {
            console.log(error);
          }
        };
        const Dropdown = (selectedOption) => {
            console.log('Selected:', selectedOption)
            setnewOrdertitle(selectedOption.value)
            setOrderPrice(selectedOption.price);
          }

    try {

        return (
            <>
                <div>
                    <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 w-full">
                        <Link className="text-white font-bold" href={"/"}>
                            MiZone
                        </Link>
                        <Link className="bg-white px-6 py-2 mt-3" href={`/listOrder/${id}`}>
                            Back
                        </Link>
                    </nav>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div>
                            
                            <input
                             value={id}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order id"
                                disabled
                            />
                        </div>
                        <div>
                        <Select
                        options={options}
                        onChange={Dropdown}
                        value={{ value: newOrdertitle, label: newOrdertitle }}      
                        styles={{ control: (provided) => ({ ...provided, width: 400 }),
                        menu: (provided) => ({ ...provided, width: 400 })
                        }}
                        placeholder="Select an option"
                        />
                        </div>

                        <div>
                        <input
                            value={`NRs. ${order_price}`}
                            className="border border-slate-500 px-8 py-2"
                            type="text"
                            placeholder="Order price"
                            disabled
                        />
                    </div>
                    
                        <div>
                            <input
                              onChange={(e) => setDescription(e.target.value)} 
                              value={order_description}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order description"
                            />
                        </div>
                        <div>
                        <input
                            onChange={(e) => setOrderStatus(e.target.value)} 
                             value={order_status}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order status"
                                disabled
                            />
                        </div>
                        <di>
                            <input
                            onChange={(e) => setCustomerStatus(e.target.value)} 
                             value={customer_status}
                            className="border border-slate-500 px-8 py-2"
                            type="text"
                            placeholder="Customer status"
                            disabled
                            />
                        </di>
                        <button
                            type="submit"
                            className="bg-green-600 font-bold text-white py-3 px-6 w-fit" >
                            Add Order
                        </button>
                    </form>
                </div>
            </>
        );
    } catch (error) {
        return <div>Error Adding orders. Please try again later.</div>;
    }
}

