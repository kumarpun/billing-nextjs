"use client";

import Link from "next/link";
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
    const [selectedItems, setSelectedItems] = useState([]); // Changed from single item to array
    // const [order_type, setOrderType] = useState("Kitchen");
    const [order_type, setOrderType] = useState(""); // Initially empty
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const options = [
      // kitchen menu
      { value: 'Kitchen menu', label: 'Kitchen menu', price: 0 },
      
     { value: 'Water', label: 'Water - NRs 50', price: 50, order_type: "Bar" },
     // veg starter

     { value: 'Dynamite Fries - veg', label: 'Dynamite Fries veg - NRs 290', price: 290, order_type: "Kitchen" },
     { value: 'Veg Crispy', label: 'Veg Crispy - NRs 250', price: 250, order_type: "Kitchen" },
     { value: 'Chilly Paneer', label: 'Chilly Paneer - NRs 440', price: 440, order_type: "Kitchen" },
     { value: 'Corn salt & Pepper', label: 'Corn salt & Pepper - NRs 280', price: 280, order_type: "Kitchen" },
     { value: 'Aloo Papdi Chat', label: 'Aloo Papdi Chat - NRs 240', price: 240, order_type: "Kitchen" },
     { value: 'French Fries', label: 'French Fries - NRs 110', price: 110, order_type: "Kitchen" },
     { value: 'Veg Bullet', label: 'Veg Bullet - NRs 180', price: 180, order_type: "Kitchen" },
     { value: 'Cheese Ball', label: 'Cheese Ball - NRs 350', price: 350, order_type: "Kitchen" },
     { value: 'Chilly Mushroom', label: 'Chilly Mushroom - NRs 350', price: 350, order_type: "Kitchen" },
     { value: 'Afgani Fries', label: 'Afgani Fries - NRs 200', price: 200, order_type: "Kitchen" },
     { value: 'Boiled Vegetables', label: 'Boiled Vegetables - NRs 180', price: 180, order_type: "Kitchen" },
     { value: 'Mushroom Steak', label: 'Mushroom Steak - NRs 350', price: 350, order_type: "Kitchen" },
     { value: 'Paneer Steak', label: 'Paneer Steak - NRs 410', price: 410, order_type: "Kitchen"},
     { value: 'Potato Twister', label: 'Potato Twister - NRs 150', price: 150, order_type: "Kitchen" },
     { value: 'crispy corn', label: 'crispy corn  - NRs 350', price: 350, order_type: "Kitchen" },

     // NEPALI CUISINE
     { value: 'Chicken Choila', label: 'Chicken Choila - NRs 350', price: 350, order_type: "Kitchen" },
     { value: 'Chicken Tass', label: 'Chicken Tass - NRs 400', price: 400, order_type: "kitchen" },
     { value: 'Chicken Sadheko Fry/Boill', label: 'Chicken Sadheko Fry/Boill - NRs 290', price: 290, order_type: "Kitchen" },
     { value: 'Chicken Roast', label: 'Chicken Roast - NRs 400', price: 400, order_type: "Kitchen" },
     { value: 'Peanut Sadheko', label: 'Peanut Sadheko - NRs 200', price: 200, order_type: "Kitchen" },
     { value: 'Wai Wai Sadheko', label: 'Wai Wai Sadheko - NRs 160', price: 160, order_type: "Kitchen" },
     { value: 'Chicken Sutuki', label: 'Chicken Sutuki - NRs 370', price: 370, order_type: "Kitchen" },
     { value: 'Buff Sukuti', label: 'Buff Sukuti - NRs 350', price: 350, order_type: "Kitchen" },
     { value: 'Buff Choila', label: 'Buff Choila - NRs 400', price: 400, order_type: "Kitchen" },
     { value: 'Chicken Chatpate', label: 'Chicken Chatpate - NRs 300', price: 300, order_type: "Kitchen" },
     { value: 'Sukuti Chatpate Buff', label: 'Sukuti Chatpate Buff - NRs 320', price: 320, order_type: "Kitchen" },
     { value: 'Timur Chicken', label: 'Timur Chicken - NRs 350', price: 350, order_type: "Kitchen" },
   
     // NON-VEG STARTER
     { value: 'Dynamite Fries non veg', label: 'Dynamite Fries non veg - NRs 260', price: 260, order_type: "Kitchen" },
     { value: 'Chicken Chilly', label: 'Chicken Chilly - NRs 410', price: 410, order_type: "Kitchen" },
     { value: 'Hot Wings', label: 'Hot Wings - NRs 440', price: 440, order_type: "Kitchen" },
     { value: 'Kungpao Chicken', label: 'Kungpao Chicken - NRs 440', price: 440, order_type: "Kitchen" },
     { value: 'Pepper Chicken', label: 'Pepper Chicken - NRs 330', price: 330, order_type: "Kitchen" },
     { value: 'Chicken 65', label: 'Chicken 65 - NRs 450', price: 450, order_type: "Kitchen" },
     { value: 'Hunan Chicken', label: 'Hunan Chicken - NRs 470', price: 470, order_type: "Kitchen" },
     { value: 'Finger Chicken', label: 'Finger Chicken - NRs 390', price: 390, order_type: "Kitchen" },
     { value: 'Chicken Steak', label: 'Chicken Steak - NRs 450', price: 450, order_type: "Kitchen" },
     { value: 'Chicken Crispy', label: 'Chicken Crispy - NRs 400', price: 400, order_type: "Kitchen" },
     { value: 'Periperi Chicken', label: 'Periperi Chicken - NRs 400', price: 400, order_type: "Kitchen" },
     { value: 'Dragon Chicken', label: 'Dragon Chicken - NRs 350', price: 350, order_type: "Kitchen" },
     { value: 'Drumstick Chicken', label: 'Drumstick Chicken - NRs 390', price: 390, order_type: "Kitchen" },
     { value: 'Buffalo Wild Wings', label: 'Buffalo Wild Wings - NRs 450', price: 450, order_type: "Kitchen" },
     { value: 'Szechuan Chicken', label: 'Szechuan Chicken - NRs 320', price: 320, order_type: "Kitchen" },
     { value: 'Chilly Sausage', label: 'Chilly Sausage - NRs 290', price: 290, order_type: "Kitchen" },
     { value: 'Crown Chicken', label: 'Crown Chicken - NRs 490', price: 490, order_type: "Kitchen" },
     { value: 'Boiled Sausage', label: 'Boiled Sausage - NRs 290', price: 290, order_type: "Kitchen" },
     { value: 'Extra cheese', label: 'Extra cheese - NRs 70', price: 70, order_type: "Kitchen" },
     { value: 'Chicken Crispy (chef style)', label: 'Chicken Crispy (chef style) - NRs 450', price: 450, order_type: "Kitchen" },
     { value: 'Chicken momo platter', label: 'Chicken momo platter - NRs 520', price: 520, order_type: "Kitchen" },
     { value: 'Sausage fry', label: 'Sausage fry - NRs 240', price: 240, order_type: "Kitchen" },


       // SALAD
       { value: 'Green Salad', label: 'Green Salad - NRs 200', price: 200, order_type: "Kitchen" },
       { value: 'Fruit Salad', label: 'Fruit Salad - NRs 420', price: 420, order_type: "Kitchen" },
       { value: 'Russian Salad', label: 'Russian Salad - NRs 290', price: 290, order_type: "Kitchen" },
       { value: 'Eggmayo Salad', label: 'Eggmayo Salad - NRs 350', price: 350, order_type: "Kitchen" },
       { value: 'Nepali Salad', label: 'Nepali Salad - NRs 170', price: 170, order_type: "Kitchen" },
       { value: 'Classic Salad', label: 'Classic Salad - NRs 350', price: 350, order_type: "Kitchen" },
       { value: 'Classic Salad - boiled chicken', label: 'Classic Salad boiled chicken - NRs 450', price: 450, order_type: "Kitchen" },

       { value: 'Boiled vegetable with chicken', label: 'Boiled vegetable with chicken - NRs 350', price: 350, order_type: "Kitchen" },

       { value: 'Chessy crunchu chips', label: 'Chessy crunchu chips - NRs 150', price: 150, order_type: "Kitchen" },


       // SOUP
       { value: 'Manchow Soup (Veg)', label: 'Manchow Soup (Veg) - NRs 190', price: 190, order_type: "Kitchen" },
       { value: 'Manchow Soup (Non-Veg)', label: 'Manchow Soup (Non-Veg) - NRs 260', price: 260, order_type: "Kitchen" },
       { value: 'Hot & Sour Soup (Veg)', label: 'Hot & Sour Soup (Veg) - NRs 180', price: 180, order_type: "Kitchen" },
       { value: 'Hot & Sour Soup (Non-Veg)', label: 'Hot & Sour Soup (Non-Veg) - NRs 240', price: 240, order_type: "Kitchen" },
       { value: 'Clear Soup (Veg)', label: 'Clear Soup (Veg) - NRs 160', price: 160, order_type: "Kitchen" },
       { value: 'Clear Soup (Non-Veg)', label: 'Clear Soup (Non-Veg) - NRs 200', price: 200, order_type: "Kitchen" },
       { value: 'leamon coriander veg', label: 'leamon coriander veg - NRs 190', price: 190, order_type: "Kitchen" },
       { value: 'leamon coriander (Non-veg)', label: 'leamon coriander (Non-veg) - NRs 260', price: 260, order_type: "Kitchen" },
       { value: 'Mushroom Soup', label: 'Mushroom Soup - NRs 120', price: 120 },

       // INDIAN CUISINE
       { value: 'Chicken Curry', label: 'Chicken Curry - NRs 380', price: 380, order_type: "Kitchen" },

       // LAPHING
       { value: 'Plain Laphing', label: 'Plain Laphing - NRs 120', price: 120, order_type: "Kitchen" },
       { value: 'Chicken Laphing', label: 'Chicken Laphing - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Soupy Chauchau Laphing', label: 'Soupy Chauchau Laphing - NRs 130', price: 130, order_type: "Kitchen" },
       { value: 'Chauchau Laphing', label: 'Chauchau Laphing - NRs 130', price: 130, order_type: "Kitchen" },
       { value: 'Soupy Peanuts Laphing', label: 'Soupy Peanuts Laphing - NRs 160', price: 160, order_type: "Kitchen" },
       { value: 'Soupy Plain Laphing', label: 'Soupy Plain Laphing - NRs 120', price: 120, order_type: "Kitchen" },

       { value: 'Sizzler veg', label: 'Sizzler veg - NRs 560', price: 560, order_type: "Kitchen" },
       { value: 'Sizzler non-veg', label: 'Sizzler non-veg - NRs 690', price: 690, order_type: "Kitchen" },
       { value: 'Hybe special', label: 'Hybe special - NRs 1200', price: 1200, order_type: "Kitchen" },
       { value: 'Chinese Platter', label: 'Chinese Platter - NRs 1250', price: 1250, order_type: "Kitchen" },
       { value: 'Potato Special', label: 'Potato Special - NRs 500', price: 500, order_type: "Kitchen" },

       // BREAD
       { value: 'Crunchy Bread', label: 'Crunchy Bread - NRs 230', price: 230, order_type: "Kitchen" },
       { value: 'Garlic Bread', label: 'Garlic Bread - NRs 230', price: 230, order_type: "Kitchen" },
       { value: 'Cheese Bread', label: 'Cheese Bread - NRs 230', price: 230, order_type: "Kitchen" },
       { value: 'Bread Omelette', label: 'Bread Omelette - NRs 210', price: 210, order_type: "Kitchen" },
       { value: 'Veg Sandwich', label: 'Veg Sandwich - NRs 270', price: 270, order_type: "Kitchen" },
       { value: 'Non-Veg Sandwich', label: 'Non-Veg Sandwich - NRs 320', price: 320, order_type: "Kitchen" },
       { value: 'Grilled Veg Sandwich', label: 'Grilled Veg Sandwich - NRs 280', price: 280, order_type: "Kitchen" },
       { value: 'Grilled Non-Veg Sandwich', label: 'Grilled Non-Veg Sandwich - NRs 340', price: 340, order_type: "Kitchen" },
       { value: 'Club Sandwich', label: 'Club Sandwich - NRs 400', price: 400, order_type: "Kitchen" },
     
       // MO:MO
       { value: 'Steam Veg momo', label: 'Steam Veg momo - NRs 135', price: 135, order_type: "Kitchen" },
       { value: 'Steam Chicken momo', label: 'Steam Chicken momo - NRs 200', price: 200, order_type: "Kitchen"},
       { value: 'Steam Buff momo', label: 'Steam Buff momo - NRs 220', price: 220, order_type: "Kitchen" },
    //    { value: 'Steam Veg MO:MO', label: 'Steam Veg MO:MO - NRs 135', price: 135 },
    //    { value: 'Steam Chicken MO:MO', label: 'Steam Chicken MO:MO - NRs 200', price: 200 },
    //    { value: 'Steam Buff MO:MO', label: 'Steam Buff MO:MO - NRs 220', price: 220 },
       { value: 'Chilly Veg MO:MO', label: 'Chilly Veg MO:MO - NRs 210', price: 210, order_type: "Kitchen" },
       { value: 'Chilly Chicken MO:MO', label: 'Chilly Chicken MO:MO - NRs 260', price: 260, order_type: "Kitchen" },
       { value: 'Chilly Buff MO:MO', label: 'Chilly Buff MO:MO - NRs 280', price: 280 , order_type: "Kitchen"},
       { value: 'Afghani Veg MO:MO', label: 'Afghani Veg MO:MO - NRs 240', price: 240, order_type: "Kitchen" },
       { value: 'Afghani Chicken MO:MO', label: 'Afghani Chicken MO:MO - NRs 340', price: 340, order_type: "Kitchen" },
       { value: 'Afghani Buff MO:MO', label: 'Afghani Buff MO:MO - NRs 360', price: 360, order_type: "Kitchen" },
       { value: 'Crunchy Veg MO:MO', label: 'Crunchy Veg MO:MO - NRs 230', price: 230, order_type: "Kitchen" },
       { value: 'Crunchy Chicken MO:MO', label: 'Crunchy Chicken MO:MO - NRs 290', price: 290, order_type: "Kitchen" },
       { value: 'Crunchy Buff MO:MO', label: 'Crunchy Buff MO:MO - NRs 320', price: 320, order_type: "Kitchen" },
       { value: 'Fried Veg MO:MO', label: 'Fried Veg MO:MO - NRs 180', price: 180, order_type: "Kitchen" },
       { value: 'Fried Chicken MO:MO', label: 'Fried Chicken MO:MO - NRs 240', price: 240, order_type: "Kitchen" },
       { value: 'Fried Buff MO:MO', label: 'Fried Buff MO:MO - NRs 260', price: 260, order_type: "Kitchen" },
       { value: 'Jhol Veg MO:MO', label: 'Jhol Veg MO:MO - NRs 220', price: 220, order_type: "Kitchen" },
       { value: 'Jhol Chicken MO:MO', label: 'Jhol Chicken MO:MO - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Jhol Buff MO:MO', label: 'Jhol Buff MO:MO - NRs 280', price: 280, order_type: "Kitchen" },
       { value: 'Kothe Veg MO:MO', label: 'Kothe Veg MO:MO - NRs 200', price: 200, order_type: "Kitchen"},
       { value: 'Kothe Chicken MO:MO', label: 'Kothe Chicken MO:MO - NRs 250', price: 250, order_type: "Kitchen"},
       { value: 'Kothe Buff MO:MO', label: 'Kothe Buff MO:MO - NRs 280', price: 280, order_type: "Kitchen"},
       { value: 'Sadheko Veg MO:MO', label: 'Sadheko Veg MO:MO - NRs 210', price: 210, order_type: "Kitchen"},
       { value: 'Sadheko Chicken MO:MO', label: 'Sadheko Chicken MO:MO - NRs 280', price: 280, order_type: "Kitchen" },
       { value: 'Sadheko Buff MO:MO', label: 'Sadheko Buff MO:MO - NRs 300', price: 300, order_type: "Kitchen" },
     
       // PASTA
       { value: 'Veg Pasta (White)', label: 'Veg Pasta (White) - NRs 300', price: 300, order_type: "Kitchen" },
       { value: 'Veg Pasta (Red)', label: 'Veg Pasta (Red) - NRs 300', price: 300, order_type: "Kitchen"},
       { value: 'Veg Pasta (Mixed)', label: 'Veg Pasta (Mixed) - NRs 300', price: 300, order_type: "Kitchen" },

       { value: 'Non-Veg Pasta (White)', label: 'Non-Veg Pasta (White) - NRs 390', price: 390, order_type: "Kitchen" },
       { value: 'Non-Veg Pasta (Red)', label: 'Non-Veg Pasta (Red) - NRs 390', price: 390, order_type: "Kitchen" },
       { value: 'Non-Veg Pasta (Mixed)', label: 'Non-Veg Pasta (Mixed) - NRs 390', price: 390 , order_type: "Kitchen"},
       { value: 'Aglio e Olio Veg', label: 'Aglio e Olio Veg - NRs 290', price: 290, order_type: "Kitchen" },
       { value: 'Aglio e Olio Non-Veg', label: 'Aglio e Olio Non-Veg - NRs 330', price: 400, order_type: "Kitchen" },
     
       // BURGER
       { value: 'Veg Burger', label: 'Veg Burger - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Non-Veg Burger', label: 'Non-Veg Burger - NRs 400', price: 400, order_type: "Kitchen" },
       { value: 'Extra Cheese Veg Burger', label: 'Extra Cheese Veg Burger - NRs 310', price: 310 , order_type: "Kitchen"},
       { value: 'Extra Cheese Non-Veg Burger', label: 'Extra Cheese Non-Veg Burger - NRs 460', price: 460, order_type: "Kitchen" },
       { value: 'Cottage Cheese Burger', label: 'Cottage Cheese Burger - NRs 350', price: 350, order_type: "Kitchen" },
     
       // PIZZA
       { value: 'Margherita Pizza', label: 'Margherita Pizza - NRs 480', price: 480, order_type: "Kitchen" },
       { value: 'Farm House Pizza', label: 'Farm House Pizza - NRs 450', price: 450, order_type: "Kitchen" },
       { value: 'Chicken Pizza', label: 'Chicken Pizza - NRs 500', price: 500, order_type: "Kitchen" },
       { value: 'Mushroom Pizza', label: 'Mushroom Pizza - NRs 480', price: 480, order_type: "Kitchen" },
       { value: 'Sweet Corn Pizza', label: 'Sweet Corn Pizza - NRs 450', price: 450 , order_type: "Kitchen"},
       { value: 'Mix chicken pizza', label: 'Mix chicken Pizza - NRs 550', price: 550 , order_type: "Kitchen"},
     
       // RICE
       { value: 'Fried Rice (Veg)', label: 'Fried Rice (Veg) - NRs 180', price: 180, order_type: "Kitchen" },
       { value: 'Fried Rice (Chicken)', label: 'Fried Rice (Chicken) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Fried Rice (Buff)', label: 'Fried Rice (Buff) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Fried Rice (Mixed)', label: 'Fried Rice (Mixed) - NRs 320', price: 320, order_type: "Kitchen" },

       { value: 'Burnt Garlic pot rice (Veg)', label: 'Burnt Garlic pot rice (Veg) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Burnt Garlic pot rice (Chicken)', label: 'Burnt Garlic pot rice (Chicken) - NRs 350', price: 350, order_type: "Kitchen" },
       { value: 'Pulao (Muttor)', label: 'Pulao (Muttor) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Pulao (Kashmiri)', label: 'Pulao (Kashmiri) - NRs 300', price: 300 , order_type: "Kitchen"},
       { value: 'Jeera Rice', label: 'Jeera Rice - NRs 190', price: 190, order_type: "Kitchen" },
       { value: 'Veg Biryani', label: 'Veg Biryani - NRs 410', price: 410, order_type: "Kitchen" },
       { value: 'Non-Veg Biryani', label: 'Non-Veg Biryani - NRs 530', price: 530 , order_type: "Kitchen"},
     
       // NOODLES
       { value: 'Keema Noodles', label: 'Keema Noodles - NRs 390', price: 390, order_type: "Kitchen" },
       { value: 'Hakka Noodles (Veg)', label: 'Hakka Noodles (Veg) - NRs 190', price: 190, order_type: "Kitchen" },
       { value: 'Hakka Noodles (Chicken)', label: 'Hakka Noodles (Chicken) - NRs 230', price: 230, order_type: "Kitchen" },
       { value: 'Hakka Noodles (Buff)', label: 'Hakka Noodles (Buff) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Szechwan Noodles (Veg)', label: 'Szechwan Noodles (Veg) - NRs 210', price: 210, order_type: "Kitchen" },
       { value: 'Szechwan Noodles (Chicken)', label: 'Szechwan Noodles (Chicken) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Szechwan Noodles (Buff)', label: 'Szechwan Noodles (Buff) - NRs 270', price: 270, order_type: "Kitchen" },
       { value: 'Mixed Noodles', label: 'Mixed Noodles - NRs 350', price: 350, order_type: "Kitchen" },
       { value: 'Thukpa (Veg)', label: 'Thukpa (Veg) - NRs 220', price: 220, order_type: "Kitchen" },
       { value: 'Thukpa (Chicken)', label: 'Thukpa (Chicken) - NRs 290', price: 290, order_type: "Kitchen" },
       { value: 'Thukpa (Buff)', label: 'Thukpa (Buff) - NRs 320', price: 320, order_type: "Kitchen" },
       { value: 'pan fried noodles (Non Veg)', label: 'Pan fried noodles (Non Veg) - NRs 330', price: 330, order_type: "Kitchen" },
       { value: 'Pan Fried noodles (veg))', label: 'Pan fried noodles (veg) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'burnt garlic pot noodles(Non Veg)', label: 'Burnt garlic pot noodles (Non Veg) - NRs 350', price: 350, order_type: "Kitchen" },
       { value: 'burnt garlic pot noodles(Veg)', label: 'Burnt garlic pot noodles (Veg) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Hakka Noodles half (Veg)', label: 'Hakka Noodles half (Veg) - NRs 100', price: 100, order_type: "Kitchen" },
       { value: 'Hakka Noodles half (Chicken)', label: 'Hakka Noodles half(Chicken) - NRs 120', price: 120, order_type: "Kitchen" },
       { value: 'Hakka Noodles half (Buff)', label: 'Hakka Noodles half (Buff) - NRs 140', price: 140, order_type: "Kitchen" },

       // ROLL
       { value: 'Chicken wrap', label: 'Chicken wrap - NRs 395', price: 395, order_type: "Kitchen" },
       { value: 'Kathi Roll (Veg)', label: 'Kathi Roll (Veg) - NRs 240', price: 240, order_type: "Kitchen" },
       { value: 'Kathi Roll (Egg)', label: 'Kathi Roll (Egg) - NRs 300', price: 300, order_type: "Kitchen" },
       { value: 'Kathi Roll (Chicken)', label: 'Kathi Roll (Chicken) - NRs 370', price: 370, order_type: "Kitchen" },
       { value: 'Kathi Roll (Paneer)', label: 'Kathi Roll (Paneer) - NRs 410', price: 410, order_type: "Kitchen" },
       { value: 'Cheese Roll (Veg)', label: 'Cheese Roll (Veg) - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Cheese Roll (Chicken)', label: 'Cheese Roll (Chicken) - NRs 410', price: 410, order_type: "Kitchen" },
       { value: 'Cheese Roll (Paneer)', label: 'Cheese Roll (Paneer) - NRs 450', price: 450, order_type: "Kitchen" },
       
       { value: 'Jackson chicken', label: 'Jackson chicken - NRs 520', price: 520, order_type: "Kitchen" },
       
       { value: 'Chicken mocha', label: 'Chicken mocha - NRs 230', price: 230, order_type: "Kitchen" },
       { value: 'Buff mocha', label: 'Buff mocha - NRs 250', price: 250, order_type: "Kitchen" },

       { value: 'Mix veg puree soup', label: 'Mix veg puree soup - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Mix veg puree soup', label: 'Mix veg puree soup - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Cream of mushroom soup', label: 'Cream of mushroom soup - NRs 250', price: 250, order_type: "Kitchen" },
       { value: 'Saute vegetable', label: 'Saute vegetable - NRs 180', price: 180, order_type: "Kitchen" },
       { value: 'Saute boil mix', label: 'Saute boil mix - NRs 440', price: 440, order_type: "Kitchen" },
       
       { value: 'Pahadi chicken', label: 'Pahadi chicken - NRs 390', price: 390, order_type: "Kitchen" },
       { value: 'Drums of heaven', label: 'Drums of heaven - NRs 420', price: 420, order_type: "Kitchen" },

       
       { value: 'Takeway cup', label: 'Takeway cup - NRs 25', price: 25, order_type: "Bar" },
{ value: 'Peanut', label: 'Peanut - NRs 80', price: 80, order_type: "Bar" },
{ value: 'Honey', label: 'Honey - NRs 50', price: 50, order_type: "Bar" },
{ value: 'Egg', label: 'Egg - NRs 60', price: 60, order_type: "Bar" },
{ value: 'Pastry', label: 'Pastry - NRs 300', price: 300, order_type: "Bar" },
{ value: 'Mud cake', label: 'Mud cake - NRs 280', price: 280, order_type: "Bar" },
{ value: 'Bar menu', label: 'Bar menu', price: 0, order_type: "Bar" },
{ value: 'Lemon water', label: 'Lemon water - NRs 60', price: 60, order_type: "Bar" },
{ value: 'Pineapple Juice - Glass', label: 'Pineapple Juice - Glass - NRs 160', price: 160, order_type: "Bar" },
{ value: 'Pineapple Juice - Bottle', label: 'Pineapple Juice - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Orange Juice - Glass', label: 'Orange Juice - Glass - NRs 160', price: 160, order_type: "Bar" },
{ value: 'Orange Juice - Bottle', label: 'Orange Juice - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Mango Juice - Glass', label: 'Mango Juice - Glass - NRs 160', price: 160, order_type: "Bar" },
{ value: 'Mango Juice - Bottle', label: 'Mango Juice - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Cranberry Juice - Glass', label: 'Cranberry Juice - Glass - NRs 160', price: 160, order_type: "Bar" },
{ value: 'Cranberry Juice - Bottle', label: 'Cranberry Juice - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Mix Fruit Juice - Glass', label: 'Mix Fruit Juice - Glass - NRs 160', price: 160, order_type: "Bar" },
{ value: 'Mix Fruit Juice - Bottle', label: 'Mix Fruit Juice - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Coke - Glass', label: 'Coke - Glass - NRs 110', price: 110, order_type: "Bar" },
{ value: 'Coke - Bottle', label: 'Coke - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Coke - Bottle 1.5L', label: 'Coke - Bottle 1.5L - NRs 350', price: 350, order_type: "Bar" },

{ value: 'Fanta - Glass', label: 'Fanta - Glass - NRs 110', price: 110, order_type: "Bar" },
{ value: 'Fanta - Bottle', label: 'Fanta - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Sprite - Glass', label: 'Sprite - Glass - NRs 110', price: 110, order_type: "Bar" },
{ value: 'Sprite - Bottle', label: 'Sprite - Bottle - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Lemon Sprite', label: 'Lemon Sprite - NRs 130', price: 130, order_type: "Bar" },
{ value: 'Gorkha Strong', label: 'Gorkha Strong - NRs 520', price: 520, order_type: "Bar" },
{ value: 'Gorkha Strong (Prime)', label: 'Gorkha Strong (Prime) - NRs 290', price: 290, order_type: "Bar" },
{ value: 'Gorkha Premium', label: 'Gorkha Premium - NRs 600', price: 600, order_type: "Bar" },
{ value: 'Tuborg Strong', label: 'Tuborg Strong - NRs 550', price: 550, order_type: "Bar" },
{ value: 'Tuborg Gold', label: 'Tuborg Gold - NRs 650', price: 650, order_type: "Bar" },
{ value: 'Barahsinghe', label: 'Barahsinghe - Nrs 630', price: 630, order_type: "Bar" },
{ value: 'Carlsberg', label: 'Carlsberg - Nrs 690', price: 690, order_type: "Bar" },
{ value: '8848 - 30ml', label: '8848 Vodka - 30ml - NRs 190', price: 190, order_type: "Bar" },
{ value: '8848 - 60ml', label: '8848 Vodka - 60ml - NRs 360', price: 360, order_type: "Bar" },
{ value: '8848 - 90ml', label: '8848 Vodka - 90ml - NRs 520', price: 520, order_type: "Bar" },
{ value: '8848 - 180ml', label: '8848 Vodka - 180ml - NRs 920', price: 920, order_type: "Bar" },
{ value: '8848 - 750ml Bottle', label: '8848 Vodka - Bottle - NRs 3600', price: 3600, order_type: "Bar" },
{ value: 'Nude - 30ml', label: 'Nude Vodka - 30ml - NRs 390', price: 390, order_type: "Bar" },
{ value: 'Nude - 60ml', label: 'Nude Vodka - 60ml - NRs 390', price: 390, order_type: "Bar" },
{ value: 'Nude - 90ml', label: 'Nude Vodka - 90ml - NRs 390', price: 390, order_type: "Bar" },
{ value: 'Nude - 180ml', label: 'Nude Vodka - 180ml - NRs 990', price: 990, order_type: "Bar" },
{ value: 'Nude - 750ml Bottle', label: 'Nude Vodka - Bottle - NRs 3700', price: 3700, order_type: "Bar" },
{ value: 'Absolute - 60ml', label: 'Absolute Vodka - 60ml - NRs 820', price: 820, order_type: "Bar" },
{ value: 'Absolute - 180ml', label: 'Absolute Vodka - 180ml - NRs 2100', price: 2100, order_type: "Bar" },
{ value: 'Absolute - Large Bottle', label: 'Absolute Vodka - Large Bottle - NRs 11000', price: 11000, order_type: "Bar" },
{ value: 'Old Durbar Regular - 60ml', label: 'Old Durbar Regular - 60ml - NRs 450', price: 450, order_type: "Bar" },
{ value: 'Old Durbar Regular - 180ml', label: 'Old Durbar Regular - 180ml - NRs 1050', price: 1050, order_type: "Bar" },
{ value: 'Old Durbar Regular - Bottle', label: 'Old Durbar Regular - Bottle - NRs 4500', price: 4500, order_type: "Bar" },
{ value: 'Old Durbar regular half', label: 'Old Durbar Regular half - NRs 2230', price: 2230, order_type: "Bar" },
{ value: 'Old Durbar Chimney - 60ml', label: 'Old Durbar Chimney - 60ml - NRs 630', price: 630, order_type: "Bar" },
{ value: 'Old Durbar Chimney - 180ml', label: 'Old Durbar Chimney - 180ml - NRs 1500', price: 1500, order_type: "Bar" },
{ value: 'Old Durbar Chimney - Bottle', label: 'Old Durbar Chimney - Bottle - NRs 5900', price: 5900, order_type: "Bar" },
{ value: 'Gurkhas & Guns - 60ml', label: 'Gurkhas & Guns - 60ml - NRs 490', price: 490, order_type: "Bar" },
{ value: 'Gurkhas & Guns - 180ml', label: 'Gurkhas & Guns - 180ml - NRs 1230', price: 1230, order_type: "Bar" },
{ value: 'Gurkhas & Guns - Bottle', label: 'Gurkhas & Guns - Bottle - NRs 4560', price: 4560, order_type: "Bar" },
{ value: 'Jack Daniel - 60ml', label: 'Jack Daniel - 60ml - NRs 830', price: 830, order_type: "Bar" },
{ value: 'Jack Daniel - 180ml', label: 'Jack Daniel - 180ml - NRs 2400', price: 2400, order_type: "Bar" },
{ value: 'Jack Daniel - Bottle', label: 'Jack Daniel - Bottle - NRs 12000', price: 12000, order_type: "Bar" },
{ value: 'Glenfiddhich 12Y - 60ml', label: 'Glenfiddhich 12Y - 60ml - NRs 1600', price: 1600, order_type: "Bar" },
{ value: 'Glenfiddhich 12Y - 180ml', label: 'Glenfiddhich 12Y - 180ml - NRs 3900', price: 3900, order_type: "Bar" },
{ value: 'Glenfiddhich 12Y - Bottle', label: 'Glenfiddhich 12Y - Bottle - NRs 18500', price: 18500, order_type: "Bar" },
{ value: 'JW Double Black - 60ml', label: 'JW Double Black - 60ml - NRs 1200', price: 1200, order_type: "Bar" },
{ value: 'JW Double Black - 180ml', label: 'JW Double Black - 180ml - NRs 3000', price: 3000, order_type: "Bar" },
{ value: 'JW Double Black - half', label: 'JW Double Black - half - NRs 8000', price: 8000, order_type: "Bar" },
{ value: 'JW Double Black - Bottle', label: 'JW Double Black - Bottle - NRs 15600', price: 15600, order_type: "Bar" },
{ value: 'JW Black Label - 60ml', label: 'JW Black Label - 60ml - NRs 1060', price: 1060, order_type: "Bar" },
{ value: 'JW Black Label - 180ml', label: 'JW Black Label - 180ml - NRs 2600', price: 2600, order_type: "Bar" },
{ value: 'JW Black Label - Bottle', label: 'JW Black Label - Bottle - NRs 13800', price: 13800, order_type: "Bar" },
{ value: 'Chivas Regal 12Y - 60ml', label: 'Chivas Regal 12Y - 60ml - NRs 1130', price: 1130, order_type: "Bar" },
{ value: 'Chivas Regal 12Y - 180ml', label: 'Chivas Regal 12Y - 180ml - NRs 2700', price: 2700, order_type: "Bar" },
{ value: 'Chivas Regal 12Y - Bottle', label: 'Chivas Regal 12Y - Bottle - NRs 13800', price: 13800, order_type: "Bar" },
{ value: 'Jameson - 60ml', label: 'Jameson - 60ml - NRs 930', price: 930, order_type: "Bar" },
{ value: 'Jameson - 180ml', label: 'Jameson - 180ml - NRs 2250', price: 2250, order_type: "Bar" },
{ value: 'Jameson - Bottle', label: 'Jameson - Bottle - NRs 11990', price: 11990, order_type: "Bar" },
{ value: 'Baileys - 30ml', label: 'Baileys - 30ml - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Baileys - 60ml', label: 'Baileys - 60ml - NRs 1000', price: 1000, order_type: "Bar" },
{ value: 'Triple Sec - 30ml', label: 'Triple Sec - 30ml - NRs 350', price: 350, order_type: "Bar" },
{ value: 'Triple Sec - 60ml', label: 'Triple Sec - 60ml - NRs 700', price: 700, order_type: "Bar" },
{ value: 'Hookah (Cloud)', label: 'Hookah (Cloud) - NRs 390', price: 390, order_type: "Bar" },
{ value: 'Ice Hookah', label: 'Ice Hookah - NRs 430', price: 430, order_type: "Bar" },
{ value: 'Lemon Hookah', label: 'Lemon Hookah - NRs 450', price: 450, order_type: "Bar" },
{ value: 'Hybe Hookah (Seasonal Fruit)', label: 'Hybe Hookah (Seasonal Fruit) - NRs 550', price: 550, order_type: "Bar" },
{ value: 'Hybe Hookah (Blueberry)', label: 'Hybe Hookah (Blueberry) - NRs 590', price: 590, order_type: "Bar" },
{ value: 'Shikhar Ice', label: 'Shikhar Ice - NRs 25', price: 25, order_type: "Bar" },
{ value: 'Surya Red', label: 'Surya Red - NRs 30', price: 30, order_type: "Bar" },
{ value: 'Surya Light', label: 'Surya Light - NRs 30', price: 30, order_type: "Bar" },
{ value: 'Hookah refill', label: 'Hookah refill - NRs 300', price: 300, order_type: "Bar" },
{ value: 'Hookah morning', label: 'Hookah morning - NRs 350', price: 350, order_type: "Bar" },
{ value: 'Coil', label: 'Coil - NRs 50', price: 50, order_type: "Bar" },
{ value: 'Khukrirum Light - 30 ml', label: 'Khukrirum Light - 30 ml - NRs 180', price: 180, order_type: "Bar" },
{ value: 'Khukri Rum light - 60ml', label: 'Khukri Rum light - 60ml - NRs 350', price: 350, order_type: "Bar" },
{ value: 'Khukri Rum light - 180ml', label: 'Khukri Rum light - 180ml - NRs 1000', price: 1000, order_type: "Bar" },
{ value: 'Khukri Rum light - Bottle', label: 'Khukri Rum light - Bottle - NRs 3600', price: 3600, order_type: "Bar" },
{ value: 'Khukri Rum dark - 60ml', label: 'Khukri Rum dark - 60ml - NRs 350', price: 350, order_type: "Bar" },
{ value: 'Khukri Rum dark - 180ml', label: 'Khukri Rum dark - 180ml - NRs 1000', price: 1000, order_type: "Bar" },
{ value: 'Khukri Rum dark - Bottle', label: 'Khukri Rum dark - Bottle - NRs 3600', price: 3600, order_type: "Bar" },
{ value: 'Khukri Spiced Rum - 60ml', label: 'Khukri Spiced Rum - 60ml - NRs 390', price: 390, order_type: "Bar" },
{ value: 'Khukri Spiced Rum - 180ml', label: 'Khukri Spiced Rum - 180ml - NRs 1120', price: 1120, order_type: "Bar" },
{ value: 'Khukri Spiced Rum - Bottle', label: 'Khukri Spiced Rum - Bottle - NRs 3600', price: 3600, order_type: "Bar" },
{ value: 'Beefeater - 30ml', label: 'Beefeater - 30ml - NRs 390', price: 390, order_type: "Bar" },
{ value: 'Beefeater - 60ml', label: 'Beefeater - 60ml - NRs 780', price: 780, order_type: "Bar" },
{ value: 'Snow man - 30ml', label: 'Snow man - 30ml - NRs 175', price: 175, order_type: "Bar" },
{ value: 'Snow man - 60ml', label: 'Snow man - 60ml - NRs 350', price: 350, order_type: "Bar" },
{ value: 'Agavita silver - 30ml', label: 'Agavita silver - 30ml - NRs 455', price: 455, order_type: "Bar" },
{ value: 'Agavita silver - 60ml', label: 'Agavita silver - 60ml - NRs 910', price: 910, order_type: "Bar" },
{ value: 'Jacob Creek Red Wine (Merlot Shiraz)', label: 'Jacob Creek Red Wine (Merlot Shiraz) - NRs 3200', price: 3200, order_type: "Bar" },
{ value: 'Jacob Creek White Wine (Cardonnay)', label: 'Jacob Creek White Wine (Cardonnay) - NRs 3200', price: 3200, order_type: "Bar" },
{ value: 'Rose Wine (Moscato)', label: 'Rose Wine (Moscato) - NRs 3100', price: 3100, order_type: "Bar" },
{ value: 'Sparkling Wine (Calvet)', label: 'Sparkling Wine (Calvet) - NRs 3900', price: 3900, order_type: "Bar" },
{ value: 'Jp.chenet', label: 'Jp.chenet - NRs 3900', price: 3900, order_type: "Bar" },
{ value: 'Big master', label: 'Big master - NRs 1400', price: 1400, order_type: "Bar" },
{ value: 'cosmopolitan', label: 'cosmopolitan - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Espresso Martini', label: 'Espresso Martini - NRs 590', price: 590, order_type: "Bar" },
{ value: 'Whisky Sour', label: 'Whisky Sour - NRs 510', price: 510, order_type: "Bar" },
{ value: 'Classic Mojito', label: 'Classic Mojito - NRs 460', price: 460, order_type: "Bar" },
{ value: 'Blue Lagoon', label: 'Blue Lagoon - NRs 460', price: 460, order_type: "Bar" },
{ value: 'Cape Cod', label: 'Cape Cod - NRs 440', price: 440, order_type: "Bar" },
{ value: 'Screw Driver', label: 'Screw Driver - NRs 440', price: 440, order_type: "Bar" },
{ value: 'Cuba Libre', label: 'Cuba Libre - NRs 450', price: 450, order_type: "Bar" },
{ value: 'Long Island Tea', label: 'Long Island Tea - NRs 730', price: 730, order_type: "Bar" },
{ value: 'Daiquiri', label: 'Daiquiri - NRs 450', price: 450, order_type: "Bar" },
{ value: 'Margarita', label: 'Margarita - NRs 490', price: 490, order_type: "Bar" },
{ value: 'Kamikaze', label: 'Kamikaze - NRs 490', price: 490, order_type: "Bar" },
{ value: 'Hot Rum Punch', label: 'Hot Rum Punch - NRs 450', price: 450, order_type: "Bar" },
{ value: 'Sex on the beach', label: 'Sex on the beach - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Red bull', label: 'Red bull - NRs 300', price: 300, order_type: "Bar" },
{ value: 'Blue Angel', label: 'Blue Angel - NRs 300', price: 300, order_type: "Bar" },
{ value: 'Coco rush', label: 'Coco rush - NRs 320', price: 320, order_type: "Bar" },
{ value: 'Virgin Mojito', label: 'Virgin Mojito - NRs 280', price: 280, order_type: "Bar" },
{ value: 'Cinderella', label: 'Cinderella - NRs 480', price: 480, order_type: "Bar" },
{ value: 'Lady on the beach', label: 'Lady on the beach - NRs 430', price: 430, order_type: "Bar" },
{ value: 'Purple Galaxy', label: 'Purple Galaxy - NRs 430', price: 430, order_type: "Bar" },
{ value: 'Watermelon Mojito', label: 'Watermelon Mojito - NRs 380', price: 380, order_type: "Bar" },
{ value: 'B-52', label: 'B-52 - NRs 590', price: 590, order_type: "Bar" },
{ value: 'Brain Damage', label: 'Brain Damage - NRs 565', price: 565, order_type: "Bar" },
{ value: 'Kamikaze Shot', label: 'Kamikaze Shot - NRs 500', price: 500, order_type: "Bar" },
{ value: 'Jager bomb', label: 'Jager bomb - NRs 595', price: 595, order_type: "Bar" },
{ value: 'Flaming Lambo', label: 'Flaming Lambo - NRs 1400', price: 1400, order_type: "Bar" },
{ value: 'Jägermeister -30ml', label: 'Jägermeister 30ml - NRs 400', price: 400, order_type: "Bar" },
{ value: 'Jägermeister -60ml', label: 'Jägermeister -60ml - NRs 750', price: 750, order_type: "Bar" },
{ value: 'Ristretto', label: 'Ristretto - NRs 90', price: 90, order_type: "Bar" },
{ value: 'Espresso', label: 'Espresso - NRs 100', price: 100, order_type: "Bar" },
{ value: 'Espresso Macchiato', label: 'Espresso Macchiato - NRs 120', price: 120, order_type: "Bar" },
{ value: 'Espresso shake', label: 'Espresso shake - NRs 125', price: 125, order_type: "Bar" },
{ value: 'Americano Single', label: 'Americano (Single) - NRs 125', price: 125, order_type: "Bar" },
{ value: 'Americano Double', label: 'Americano (Double) - NRs 135', price: 135, order_type: "Bar" },
{ value: 'Lungo Single', label: 'Lungo (Single) - NRs 135', price: 135, order_type: "Bar" },
{ value: 'Lungo Double', label: 'Lungo (Double) - NRs 145', price: 145, order_type: "Bar" },
{ value: 'Doppio', label: 'Doppio - NRs 130', price: 130, order_type: "Bar" },
{ value: 'Espresso Affagato', label: 'Espresso Affagato - NRs 210', price: 210, order_type: "Bar" },
{ value: 'Doppio shake', label: 'Doppio shake - NRs 150', price: 150, order_type: "Bar" },
{ value: 'Chocolate Shake', label: 'Chocolate Shake - NRs 270', price: 270, order_type: "Bar" },
{ value: 'Strawberry Shake', label: 'Strawberry Shake - NRs 270', price: 270, order_type: "Bar" },
{ value: 'Vanilla Shake', label: 'Vanilla Shake - NRs 270', price: 270, order_type: "Bar" },
{ value: 'Caramel Shake', label: 'Caramel Shake - NRs 270', price: 270, order_type: "Bar" },
{ value: 'Blue Berry Shake', label: 'Blue Berry Shake - NRs 270', price: 270, order_type: "Bar" },
{ value: 'Oreo Milkshake', label: 'Oreo Milkshake - NRs 285', price: 285, order_type: "Bar" },
{ value: 'Kitkat Milkshake', label: 'Kitkat Milkshake - NRs 315', price: 315, order_type: "Bar" },
{ value: 'Flavored Latte', label: 'Flavored Latte - Chocolate/Strawberry/Vanilla/Caramel/Honey - NRs 230', price: 230, order_type: "Bar" },
{ value: 'Latte Single', label: 'Latte (Single) - NRs 165', price: 165, order_type: "Bar" },
{ value: 'Latte Double', label: 'Latte (Double) - NRs 245', price: 245, order_type: "Bar" },
{ value: 'Cappuccino Single', label: 'Cappuccino (Single) - NRs 170', price: 170, order_type: "Bar" },
{ value: 'Cappuccino Double', label: 'Cappuccino (Double) - NRs 250', price: 250, order_type: "Bar" },
{ value: 'Iced Cappuccino', label: 'Iced Cappuccino - NRs 190', price: 190, order_type: "Bar" },
{ value: 'Hot Chocolate', label: 'Hot Chocolate - NRs 230', price: 230, order_type: "Bar" },
{ value: 'Hot Lemon Honey', label: 'Hot Lemon with Honey - NRs 130', price: 130, order_type: "Bar" },
{ value: 'Hot Lemon Honey Ginger', label: 'Hot Lemon with Honey and Ginger - NRs 150', price: 150, order_type: "Bar" },
{ value: 'Banana Smoothie', label: 'Banana Smoothie - NRs 180', price: 180, order_type: "Bar" },
{ value: 'Blueberry Smoothie', label: 'Blueberry Smoothie - NRs 200', price: 200, order_type: "Bar" },
{ value: 'Apple Smoothie', label: 'Apple Smoothie - NRs 230', price: 230, order_type: "Bar" },
{ value: 'Plain Lassi', label: 'Plain Lassi - NRs 130', price: 130, order_type: "Bar" },
{ value: 'Sweet Lassi', label: 'Sweet Lassi - NRs 160', price: 160, order_type: "Bar" },
{ value: 'Vanilla Lassi', label: 'Vanilla Lassi - NRs 190', price: 190, order_type: "Bar" },
{ value: 'Caramel Lassi', label: 'Caramel Lassi - NRs 190', price: 190, order_type: "Bar" },
{ value: 'Banana Lassi', label: 'Banana Lassi - NRs 180', price: 180, order_type: "Bar" },
{ value: 'Apple Lassi', label: 'Apple Lassi - NRs 230', price: 230, order_type: "Bar" },
{ value: 'Mix Fruit Lassi', label: 'Mix Fruit Lassi - NRs 260', price: 260, order_type: "Bar" },
{ value: 'Ice Americano Single', label: 'Ice Americano (Single) - NRs 155', price: 155, order_type: "Bar" },
{ value: 'Ice Americano Double', label: 'Ice Americano (Double) - NRs 245', price: 245, order_type: "Bar" },
{ value: 'Iced Latte', label: 'Iced Latte - NRs 180', price: 180, order_type: "Bar" },
{ value: 'Iced Mocha', label: 'Iced Mocha - NRs 230', price: 230, order_type: "Bar" },
{ value: 'Peach Iced Tea', label: 'Peach Iced Tea - NRs 190', price: 190, order_type: "Bar" },
{ value: 'Lemon Iced Tea', label: 'Lemon Iced Tea - NRs 190', price: 190, order_type: "Bar" },
{ value: 'Ice Caramel Macchiato', label: 'Ice Caramel Macchiato - NRs 210', price: 210, order_type: "Bar" },
{ value: 'Ice Blended Mocha', label: 'Ice Blended Mocha - NRs 230', price: 230, order_type: "Bar" },
{ value: 'Lemonade', label: 'Lemonade - NRs 190', price: 190, order_type: "Bar" },
{ value: 'Mint Lemonade', label: 'Mint Lemonade - NRs 220', price: 220, order_type: "Bar" },
{ value: 'Black Tea', label: 'Black Tea - NRs 50', price: 50, order_type: "Bar" },
{ value: 'Lemon Tea', label: 'Lemon Tea - NRs 65', price: 65, order_type: "Bar" },
{ value: 'Milk Tea', label: 'Milk Tea - NRs 75', price: 75, order_type: "Bar" },
{ value: 'Green Tea', label: 'Green Tea - NRs 90', price: 90, order_type: "Bar" },
{ value: 'Chocolate Ice Cream', label: 'Chocolate Ice Cream - NRs 150', price: 150, order_type: "Bar" },
{ value: 'Vanilla Ice Cream', label: 'Vanilla Ice Cream - NRs 150', price: 150, order_type: "Bar" },
{ value: 'Strawberry Ice Cream', label: 'Strawberry Ice Cream - NRs 150', price: 150, order_type: "Bar" },
{ value: 'Butterscotch Ice Cream', label: 'Butterscotch Ice Cream - NRs 150', price: 150, order_type: "Bar" },

{ value: 'Rock glass', label: 'Rock glass - NRs 200', price: 200, order_type: "Bar" }


      ];

      const router = useRouter();

      const validateForm = () => {
          const newErrors = {};
          
          if (selectedItems.length === 0) {
              newErrors.selectedItems = "Please select at least one item";
          }
          
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
      };
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          
          // Prevent multiple submissions
          if (isLoading) return;
          
          if (!validateForm()) {
              return;
          }
  
          setIsLoading(true); // Start loading
  
          try {
              // Create an array of orders from selected items
              const orders = selectedItems.map(item => ({
                  table_id: id,
                  order_title: item.value,
                  order_description,
                  order_status,
                  customer_status,
                  order_price: item.price,
                  order_quantity: item.quantity || 1,
                  order_type: item.order_type // Use the order_type from the menu item
              }));
  
              const res = await fetch("/api/orders", {
                  method: "POST",
                  headers: {
                      "Content-type": "application/json",
                  },
                  body: JSON.stringify(orders),
              });
  
              if (res.ok) {
                  router.push(`/listOrder/${id}`);
                  router.refresh();
              } else {
                  throw new Error("Failed to create orders");
              }
          } catch (error) {
              console.log(error);
              setIsLoading(false); // Stop loading on error
          }
      };
  
      const handleItemSelect = (selectedOptions) => {
          // Preserve existing items and their quantities
          const existingItemsMap = new Map();
          selectedItems.forEach(item => {
              existingItemsMap.set(item.value, item);
          });
  
          // Merge existing items with new selections, preserving quantities
          const mergedItems = selectedOptions.map(option => {
              const existingItem = existingItemsMap.get(option.value);
              if (existingItem) {
                  // Return existing item with preserved quantity
                  return {
                      ...existingItem,
                      // Keep the order_type from the original option (menu definition)
                      order_type: option.order_type
                  };
              } else {
                  // New item with default values
                  return {
                      ...option,
                      quantity: 1
                      // order_type is already included from the option
                  };
              }
          });
  
          setSelectedItems(mergedItems);
          
          // Clear error if items are selected
          if (selectedOptions.length > 0 && errors.selectedItems) {
              setErrors(prev => ({...prev, selectedItems: ""}));
          }
      };
  
      const updateItemQuantity = (index, newQuantity) => {
          if (newQuantity < 1) return;
          
          setSelectedItems(prev => 
              prev.map((item, i) => 
                  i === index ? { ...item, quantity: newQuantity } : item
              )
          );
      };
  
      const removeItem = (index) => {
          setSelectedItems(prev => prev.filter((_, i) => i !== index));
      };

      // Clear all selected items
      const clearAllItems = () => {
          setSelectedItems([]);
      };
  
      const ClearIndicator = () => null;

      // Calculate total price
      const totalPrice = selectedItems.reduce((total, item) => {
          return total + (item.price * (item.quantity || 1));
      }, 0);
  
      try {
          return (
              <>
                  <div className="min-h-screen" style={{ backgroundColor: "#1a202c" }}>
                  <nav className="flex justify-between items-center px-4 py-2 navbar" style={{ backgroundColor: "#232b38" }}>
                      <div style={{ flex: 0.4 }}></div>
                      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg page-title" href={"/tables"}>
                      HYBE Food & Drinks
                      </Link>
                              <Link className="hover:text-gray-300 text-sm transition-colors duration-200 nav-button" href={`/listOrder/${id}`}>
                                  Back
                              </Link>
                          </nav>
                      
                      <div className="max-w-6xl mx-auto p-4 mt-4">
                          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                              <h2 className="text-xl font-bold text-white mb-6 text-center">Add New Order</h2>
                              
                              <form onSubmit={handleSubmit} className="space-y-6">
                                  {/* Main Content Grid */}
                                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                      {/* Left Column - Selection and Info */}
                                      <div className="xl:col-span-1 space-y-6">
                                          {/* Item Selection with Clear All Button */}
                                          <div>
                                              <div className="flex justify-between items-center mb-2">
                                                  <label className="block text-gray-300 text-sm font-medium">Select Items</label>
                                                  {selectedItems.length > 0 && (
                                                      <button
                                                          type="button"
                                                          onClick={clearAllItems}
                                                          className="text-red-400 hover:text-red-300 text-xs font-medium flex items-center transition-colors"
                                                          disabled={isLoading}
                                                      >
                                                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                          </svg>
                                                          Clear All
                                                      </button>
                                                  )}
                                              </div>
                                              <Select 
                                                  isMulti
                                                  options={options}
                                                  onChange={handleItemSelect}
                                                  value={selectedItems}
                                                  styles={{
                                                      control: (provided, state) => ({ 
                                                          ...provided, 
                                                          backgroundColor: '#2d3748',
                                                          borderColor: errors.selectedItems ? '#e53e3e' : state.isFocused ? '#4a5568' : '#4a5568',
                                                          color: 'white',
                                                          minHeight: '40px',
                                                          fontSize: '14px',
                                                          boxShadow: errors.selectedItems ? '0 0 0 1px #e53e3e' : provided.boxShadow,
                                                      }),
                                                      menu: (provided) => ({ 
                                                          ...provided, 
                                                          backgroundColor: '#2d3748',
                                                          color: 'white',
                                                          zIndex: 20
                                                      }),
                                                      multiValue: (provided) => ({
                                                          ...provided,
                                                          backgroundColor: '#4a5568',
                                                      }),
                                                      multiValueLabel: (provided) => ({
                                                          ...provided,
                                                          color: 'white',
                                                          fontSize: '12px'
                                                      }),
                                                      multiValueRemove: () => ({
                                                        //   ...provided,
                                                        //   color: 'white',
                                                        //   ':hover': {
                                                        //       backgroundColor: '#e53e3e',
                                                        //       color: 'white'
                                                        //   }
                                                        display: 'none'
                                                      }),
                                                      clearIndicator: () => ({
                                                        // Remove the global clear "X" icon
                                                        display: 'none'
                                                    }),
                                                      singleValue: (provided) => ({
                                                          ...provided,
                                                          color: 'white',
                                                          fontSize: '14px'
                                                      }),
                                                      input: (provided) => ({
                                                          ...provided,
                                                          color: 'white',
                                                          fontSize: '14px'
                                                      }),
                                                      option: (provided, state) => ({
                                                          ...provided,
                                                          backgroundColor: state.isFocused ? '#4a5568' : '#2d3748',
                                                          color: 'white',
                                                          fontSize: '14px',
                                                          padding: '8px 12px'
                                                      })
                                                  }}
                                                  components={{
                                                    // Remove the global clear indicator and indicator separator
                                                    ClearIndicator,
                                                    IndicatorSeparator: null,
                                                }}
                                                  placeholder="Search and select items..."
                                              />
                                              {errors.selectedItems && (
                                                  <p className="text-red-400 text-xs mt-1 flex items-center">
                                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                      </svg>
                                                      {errors.selectedItems}
                                                  </p>
                                              )}
                                          </div>
  
                                          {/* Order Summary Card */}
                                          {selectedItems.length > 0 && (
                                              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                                  <h3 className="text-white font-semibold mb-3 text-sm">Order Summary</h3>
                                                  
                                                  <div className="space-y-2 mb-3">
                                                      <div className="flex justify-between text-xs">
                                                          <span className="text-gray-300">Items:</span>
                                                          <span className="text-white">{selectedItems.length}</span>
                                                      </div>
                                                      <div className="flex justify-between text-xs">
                                                          <span className="text-gray-300">Total Quantity:</span>
                                                          <span className="text-white">
                                                              {selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                                                          </span>
                                                      </div>
                                                    
                                                  </div>
                                              </div>
                                          )}
  
                                          {/* Table Info */}
                                          <div className="md:col-span-2">
                                      <label className="block text-gray-300 mb-1 text-sm font-medium">Table Number</label>
                                      <div className="bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm">
                                          {id}
                                      </div>
                                  </div>
  
                                          {/* Special Instructions */}
                                          <div>
                                              <label className="block text-gray-300 mb-2 text-sm font-medium">Special Instructions</label>
                                              <textarea
                                                  onChange={(e) => setDescription(e.target.value)}
                                                  value={order_description}
                                                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                                  rows="3"
                                                  placeholder="Any special requests or notes for all items..."
                                              />
                                          </div>
                                      </div>
  
                                      {/* Right Column - Selected Items */}
                                      <div className="xl:col-span-3">
                                          {selectedItems.length > 0 ? (
                                              <div>
                                                  <div className="flex justify-between items-center mb-4">
                                                      <label className="block text-gray-300 text-sm font-medium">
                                                          Selected Items ({selectedItems.length})
                                                      </label>
                                                  </div>
                                                  
                                                  {/* Items Grid */}
                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
                                                      {selectedItems.map((item, index) => (
                                                          <div key={index} className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors">
                                                              {/* Item Header */}
                                                              <div className="flex justify-between items-start mb-3">
                                                                  <div className="flex-1 min-w-0">
                                                                      <h4 className="text-white font-medium text-sm truncate">{item.label.split(' - ')[0]}</h4>
                                                                      <p className="text-gray-300 text-xs">NRs. {item.price} each</p>
                                                                  </div>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => removeItem(index)}
                                                                      className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                                                                      title="Remove item"
                                                                      disabled={isLoading} // Disable during loading
                                                                  >
                                                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                      </svg>
                                                                  </button>
                                                              </div>
  
                                                              {/* Order Type Display */}
                                                              <div className="mb-3">
                                                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                    item.order_type === "Kitchen" 
                                                                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                                                                    : item.order_type === "Bar"
                                                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                                                    : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                                                                }`}>
                                                                    {item.order_type || "Not specified"}
                                                                </div>
                                                                </div>
  
                                                              {/* Quantity Controls */}
                                                              <div className="flex justify-between items-center">
                                                                  <div className="flex items-center space-x-3">
                                                                      <span className="text-gray-300 text-xs font-medium">Qty:</span>
                                                                      <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600">
                                                                          <button 
                                                                              type="button"
                                                                              onClick={() => updateItemQuantity(index, (item.quantity || 1) - 1)}
                                                                              className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-l text-sm transition-colors ${
                                                                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                                              }`}
                                                                              disabled={isLoading} // Disable during loading
                                                                          >
                                                                              -
                                                                          </button>
                                                                          <div className="bg-gray-800 text-white text-center py-1 px-3 min-w-8 border-x border-gray-600 text-sm font-medium">
                                                                              {item.quantity || 1}
                                                                          </div>
                                                                          <button 
                                                                              type="button"
                                                                              onClick={() => updateItemQuantity(index, (item.quantity || 1) + 1)}
                                                                              className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-r text-sm transition-colors ${
                                                                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                                              }`}
                                                                              disabled={isLoading} // Disable during loading
                                                                          >
                                                                              +
                                                                          </button>
                                                                      </div>
                                                                  </div>
                                                                  
                                                                  <div className="text-right">
                                                                      <div className="text-white text-sm font-semibold">
                                                                          NRs. {item.price * (item.quantity || 1)}
                                                                      </div>
                                                                      <div className={`text-xs ${
                                                                          item.order_type === "Kitchen" ? "text-green-400" : 
                                                                          item.order_type === "Bar" ? "text-blue-400" : 
                                                                          "text-gray-400"
                                                                      }`}>
                                                                          {item.order_type || "No type"}
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          ) : (
                                              /* Empty State */
                                              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                                                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                  </svg>
                                                  <p className="text-lg mb-2">No items selected</p>
                                                  <p className="text-sm text-center">Select items from the dropdown to start creating your order</p>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                  
                                  {/* Submit Button */}
                                  {selectedItems.length > 0 && (
                                      <div className="pt-4 border-t border-gray-700">
                                          <div className="flex justify-between items-center">
                                              <div className="text-white">
                                                  <div className="text-sm text-gray-300">Total for {selectedItems.length} items</div>
                                                  <div className="text-2xl font-bold">NRs. {totalPrice}</div>
                                              </div>
                                              <button
                                                  type="submit"
                                                  disabled={isLoading} // Disable button during loading
                                                  className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform min-w-40 flex items-center justify-center ${
                                                      isLoading 
                                                      ? 'opacity-70 cursor-not-allowed' 
                                                      : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                                                  }`}
                                              >
                                                  {isLoading ? (
                                                      <>
                                                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                          </svg>
                                                          Processing...
                                                      </>
                                                  ) : (
                                                      'Place Order'
                                                  )}
                                              </button>
                                          </div>
                                      </div>
                                  )}
                              </form>
                          </div>
                      </div>
                  </div>
                  
                  <style jsx>{`
                      .navbar {
                          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
                      }
                      
                      /* Custom scrollbar for selected items */
                      .overflow-y-auto::-webkit-scrollbar {
                          width: 6px;
                      }
                      
                      .overflow-y-auto::-webkit-scrollbar-track {
                          background: #2d3748;
                          border-radius: 3px;
                      }
                      
                      .overflow-y-auto::-webkit-scrollbar-thumb {
                          background: #4a5568;
                          border-radius: 3px;
                      }
                      
                      .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                          background: #718096;
                      }
                  `}</style>
              </>
          );
      } catch (error) {
          return (
              <div className="min-h-screen flex items-center justify-center bg-gray-900">
                  <div className="bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-md text-center">
                      <h2 className="text-xl font-bold mb-2">Error Adding Order</h2>
                      <p>Please try again later or contact support if the problem persists.</p>
                      <Link 
                          href={`/listOrder/${id}`}
                          className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                          Back to Orders
                      </Link>
                  </div>
              </div>
          );
      }
  }