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
    const [order_quantity, setOrderQuantity] = useState(1);
    const [order_type, setOrderType] = useState("Kitchen");

    const options = [
      // bar menu
        { value: 'Jose Cuervo Tequila', label: 'Jose Cuervo Tequila - NRs 200', price: 200 },
        { value: 'Bombay Supphire', label: 'Bombay Supphire - NRs 300', price: 300 },
        { value: 'Beefeater', label: 'Beefeater - NRs 300', price: 300 },
        { value: 'Jack Daniel', label: 'Jack Daniel - NRs 300', price: 300 },
        { value: 'Jim Beam', label: 'Jim Beam - NRs 300', price: 300 },
        { value: 'Glenfidich 12 yrs', label: 'Glenfidich 12 yrs - NRs 300', price: 300 },
        { value: 'Vat 69', label: 'Vat 69 - NRs 300', price: 300 },
        { value: 'Johnny Walker Black', label: 'Johnny Walker - NRs 300', price: 300 },
        { value: 'Johnny Walker Double Black', label: 'Johnny Walker Double Black - NRs 300', price: 300 },
        { value: 'Chivas 12 yrs', label: 'Chivas 12 yrs - NRs 300', price: 300 },
        { value: 'Signature Red', label: 'Signature Red - NRs 300', price: 300 },
        { value: 'Signature Premium', label: 'Signature Premium - NRs 300', price: 300 },
        { value: 'Jameson', label: 'Jameson - NRs 300', price: 300 },
        { value: 'Smirnoff', label: 'Smirnoff - NRs 300', price: 300 },
        { value: 'Absolute', label: 'Absolute - NRs 300', price: 300 },
        { value: 'Captain Morgan Black', label: 'Captain Morgan Black - NRs 300', price: 300 },
        { value: 'Old monk', label: 'Old monk - NRs 300', price: 300 },
        { value: '8848 Vodka', label: '8848 Vodka - NRs 300', price: 300 },
        { value: 'Nude', label: 'Nude - NRs 300', price: 300 },
        { value: 'OD Regular', label: 'OD Regular - NRs 300', price: 300 },
        { value: 'OD Chimney', label: 'OD Chimney - NRs 300', price: 300 },
        { value: 'Gurkhas & Guns', label: 'Gurkhas & Guns - NRs 300', price: 300 },
        { value: 'Khukri light', label: 'Khukri light - NRs 300', price: 300 },
        { value: 'Khukri dark', label: 'Khukri dark - NRs 300', price: 300 },
        { value: 'Snowman', label: 'Snowman - NRs 300', price: 300 },
        { value: 'Silver Oak', label: 'Silver Oak - NRs 300', price: 300 },
        { value: 'Himalayan Brandy', label: 'Himalayan Brandy - NRs 300', price: 300 },
        { value: 'Golden Grape Brandy', label: 'Golden Grape Brandy - NRs 300', price: 300 },
        { value: 'Tuborg Premium', label: 'Tuborg Premium - NRs 300', price: 300 },
        { value: 'Tuborg Strong', label: 'Tuborg Strong - NRs 300', price: 300 },
        { value: 'Gurkha Premium', label: 'Gurkha Premium - NRs 300', price: 300 },
        { value: 'Budwiser', label: 'Budwiser - NRs 300', price: 300 },
        { value: 'Carlsberg', label: 'Carlsberg - NRs 300', price: 300 },
        { value: 'Corona', label: 'Corona - NRs 300', price: 300 },
        { value: 'Barashinge 350 ml', label: 'Barashinge 350 ml - NRs 300', price: 300 },
        { value: 'Barashinge 550 ml', label: 'Barashinge 550 ml - NRs 300', price: 300 },
        { value: 'Barashinge pitcher', label: 'Barashinge pitcher - NRs 300', price: 300 },
        { value: 'Calvet', label: 'Calvet - NRs 300', price: 300 },
        { value: 'JP chenet', label: 'JP chenet - NRs 300', price: 300 },
        { value: 'Prince Laurent', label: 'Prince Laurent - NRs 300', price: 300 },
        { value: 'Robertson', label: 'Robertson - NRs 300', price: 300 },
        { value: 'Jacob Creek (Chardonnay) - white', label: 'Jacob Creek (Chardonnay) - white - NRs 300', price: 300 },
        { value: 'Jacob Creek (Merlot) - red', label: 'Jacob Creek (Merlot) - red - NRs 300', price: 300 },
        { value: 'Mango juice', label: 'Mango juice - NRs 300', price: 300 },
        { value: 'Cranberry', label: 'Cranberry - NRs 300', price: 300 },
        { value: 'Orange juice', label: 'Orange juice - NRs 300', price: 300 },
        { value: 'Pineapple juice', label: 'Pineapple juice - NRs 300', price: 300 },
        { value: 'Guava juice', label: 'Guava juice - NRs 300', price: 300 },
        { value: 'Mix fruit', label: 'Mix fruit - NRs 300', price: 300 },
        { value: 'Soda', label: 'Soda - NRs 300', price: 300 },
        { value: 'Coke', label: 'Coke - NRs 300', price: 300 },
        { value: 'Fanta', label: 'Fanta - NRs 300', price: 300 },
        { value: 'Sprite', label: 'Sprite - NRs 300', price: 300 },
        { value: 'Dew', label: 'Dew - NRs 300', price: 300 },
        { value: 'Cosmopolitan', label: 'Cosmopolitan - NRs 300', price: 300 },
        { value: 'Blue Angel', label: 'Blue Angel - NRs 300', price: 300 },
        { value: 'Espresso martini', label: 'Espresso martini - NRs 300', price: 300 },
        { value: 'Whiskey sour', label: 'Whiskey sour - NRs 300', price: 300 },
        { value: 'Classic mojito', label: 'Classic mojito - NRs 300', price: 300 },
        { value: 'Virgin Mojito', label: 'Virgin Mojito - NRs 300', price: 300 },
        { value: 'Orange Mojito', label: 'Orange Mojito - NRs 300', price: 300 },
        { value: 'Blue lagoon', label: 'Blue lagoon - NRs 300', price: 300 },
        { value: 'B52', label: 'B52 - NRs 300', price: 300 },
        { value: 'Brain Damage', label: 'Brain Damage - NRs 300', price: 300 },
        { value: 'Jagerbomb', label: 'Jagerbomb - NRs 300', price: 300 },
        { value: 'Kamikaze', label: 'Kamikaze - NRs 300', price: 300 },
        { value: 'Flaming Lambo', label: 'Flaming Lambo - NRs 300', price: 300 },
        { value: 'Bailey shot', label: 'Bailey shot - NRs 300', price: 300 },
        { value: 'Triple sec shot', label: 'Triple sec shot - NRs 300', price: 300 },
        { value: 'Kahlua shot', label: 'Kahlua shot - NRs 300', price: 300 },
        { value: 'Jagermiester', label: 'Jagermiester - NRs 300', price: 300 },
        // Barista menu
        { value: 'Espresso', label: 'Espresso - NRs 300', price: 300 },
        { value: 'Espresso Machhito', label: 'Espresso Machhito - NRs 300', price: 300 },
        { value: 'Americano single', label: 'Americano single - NRs 300', price: 300 },
        { value: 'Americano double', label: 'Americano double - NRs 300', price: 300 },
        { value: 'Lungo', label: 'Lungo - NRs 300', price: 300 },
        { value: 'Doppio', label: 'Doppio - NRs 300', price: 300 },
        { value: 'Latte single', label: 'Latte single - NRs 300', price: 300 },
        { value: 'Latte double', label: 'Latte double - NRs 300', price: 300 },
        { value: 'Honey latte', label: 'Honey latte - NRs 300', price: 300 },
        { value: 'Hazelnut latte', label: 'Hazelnut latte - NRs 300', price: 300 },
        { value: 'Strawberry latte', label: 'Strawberry latte - NRs 300', price: 300 },
        { value: 'Chocolate latte', label: 'Chocolate latte - NRs 300', price: 300 },
        { value: 'Caramel latte', label: 'Caramel latte - NRs 300', price: 300 },
        { value: 'Honey cappuccino', label: 'Honey cappuccino - NRs 300', price: 300 },
        { value: 'Hazelnut cappuccino', label: 'Hazelnut cappuccino - NRs 300', price: 300 },
        { value: 'Strawberry cappuccino', label: 'Strawberry cappuccino - NRs 300', price: 300 },
        { value: 'Chocolate cappuccino', label: 'Chocolate cappuccino - NRs 300', price: 300 },
        { value: 'Caramel cappuccino', label: 'Caramel cappuccino - NRs 300', price: 300 },
        { value: 'Hot chocolate', label: 'Hot chocolate - NRs 300', price: 300 },
        { value: 'Flavoured streamed milk', label: 'Flavoured streamed milk - NRs 300', price: 300 },
        { value: 'Hot lemon with honey', label: 'Hot lemon with honey - NRs 300', price: 300 },
        { value: 'Hot lemon with honey and ginger', label: 'Hot lemon with honey and ginger - NRs 300', price: 300 },
        { value: 'Milk tea', label: 'Milk tea - NRs 300', price: 300 },
        { value: 'Black tea', label: 'Black tea - NRs 300', price: 300 },
        { value: 'Green tea', label: 'Green tea - NRs 300', price: 300 },
        { value: 'Lemon tea', label: 'Lemon tea - NRs 300', price: 300 },
        { value: 'Iced Americano', label: 'Iced Americano - NRs 300', price: 300 },
        { value: 'Iced latte', label: 'Iced latte - NRs 300', price: 300 },
        { value: 'Iced Mocha', label: 'Iced Mocha - NRs 300', price: 300 },
        { value: 'Peach Iced Tea', label: 'Peach Iced Tea - NRs 300', price: 300 },
        { value: 'Lemon Iced Tea', label: 'Lemon Iced Tea - NRs 300', price: 300 },
        { value: 'Iced Caramel Machhiato', label: 'Iced Caramel Machhiato - NRs 300', price: 300 },
        { value: 'Iced Mocha Madness', label: 'Iced Mocha Madness - NRs 300', price: 300 },
        { value: 'Iced blended Mocha', label: 'Iced blended Mocha - NRs 300', price: 300 },
        { value: 'Mint lemonade', label: 'Mint lemonade - NRs 300', price: 300 },
        { value: 'Mint Mojito', label: 'Mint Mojito - NRs 300', price: 300 },
        { value: 'Chocolate Shake', label: 'Chocolate Shake - NRs 300', price: 300 },
        { value: 'Strawberry Shake', label: 'Strawberry Shake - NRs 300', price: 300 },
        { value: 'Vanilla Shake', label: 'Vanilla Shake - NRs 300', price: 300 },
        { value: 'Caramel Shake', label: 'Caramel Shake - NRs 300', price: 300 },
        { value: 'Butterscotch Shake', label: 'Butterscotch Shake - NRs 300', price: 300 },
        { value: 'Oreo milkshake', label: 'Oreo milkshake - NRs 300', price: 300 },
        { value: 'Kitkat milkshake', label: 'Kitkat milkshake - NRs 300', price: 300 },
        { value: 'Kiwi smoothies', label: 'Kiwi smoothies - NRs 300', price: 300 },
        { value: 'Mango smoothies', label: 'Mango smoothies - NRs 300', price: 300 },
        { value: 'Watermelon smoothies', label: 'Watermelon smoothies - NRs 300', price: 300 },
        { value: 'Strawberry smoothies', label: 'Strawberry smoothies - NRs 300', price: 300 },
        { value: 'Apple smoothies', label: 'Apple smoothies - NRs 300', price: 300 },
        { value: 'Plain lassi', label: 'Plain lassi - NRs 300', price: 300 },
        { value: 'Sweet lassi', label: 'Sweet lassi - NRs 300', price: 300 },
        { value: 'Vannilla lassi', label: 'Vannilla lassi - NRs 300', price: 300 },
        { value: 'Kamikaze', label: 'Kamikaze - NRs 300', price: 300 },
        { value: 'Mint lassi', label: 'Mint lassi - NRs 300', price: 300 },
        { value: 'Caramel lassi', label: 'Caramel lassi - NRs 300', price: 300 },
        { value: 'Banana lassi', label: 'Banana lassi - NRs 300', price: 300 },
        { value: 'Apple lassi', label: 'Apple lassi - NRs 300', price: 300 },
        { value: 'Mango lassi', label: 'Mango lassi - NRs 300', price: 300 },
        { value: 'Mix Fruit lassi', label: 'Mix Fruit lassi - NRs 300', price: 300 },
      ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newOrdertitle || !order_status || !customer_status) {
            alert("Title is required.");
            return;
          }
      
          try {
            const res = await fetch("https://billing-nextjs.vercel.app/api/orders", {
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
                order_price,
                order_quantity,
                order_type
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
                    <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 w-full navbar nav-color">
                    <div style={{ flex: 0 }}></div>
                    <Link className="page-title font-bold" href={"/"}>
                        {Array.from("HYBE Food & Drinks").map((char, index) => (
            <span key={index} className={`char-${index}`}>{char}</span>
           ))}
                        </Link>
                        <Link className="add-table px-6 py-2 mt-3" href={`/listOrder/${id}`}>
                            Back
                        </Link>
                    </nav>
                    <hr className="separator" />
                    <br/>
                    <div className="bg-page">
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
                              onChange={(e) => setOrderQuantity(e.target.value)} 
                              value={order_quantity}
                                className="border border-slate-500 px-8 py-2"
                                type="number"
                                placeholder="Order quantity"
                            />
                        </div>

                        <div>
                        <select
                            className="border border-slate-500 px-8 py-2"
                            value={order_type}
                            onChange={(e) => setOrderType(e.target.value)}
                        >
                            <option value="Kitchen">Kitchen</option>
                            <option value="Bar">Bar</option>
                        </select>
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
                </div>
            </>
        );
    } catch (error) {
        return <div>Error Adding orders. Please try again later.</div>;
    }
}

