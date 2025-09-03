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
    // const [order_type, setOrderType] = useState("Kitchen");
    const [order_type, setOrderType] = useState(""); // Initially empty
    const [errors, setErrors] = useState({});

    const options = [
      // kitchen menu
      { value: 'Kitchen menu', label: 'Kitchen menu', price: 0 },
      
     { value: 'Water', label: 'Water - NRs 50', price: 50 },
     // veg starter

     { value: 'Dynamite Fries - veg', label: 'Dynamite Fries veg - NRs 290', price: 290 },
     { value: 'Veg Crispy', label: 'Veg Crispy - NRs 250', price: 250 },
     { value: 'Chilly Paneer', label: 'Chilly Paneer - NRs 440', price: 440 },
     { value: 'Corn salt & Pepper', label: 'Corn salt & Pepper - NRs 280', price: 280 },
     { value: 'Aloo Papdi Chat', label: 'Aloo Papdi Chat - NRs 240', price: 240 },
     { value: 'French Fries', label: 'French Fries - NRs 110', price: 110 },
     { value: 'Veg Bullet', label: 'Veg Bullet - NRs 180', price: 180 },
     { value: 'Cheese Ball', label: 'Cheese Ball - NRs 350', price: 350 },
     { value: 'Chilly Mushroom', label: 'Chilly Mushroom - NRs 350', price: 350 },
     { value: 'Afgani Fries', label: 'Afgani Fries - NRs 200', price: 200 },
     { value: 'Boiled Vegetables', label: 'Boiled Vegetables - NRs 180', price: 180 },
     { value: 'Mushroom Steak', label: 'Mushroom Steak - NRs 350', price: 350 },
     { value: 'Paneer Steak', label: 'Paneer Steak - NRs 410', price: 410 },
     { value: 'Potato Twister', label: 'Potato Twister - NRs 150', price: 150 },
     { value: 'crispy corn', label: 'crispy corn  - NRs 350', price: 350 },

     // NEPALI CUISINE
     { value: 'Chicken Choila', label: 'Chicken Choila - NRs 350', price: 350 },
     { value: 'Chicken Tass', label: 'Chicken Tass - NRs 400', price: 400 },
     { value: 'Chicken Sadheko Fry/Boill', label: 'Chicken Sadheko Fry/Boill - NRs 290', price: 290 },
     { value: 'Peanul Sadheko', label: 'Peanul Sadheko - NRs 200', price: 200 },
     { value: 'Wai Wai Sadheko', label: 'Wai Wai Sadheko - NRs 160', price: 160 },
     { value: 'Chicken Sutuki', label: 'Chicken Sutuki - NRs 370', price: 370 },
     { value: 'Buff Sukuti', label: 'Buff Sukuti - NRs 350', price: 350 },
     { value: 'Buff Choila', label: 'Buff Choila - NRs 400', price: 400 },
     { value: 'Chicken Chatpate', label: 'Chicken Chatpate - NRs 300', price: 300 },
     { value: 'Sukuti Chatpate Buff', label: 'Sukuti Chatpate Buff - NRs 320', price: 320 },
     { value: 'Timur Chicken', label: 'Timur Chicken - NRs 350', price: 350 },
   
     // NON-VEG STARTER
     { value: 'Dynamite Fries non veg', label: 'Dynamite Fries non veg - NRs 260', price: 260 },
     { value: 'Chilly Chicken', label: 'Chilly Chicken - NRs 410', price: 410 },
     { value: 'Hot Wings', label: 'Hot Wings - NRs 440', price: 440 },
     { value: 'Kungpao Chicken', label: 'Kungpao Chicken - NRs 440', price: 440 },
     { value: 'Pepper Chicken', label: 'Pepper Chicken - NRs 330', price: 330 },
     { value: 'Chicken 65', label: 'Chicken 65 - NRs 450', price: 450 },
     { value: 'Hunan Chicken', label: 'Hunan Chicken - NRs 470', price: 470 },
     { value: 'Finger Chicken', label: 'Finger Chicken - NRs 390', price: 390 },
     { value: 'Chicken Steak', label: 'Chicken Steak - NRs 450', price: 450 },
     { value: 'Chicken Crispy', label: 'Chicken Crispy - NRs 400', price: 400 },
     { value: 'Periperi Chicken', label: 'Periperi Chicken - NRs 400', price: 400 },
     { value: 'Dragon Chicken', label: 'Dragon Chicken - NRs 350', price: 350 },
     { value: 'Drumstick Chicken', label: 'Drumstick Chicken - NRs 390', price: 390 },
     { value: 'Buffalo Wild Wings', label: 'Buffalo Wild Wings - NRs 450', price: 450 },
     { value: 'Szechuan Chicken', label: 'Szechuan Chicken - NRs 320', price: 320 },
     { value: 'Chilly Sausage', label: 'Chilly Sausage - NRs 290', price: 290 },
     { value: 'Crown Chicken', label: 'Crown Chicken - NRs 490', price: 490 },
     { value: 'Boiled Sausage', label: 'Boiled Sausage - NRs 290', price: 290 },
     { value: 'Extra cheese', label: 'Extra cheese - NRs 70', price: 70 },
     { value: 'Chicken Crispy (chef style)', label: 'Chicken Crispy (chef style) - NRs 450', price: 450 },


       // SALAD
       { value: 'Green Salad', label: 'Green Salad - NRs 200', price: 200 },
       { value: 'Fruit Salad', label: 'Fruit Salad - NRs 420', price: 420 },
       { value: 'Russian Salad', label: 'Russian Salad - NRs 290', price: 290 },,
       { value: 'Eggmayo Salad', label: 'Eggmayo Salad - NRs 350', price: 350 },
       { value: 'Nepali Salad', label: 'Nepali Salad - NRs 170', price: 170 },
       { value: 'Classic Salad', label: 'Classic Salad - NRs 350', price: 350 },
       { value: 'Classic Salad - boiled chicken', label: 'Classic Salad boiled chicken - NRs 450', price: 450 },

       { value: 'Boiled vegetable with chicken', label: 'Boiled vegetable with chicken - NRs 350', price: 350 },

       // SOUP
       { value: 'Manchow Soup (Veg)', label: 'Manchow Soup (Veg) - NRs 190', price: 190 },
       { value: 'Manchow Soup (Non-Veg)', label: 'Manchow Soup (Non-Veg) - NRs 260', price: 260 },
       { value: 'Hot & Sour Soup (Veg)', label: 'Hot & Sour Soup (Veg) - NRs 180', price: 180 },
       { value: 'Hot & Sour Soup (Non-Veg)', label: 'Hot & Sour Soup (Non-Veg) - NRs 240', price: 240 },
       { value: 'Clear Soup (Veg)', label: 'Clear Soup (Veg) - NRs 160', price: 160 },
       { value: 'Clear Soup (Non-Veg)', label: 'Clear Soup (Non-Veg) - NRs 200', price: 200 },
       { value: 'leamon coriander veg', label: 'leamon coriander veg - NRs 190', price: 190 },
       { value: 'leamon coriander (Non-veg)', label: 'leamon coriander (Non-veg) - NRs 260', price: 260 },
       { value: 'Mushroom Soup', label: 'Mushroom Soup - NRs 120', price: 120 },

       // INDIAN CUISINE
       { value: 'Chicken Curry', label: 'Chicken Curry - NRs 380', price: 380 },

       // LAPHING
       { value: 'Plain Laphing', label: 'Plain Laphing - NRs 120', price: 120 },
       { value: 'Chicken Laphing', label: 'Chicken Laphing - NRs 250', price: 250 },
       { value: 'Soupy Chauchau Laphing', label: 'Soupy Chauchau Laphing - NRs 130', price: 130 },
       { value: 'Chauchau Laphing', label: 'Chauchau Laphing - NRs 130', price: 130 },
       { value: 'Soupy Peanuts Laphing', label: 'Soupy Peanuts Laphing - NRs 160', price: 160 },
       { value: 'Soupy Plain Laphing', label: 'Soupy Plain Laphing - NRs 120', price: 120 },

       { value: 'Sizzler veg', label: 'Sizzler veg - NRs 560', price: 560 },
       { value: 'Sizzler non-veg', label: 'Sizzler non-veg - NRs 690', price: 690 },
       { value: 'Hybe special', label: 'Hybe special - NRs 1200', price: 1200 },
       { value: 'Chinese Platter', label: 'Chinese Platter - NRs 1250', price: 1250 },
       { value: 'Potato Special', label: 'Potato Special - NRs 500', price: 500 },

       // BREAD
       { value: 'Crunchy Bread', label: 'Crunchy Bread - NRs 230', price: 230 },
       { value: 'Garlic Bread', label: 'Garlic Bread - NRs 230', price: 230 },
       { value: 'Cheese Bread', label: 'Cheese Bread - NRs 230', price: 230 },
       { value: 'Bread Omelette', label: 'Bread Omelette - NRs 210', price: 210 },
       { value: 'Veg Sandwich', label: 'Veg Sandwich - NRs 270', price: 270 },
       { value: 'Non-Veg Sandwich', label: 'Non-Veg Sandwich - NRs 320', price: 320 },
       { value: 'Grilled Veg Sandwich', label: 'Grilled Veg Sandwich - NRs 280', price: 280 },
       { value: 'Grilled Non-Veg Sandwich', label: 'Grilled Non-Veg Sandwich - NRs 340', price: 340 },
       { value: 'Club Sandwich', label: 'Club Sandwich - NRs 400', price: 400 },
     
       // MO:MO
       { value: 'Steam Veg MO:MO', label: 'Steam Veg MO:MO - NRs 135', price: 135 },
       { value: 'Steam Chicken MO:MO', label: 'Steam Chicken MO:MO - NRs 200', price: 200 },
       { value: 'Steam Buff MO:MO', label: 'Steam Buff MO:MO - NRs 220', price: 220 },
       { value: 'Chilly Veg MO:MO', label: 'Chilly Veg MO:MO - NRs 210', price: 210 },
       { value: 'Chilly Chicken MO:MO', label: 'Chilly Chicken MO:MO - NRs 260', price: 260 },
       { value: 'Chilly Buff MO:MO', label: 'Chilly Buff MO:MO - NRs 280', price: 280 },
       { value: 'Afghani Veg MO:MO', label: 'Afghani Veg MO:MO - NRs 240', price: 240 },
       { value: 'Afghani Chicken MO:MO', label: 'Afghani Chicken MO:MO - NRs 340', price: 340 },
       { value: 'Afghani Buff MO:MO', label: 'Afghani Buff MO:MO - NRs 360', price: 360 },
       { value: 'Crunchy Veg MO:MO', label: 'Crunchy Veg MO:MO - NRs 230', price: 230 },
       { value: 'Crunchy Chicken MO:MO', label: 'Crunchy Chicken MO:MO - NRs 290', price: 290 },
       { value: 'Crunchy Buff MO:MO', label: 'Crunchy Buff MO:MO - NRs 320', price: 320 },
       { value: 'Fried Veg MO:MO', label: 'Fried Veg MO:MO - NRs 180', price: 180 },
       { value: 'Fried Chicken MO:MO', label: 'Fried Chicken MO:MO - NRs 240', price: 240 },
       { value: 'Fried Buff MO:MO', label: 'Fried Buff MO:MO - NRs 260', price: 260 },
       { value: 'Jhol Veg MO:MO', label: 'Jhol Veg MO:MO - NRs 220', price: 220 },
       { value: 'Jhol Chicken MO:MO', label: 'Jhol Chicken MO:MO - NRs 250', price: 250 },
       { value: 'Jhol Buff MO:MO', label: 'Jhol Buff MO:MO - NRs 280', price: 280 },
       { value: 'Kothe Veg MO:MO', label: 'Kothe Veg MO:MO - NRs 200', price: 200 },
       { value: 'Kothe Chicken MO:MO', label: 'Kothe Chicken MO:MO - NRs 250', price: 250 },
       { value: 'Kothe Buff MO:MO', label: 'Kothe Buff MO:MO - NRs 280', price: 280 },
       { value: 'Sadheko Veg MO:MO', label: 'Sadheko Veg MO:MO - NRs 210', price: 210 },
       { value: 'Sadheko Chicken MO:MO', label: 'Sadheko Chicken MO:MO - NRs 280', price: 280 },
       { value: 'Sadheko Buff MO:MO', label: 'Sadheko Buff MO:MO - NRs 300', price: 300 },
     
       // PASTA
       { value: 'Veg Pasta (White)', label: 'Veg Pasta (White) - NRs 300', price: 300 },
       { value: 'Veg Pasta (Red)', label: 'Veg Pasta (Red) - NRs 300', price: 300 },
       { value: 'Veg Pasta (Mixed)', label: 'Veg Pasta (Mixed) - NRs 300', price: 300 },

       { value: 'Non-Veg Pasta (White)', label: 'Non-Veg Pasta (White) - NRs 390', price: 390 },
       { value: 'Non-Veg Pasta (Red)', label: 'Non-Veg Pasta (Red) - NRs 390', price: 390 },
       { value: 'Non-Veg Pasta (Mixed)', label: 'Non-Veg Pasta (Mixed) - NRs 390', price: 390 },
       { value: 'Aglio e Olio Veg', label: 'Aglio e Olio Veg - NRs 290', price: 290 },
       { value: 'Aglio e Olio Non-Veg', label: 'Aglio e Olio Non-Veg - NRs 330', price: 400 },
     
       // BURGER
       { value: 'Veg Burger', label: 'Veg Burger - NRs 250', price: 250 },
       { value: 'Non-Veg Burger', label: 'Non-Veg Burger - NRs 400', price: 400 },
       { value: 'Extra Cheese Veg Burger', label: 'Extra Cheese Veg Burger - NRs 310', price: 310 },
       { value: 'Extra Cheese Non-Veg Burger', label: 'Extra Cheese Non-Veg Burger - NRs 460', price: 460 },
       { value: 'Cottage Cheese Burger', label: 'Cottage Cheese Burger - NRs 350', price: 350 },
     
       // PIZZA
       { value: 'Margherita Pizza', label: 'Margherita Pizza - NRs 480', price: 480 },
       { value: 'Farm House Pizza', label: 'Farm House Pizza - NRs 450', price: 450 },
       { value: 'Chicken Pizza', label: 'Chicken Pizza - NRs 500', price: 500 },
       { value: 'Mushroom Pizza', label: 'Mushroom Pizza - NRs 480', price: 480 },
       { value: 'Sweet Corn Pizza', label: 'Sweet Corn Pizza - NRs 450', price: 450 },
       { value: 'Mix chicken pizza', label: 'Mix chicken Pizza - NRs 550', price: 550 },
     
       // RICE
       { value: 'Fried Rice (Veg)', label: 'Fried Rice (Veg) - NRs 180', price: 180 },
       { value: 'Fried Rice (Chicken)', label: 'Fried Rice (Chicken) - NRs 250', price: 250 },
       { value: 'Fried Rice (Buff)', label: 'Fried Rice (Buff) - NRs 250', price: 250 },
       { value: 'Fried Rice (Mixed)', label: 'Fried Rice (Mixed) - NRs 320', price: 320 },

       { value: 'Burnt Garlic pot rice (Veg)', label: 'Burnt Garlic pot rice (Veg) - NRs 250', price: 250 },
       { value: 'Burnt Garlic pot rice (Chicken)', label: 'Burnt Garlic pot rice (Chicken) - NRs 350', price: 350 },
       { value: 'Pulao (Muttor)', label: 'Pulao (Muttor) - NRs 250', price: 250 },
       { value: 'Pulao (Kashmiri)', label: 'Pulao (Kashmiri) - NRs 300', price: 300 },
       { value: 'Jeera Rice', label: 'Jeera Rice - NRs 190', price: 190 },
       { value: 'Veg Biryani', label: 'Veg Biryani - NRs 410', price: 410 },
       { value: 'Non-Veg Biryani', label: 'Non-Veg Biryani - NRs 530', price: 530 },
     
       // NOODLES
       { value: 'Keema Noodles', label: 'Keema Noodles - NRs 390', price: 390 },
       { value: 'Hakka Noodles (Veg)', label: 'Hakka Noodles (Veg) - NRs 190', price: 190 },
       { value: 'Hakka Noodles (Chicken)', label: 'Hakka Noodles (Chicken) - NRs 230', price: 230 },
       { value: 'Hakka Noodles (Buff)', label: 'Hakka Noodles (Buff) - NRs 250', price: 250 },
       { value: 'Szechwan Noodles (Veg)', label: 'Szechwan Noodles (Veg) - NRs 210', price: 210 },
       { value: 'Szechwan Noodles (Chicken)', label: 'Szechwan Noodles (Chicken) - NRs 250', price: 250 },
       { value: 'Szechwan Noodles (Buff)', label: 'Szechwan Noodles (Buff) - NRs 270', price: 270 },
       { value: 'Mixed Noodles', label: 'Mixed Noodles - NRs 350', price: 350 },
       { value: 'Thukpa (Veg)', label: 'Thukpa (Veg) - NRs 220', price: 220 },
       { value: 'Thukpa (Chicken)', label: 'Thukpa (Chicken) - NRs 290', price: 290 },
       { value: 'Thukpa (Buff)', label: 'Thukpa (Buff) - NRs 320', price: 320 },
       { value: 'pan fried noodles (Non Veg)', label: 'Pan fried noodles (Non Veg) - NRs 330', price: 330 },
       { value: 'Pan Fried noodles (veg))', label: 'Pan fried noodles (veg) - NRs 250', price: 250 },
       { value: 'burnt garlic pot noodles(Non Veg)', label: 'Burnt garlic pot noodles (Non Veg) - NRs 350', price: 350 },
       { value: 'burnt garlic pot noodles(Veg)', label: 'Burnt garlic pot noodles (Veg) - NRs 250', price: 250 },

       { value: 'Hakka Noodles half (Veg)', label: 'Hakka Noodles half (Veg) - NRs 100', price: 100 },
       { value: 'Hakka Noodles half (Chicken)', label: 'Hakka Noodles half(Chicken) - NRs 120', price: 120 },
       { value: 'Hakka Noodles half (Buff)', label: 'Hakka Noodles half (Buff) - NRs 140', price: 140 },

       // ROLL
       { value: 'Kathi Roll (Veg)', label: 'Kathi Roll (Veg) - NRs 240', price: 240 },
       { value: 'Kathi Roll (Egg)', label: 'Kathi Roll (Egg) - NRs 300', price: 300 },
       { value: 'Kathi Roll (Chicken)', label: 'Kathi Roll (Chicken) - NRs 370', price: 370 },
       { value: 'Kathi Roll (Paneer)', label: 'Kathi Roll (Paneer) - NRs 410', price: 410 },
       { value: 'Cheese Roll (Veg)', label: 'Cheese Roll (Veg) - NRs 250', price: 250 },
       { value: 'Cheese Roll (Chicken)', label: 'Cheese Roll (Chicken) - NRs 410', price: 410 },
       { value: 'Cheese Roll (Paneer)', label: 'Cheese Roll (Paneer) - NRs 450', price: 450 },

       { value: 'Chicken mocha', label: 'Chicken mocha - NRs 230', price: 230 },
       { value: 'Buff mocha', label: 'Buff mocha - NRs 250', price: 250 },


       { value: 'Peanut', label: 'Peanut - NRs 80', price: 80 },
       { value: 'Honey', label: 'Honey - NRs 50', price: 50 },
       
       { value: 'Egg', label: 'Egg - NRs 60', price: 60 },

       { value: 'Pastry', label: 'Pastry - NRs 300', price: 300 },
       { value: 'Mud cake', label: 'Mud cake - NRs 280', price: 280 },

      // bar menu
        { value: 'Bar menu', label: 'Bar menu', price: 0 },
        // Soft Drinks
        { value: 'Lemon water', label: 'Lemon water - NRs 60', price: 60 },

          // Soft Drinks - Pineapple Juice
  { value: 'Pineapple Juice - Glass', label: 'Pineapple Juice - Glass - NRs 160', price: 160 },
  { value: 'Pineapple Juice - Bottle', label: 'Pineapple Juice - Bottle - NRs 500', price: 500 },

  // Orange Juice
  { value: 'Orange Juice - Glass', label: 'Orange Juice - Glass - NRs 160', price: 160 },
  { value: 'Orange Juice - Bottle', label: 'Orange Juice - Bottle - NRs 500', price: 500 },

  // Mango Juice
  { value: 'Mango Juice - Glass', label: 'Mango Juice - Glass - NRs 160', price: 160 },
  { value: 'Mango Juice - Bottle', label: 'Mango Juice - Bottle - NRs 500', price: 500 },

  // Cranberry Juice
  { value: 'Cranberry Juice - Glass', label: 'Cranberry Juice - Glass - NRs 160', price: 160 },
  { value: 'Cranberry Juice - Bottle', label: 'Cranberry Juice - Bottle - NRs 500', price: 500 },

  // Mix Fruit Juice
  { value: 'Mix Fruit Juice - Glass', label: 'Mix Fruit Juice - Glass - NRs 160', price: 160 },
  { value: 'Mix Fruit Juice - Bottle', label: 'Mix Fruit Juice - Bottle - NRs 500', price: 500 },

  // Coke
  { value: 'Coke - Glass', label: 'Coke - Glass - NRs 110', price: 110 },
  { value: 'Coke - Bottle', label: 'Coke - Bottle - NRs 500', price: 500 },

  // Fanta
  { value: 'Fanta - Glass', label: 'Fanta - Glass - NRs 110', price: 110 },
  { value: 'Fanta - Bottle', label: 'Fanta - Bottle - NRs 500', price: 500 },

  // Sprite
  { value: 'Sprite - Glass', label: 'Sprite - Glass - NRs 110', price: 110 },
  { value: 'Sprite - Bottle', label: 'Sprite - Bottle - NRs 500', price: 500 },
  { value: 'Lemon Sprite', label: 'Lemon Sprite - NRs 130', price: 130 },

  // BEER
  { value: 'Gorkha Strong', label: 'Gorkha Strong - NRs 520', price: 520 },
  { value: 'Gorkha Strong (Prime)', label: 'Gorkha Strong (Prime) - NRs 290', price: 290 },
  { value: 'Gorkha Premium', label: 'Gorkha Premium - NRs 600', price: 600 },
  { value: 'Tuborg Strong', label: 'Tuborg Strong - NRs 550', price: 550 },
  { value: 'Tuborg Gold', label: 'Tuborg Gold - NRs 650', price: 650 },
  { value: 'Barahsinghe', label: 'Barahsinghe - Nrs 630', price: 630 },
  { value: 'Carlsberg', label: 'Carlsberg - Nrs 690', price: 690 },

  // Vodka
  { value: '8848 - 30ml', label: '8848 Vodka - 30ml - NRs 190', price: 190 },
  { value: '8848 - 60ml', label: '8848 Vodka - 60ml - NRs 360', price: 360 },
  { value: '8848 - 90ml', label: '8848 Vodka - 90ml - NRs 520', price: 520 },
  { value: '8848 - 180ml', label: '8848 Vodka - 180ml - NRs 920', price: 920 },
  { value: '8848 - 750ml Bottle', label: '8848 Vodka - Bottle - NRs 3600', price: 3600 },

  { value: 'Nude - 30ml', label: 'Nude Vodka - 30ml - NRs 390', price: 390 },
  { value: 'Nude - 60ml', label: 'Nude Vodka - 60ml - NRs 390', price: 390 },
  { value: 'Nude - 90ml', label: 'Nude Vodka - 90ml - NRs 390', price: 390 },
  { value: 'Nude - 180ml', label: 'Nude Vodka - 180ml - NRs 990', price: 990 },
  { value: 'Nude - 750ml Bottle', label: 'Nude Vodka - Bottle - NRs 3700', price: 3700 },

  { value: 'Absolute - 60ml', label: 'Absolute Vodka - 60ml - NRs 820', price: 820 },
  { value: 'Absolute - 180ml', label: 'Absolute Vodka - 180ml - NRs 2100', price: 2100 },
  { value: 'Absolute - Large Bottle', label: 'Absolute Vodka - Large Bottle - NRs 11000', price: 11000 },

  // Whisky
  { value: 'Old Durbar Regular - 60ml', label: 'Old Durbar Regular - 60ml - NRs 450', price: 450 },
  { value: 'Old Durbar Regular - 180ml', label: 'Old Durbar Regular - 180ml - NRs 1050', price: 1050 },
  { value: 'Old Durbar Regular - Bottle', label: 'Old Durbar Regular - Bottle - NRs 4500', price: 4500 },

  { value: 'Old Durbar Chimney - 60ml', label: 'Old Durbar Chimney - 60ml - NRs 630', price: 630 },
  { value: 'Old Durbar Chimney - 180ml', label: 'Old Durbar Chimney - 180ml - NRs 1500', price: 1500 },
  { value: 'Old Durbar Chimney - Bottle', label: 'Old Durbar Chimney - Bottle - NRs 5900', price: 5900 },

  { value: 'Gurkhas & Guns - 60ml', label: 'Gurkhas & Guns - 60ml - NRs 490', price: 490 },
  { value: 'Gurkhas & Guns - 180ml', label: 'Gurkhas & Guns - 180ml - NRs 1230', price: 1230 },
  { value: 'Gurkhas & Guns - Bottle', label: 'Gurkhas & Guns - Bottle - NRs 4560', price: 4560 },

  { value: 'Jack Daniel - 60ml', label: 'Jack Daniel - 60ml - NRs 830', price: 830 },
  { value: 'Jack Daniel - 180ml', label: 'Jack Daniel - 180ml - NRs 2400', price: 2400 },
  { value: 'Jack Daniel - Bottle', label: 'Jack Daniel - Bottle - NRs 12000', price: 12000 },

  { value: 'Glenfiddhich 12Y - 60ml', label: 'Glenfiddhich 12Y - 60ml - NRs 1600', price: 1600 },
  { value: 'Glenfiddhich 12Y - 180ml', label: 'Glenfiddhich 12Y - 180ml - NRs 3900', price: 3900 },
  { value: 'Glenfiddhich 12Y - Bottle', label: 'Glenfiddhich 12Y - Bottle - NRs 18500', price: 18500 },

  { value: 'JW Double Black - 60ml', label: 'JW Double Black - 60ml - NRs 1200', price: 1200 },
  { value: 'JW Double Black - 180ml', label: 'JW Double Black - 180ml - NRs 3000', price: 3000 },
  { value: 'JW Double Black - Bottle', label: 'JW Double Black - Bottle - NRs 15600', price: 15600 },

  { value: 'JW Black Label - 60ml', label: 'JW Black Label - 60ml - NRs 1060', price: 1060 },
  { value: 'JW Black Label - 180ml', label: 'JW Black Label - 180ml - NRs 2600', price: 2600 },
  { value: 'JW Black Label - Bottle', label: 'JW Black Label - Bottle - NRs 13800', price: 13800 },

  { value: 'Chivas Regal 12Y - 60ml', label: 'Chivas Regal 12Y - 60ml - NRs 1130', price: 1130 },
  { value: 'Chivas Regal 12Y - 180ml', label: 'Chivas Regal 12Y - 180ml - NRs 2700', price: 2700 },
  { value: 'Chivas Regal 12Y - Bottle', label: 'Chivas Regal 12Y - Bottle - NRs 13800', price: 13800 },

  { value: 'Jameson - 60ml', label: 'Jameson - 60ml - NRs 930', price: 930 },
  { value: 'Jameson - 180ml', label: 'Jameson - 180ml - NRs 2250', price: 2250 },
  { value: 'Jameson - Bottle', label: 'Jameson - Bottle - NRs 11990', price: 11990 },

  // Liqueur
  { value: 'Baileys - 30ml', label: 'Baileys - 30ml - NRs 500', price: 500 },
  { value: 'Baileys - 60ml', label: 'Baileys - 60ml - NRs 1000', price: 1000 },

  { value: 'Triple Sec - 30ml', label: 'Triple Sec - 30ml - NRs 350', price: 350 },
  { value: 'Triple Sec - 60ml', label: 'Triple Sec - 60ml - NRs 700', price: 700 },

  // Hookah
  { value: 'Hookah (Cloud)', label: 'Hookah (Cloud) - NRs 390', price: 390 },
  { value: 'Ice Hookah', label: 'Ice Hookah - NRs 430', price: 430 },
  { value: 'Lemon Hookah', label: 'Lemon Hookah - NRs 450', price: 450 },
  { value: 'Hybe Hookah (Seasonal Fruit)', label: 'Hybe Hookah (Seasonal Fruit) - NRs 550', price: 550 },
  { value: 'Hybe Hookah (Blueberry)', label: 'Hybe Hookah (Blueberry) - NRs 590', price: 590 },

  // Hookah Tobacco
  { value: 'Shikhar Ice', label: 'Shikhar Ice - NRs 25', price: 25 },
  { value: 'Surya Red', label: 'Surya Red - NRs 30', price: 30 },
  { value: 'Surya Light', label: 'Surya Light - NRs 30', price: 30 },
       
    
        { value: 'Hookah refill', label: 'Hookah refill - NRs 300', price: 300 },

        { value: 'Hookah morning', label: 'Hookah morning - NRs 350', price: 350 },


        { value: 'Coil', label: 'Coil - NRs 50', price: 50 },

         // Rum
{ value: 'Khukrirum Light - 30 ml', label: 'Khukrirum Light - 30 ml - NRs 180', price: 180 },
 
{ value: 'Khukri Rum light - 60ml', label: 'Khukri Rum light - 60ml - NRs 350', price: 350 },
  { value: 'Khukri Rum light - 180ml', label: 'Khukri Rum light - 180ml - NRs 1000', price: 1000 },
  { value: 'Khukri Rum light - Bottle', label: 'Khukri Rum light - Bottle - NRs 3600', price: 3600 },
  { value: 'Khukri Rum dark - 60ml', label: 'Khukri Rum dark - 60ml - NRs 350', price: 350 },
  { value: 'Khukri Rum dark - 180ml', label: 'Khukri Rum dark - 180ml - NRs 1000', price: 1000 },
  { value: 'Khukri Rum dark - Bottle', label: 'Khukri Rum dark - Bottle - NRs 3600', price: 3600 },
  { value: 'Khukri Spiced Rum - 60ml', label: 'Khukri Spiced Rum - 60ml - NRs 390', price: 390 },
  { value: 'Khukri Spiced Rum - 180ml', label: 'Khukri Spiced Rum - 180ml - NRs 1120', price: 1120 },
  { value: 'Khukri Spiced Rum - Bottle', label: 'Khukri Spiced Rum - Bottle - NRs 3600', price: 3600 },

  // Gin
  { value: 'Beefeater - 30ml', label: 'Beefeater - 30ml - NRs 390', price: 390 },
  { value: 'Beefeater - 60ml', label: 'Beefeater - 60ml - NRs 780', price: 780 },
  { value: 'Snow man - 30ml', label: 'Snow man - 30ml - NRs 175', price: 175 },
  { value: 'Snow man - 60ml', label: 'Snow man - 60ml - NRs 350', price: 350 },

  // Tequila
  { value: 'Agavita silver - 30ml', label: 'Agavita silver - 30ml - NRs 455', price: 455 },
  { value: 'Agavita silver - 60ml', label: 'Agavita silver - 60ml - NRs 910', price: 910 },

  // Wine
  { value: 'Jacob Creek Red Wine (Merlot Shiraz)', label: 'Jacob Creek Red Wine (Merlot Shiraz) - NRs 3200', price: 3200 },
  { value: 'Jacob Creek White Wine (Cardonnay)', label: 'Jacob Creek White Wine (Cardonnay) - NRs 3200', price: 3200 },
  { value: 'Rose Wine (Moscato)', label: 'Rose Wine (Moscato) - NRs 3100', price: 3100 },
  { value: 'Sparkling Wine (Calvet)', label: 'Sparkling Wine (Calvet) - NRs 3900', price: 3900 },
  { value: 'Jp.chenet', label: 'Jp.chenet - NRs 3900', price: 3900 },

  { value: 'Big master', label: 'Big master - NRs 1400', price: 1400 },

  // Cocktail
  { value: 'cosmopolitan', label: 'cosmopolitan - NRs 500', price: 500 },
  { value: 'Espresso Martini', label: 'Espresso Martini - NRs 590', price: 590 },
  { value: 'Whisky Sour', label: 'Whisky Sour - NRs 510', price: 510 },
  { value: 'Classic Mojito', label: 'Classic Mojito - NRs 460', price: 460 },
  { value: 'Blue Lagoon', label: 'Blue Lagoon - NRs 460', price: 460 },
  { value: 'Cape Cod', label: 'Cape Cod - NRs 440', price: 440 },
  { value: 'Screw Driver', label: 'Screw Driver - NRs 440', price: 440 },
  { value: 'Cuba Libre', label: 'Cuba Libre - NRs 450', price: 450 },
  { value: 'Long Island Tea', label: 'Long Island Tea - NRs 730', price: 730 },
  { value: 'Daiquiri', label: 'Daiquiri - NRs 450', price: 450 },
  { value: 'Margarita', label: 'Margarita - NRs 490', price: 490 },
  { value: 'Kamikaze', label: 'Kamikaze - NRs 490', price: 490 },
  { value: 'Hot Rum Punch', label: 'Hot Rum Punch - NRs 450', price: 450 },
  { value: 'Sex on the beach', label: 'Sex on the beach - NRs 500', price: 500 },

  { value: 'Red bull', label: 'Red bull - NRs 300', price: 300 },

  
  // Mocktail
  { value: 'Blue Angel', label: 'Blue Angel - NRs 300', price: 300 },
  { value: 'Coco rush', label: 'Coco rush - NRs 320', price: 320 },
  { value: 'Virgin Mojito', label: 'Virgin Mojito - NRs 280', price: 280 },
  { value: 'Cinderella', label: 'Cinderella - NRs 480', price: 480 },
  { value: 'Lady on the beach', label: 'Lady on the beach - NRs 430', price: 430 },
  { value: 'Purple Galaxy', label: 'Purple Galaxy - NRs 430', price: 430 },
  { value: 'Watermelon Mojito', label: 'Watermelon Mojito - NRs 380', price: 380 },

  // Shots
  { value: 'B-52', label: 'B-52 - NRs 590', price: 590 },
  { value: 'Brain Damage', label: 'Brain Damage - NRs 565', price: 565 },
  { value: 'Kamikaze Shot', label: 'Kamikaze Shot - NRs 500', price: 500 },
  { value: 'Jager bomb', label: 'Jager bomb - NRs 595', price: 595 },
  { value: 'Flaming Lambo', label: 'Flaming Lambo - NRs 1400', price: 1400 },

  { value: 'Jägermeister -30ml', label: 'Jägermeister 30ml - NRs 400', price: 400 },
  { value: 'Jägermeister -60ml', label: 'Jägermeister -60ml - NRs 750', price: 750 },


        // Espresso Brew (Barista Menu)
        { value: 'Ristretto', label: 'Ristretto - NRs 90', price: 90 },
        { value: 'Espresso', label: 'Espresso - NRs 100', price: 100 },
        { value: 'Espresso Macchiato', label: 'Espresso Macchiato - NRs 120', price: 120 },
        { value: 'Espresso shake', label: 'Espresso shake - NRs 125', price: 125 },
        { value: 'Americano Single', label: 'Americano (Single) - NRs 125', price: 125 },
        { value: 'Americano Double', label: 'Americano (Double) - NRs 135', price: 135 },
        { value: 'Lungo Single', label: 'Lungo (Single) - NRs 135', price: 135 },
        { value: 'Lungo Double', label: 'Lungo (Double) - NRs 145', price: 145 },
        { value: 'Doppio', label: 'Doppio - NRs 130', price: 130 },
        { value: 'Espresso Affagato', label: 'Espresso Affagato - NRs 210', price: 210 },

  // Milkshake
  { value: 'Chocolate Shake', label: 'Chocolate Shake - NRs 270', price: 270 },
  { value: 'Strawberry Shake', label: 'Strawberry Shake - NRs 270', price: 270 },
  { value: 'Vanilla Shake', label: 'Vanilla Shake - NRs 270', price: 270 },
  { value: 'Caramel Shake', label: 'Caramel Shake - NRs 270', price: 270 },
  { value: 'Blue Berry Shake', label: 'Blue Berry Shake - NRs 270', price: 270 },
  { value: 'Oreo Milkshake', label: 'Oreo Milkshake - NRs 285', price: 285 },
  { value: 'Kitkat Milkshake', label: 'Kitkat Milkshake - NRs 315', price: 315 },

  // Cappuccino Brew (Hot Beverage)
  { value: 'Flavored Latte', label: 'Flavored Latte - Chocolate/Strawberry/Vanilla/Caramel/Honey - NRs 230', price: 230 },
 
  { value: 'Latte Single', label: 'Latte (Single) - NRs 165', price: 165 },
  { value: 'Latte Double', label: 'Latte (Double) - NRs 245', price: 245 },
  { value: 'Cappuccino Single', label: 'Cappuccino (Single) - NRs 170', price: 170 },
  { value: 'Cappuccino Double', label: 'Cappuccino (Double) - NRs 250', price: 250 },
  { value: 'Hot Chocolate', label: 'Hot Chocolate - NRs 230', price: 230 },
  { value: 'Hot Lemon Honey', label: 'Hot Lemon with Honey - NRs 130', price: 130 },
  { value: 'Hot Lemon Honey Ginger', label: 'Hot Lemon with Honey and Ginger - NRs 150', price: 150 },


  // Smoothies
  { value: 'Banana Smoothie', label: 'Banana Smoothie - NRs 180', price: 180 },
  { value: 'Blueberry Smoothie', label: 'Blueberry Smoothie - NRs 200', price: 200 },
  { value: 'Apple Smoothie', label: 'Apple Smoothie - NRs 230', price: 230 },

  // Lassi
  { value: 'Plain Lassi', label: 'Plain Lassi - NRs 130', price: 130 },
  { value: 'Sweet Lassi', label: 'Sweet Lassi - NRs 160', price: 160 },
  { value: 'Vanilla Lassi', label: 'Vanilla Lassi - NRs 190', price: 190 },
  { value: 'Caramel Lassi', label: 'Caramel Lassi - NRs 190', price: 190 },
  { value: 'Banana Lassi', label: 'Banana Lassi - NRs 180', price: 180 },
  { value: 'Apple Lassi', label: 'Apple Lassi - NRs 230', price: 230 },
  { value: 'Mix Fruit Lassi', label: 'Mix Fruit Lassi - NRs 260', price: 260 },

  // Iced Cold Beverage
  { value: 'Ice Americano Single', label: 'Ice Americano (Single) - NRs 155', price: 155 },
  { value: 'Ice Americano Double', label: 'Ice Americano (Double) - NRs 245', price: 245 },
  { value: 'Iced Latte', label: 'Iced Latte - NRs 180', price: 180 },
  { value: 'Iced Mocha', label: 'Iced Mocha - NRs 230', price: 230 },
  { value: 'Peach Iced Tea', label: 'Peach Iced Tea - NRs 190', price: 190 },
  { value: 'Lemon Iced Tea', label: 'Lemon Iced Tea - NRs 190', price: 190 },
  { value: 'Ice Caramel Macchiato', label: 'Ice Caramel Macchiato - NRs 210', price: 210 },
  { value: 'Ice Blended Mocha', label: 'Ice Blended Mocha - NRs 230', price: 230 },
  { value: 'Lemonade', label: 'Lemonade - NRs 190', price: 190 },
  { value: 'Mint Lemonade', label: 'Mint Lemonade - NRs 220', price: 220 },

  // Tea
  { value: 'Black Tea', label: 'Black Tea - NRs 50', price: 50 },
  { value: 'Lemon Tea', label: 'Lemon Tea - NRs 65', price: 65 },
  { value: 'Milk Tea', label: 'Milk Tea - NRs 75', price: 75 },
  { value: 'Green Tea', label: 'Green Tea - NRs 90', price: 90 },

  // Ice Cream
  { value: 'Chocolate Ice Cream', label: 'Chocolate Ice Cream - NRs 150', price: 150 },
{ value: 'Vanilla Ice Cream', label: 'Vanilla Ice Cream - NRs 150', price: 150 },
{ value: 'Strawberry Ice Cream', label: 'Strawberry Ice Cream - NRs 150', price: 150 },
{ value: 'Butterscotch Ice Cream', label: 'Butterscotch Ice Cream - NRs 150', price: 150 },


    // Breakfast
    { value: 'Continental breakfast', label: 'Continental breakfast - NRs 520', price: 520 },
    { value: 'Nepali breakfast', label: 'Nepali breakfast - NRs 550', price: 550 },
    { value: 'Choice of eggs', label: 'Choice of eggs - NRs 220', price: 220 },
    { value: 'Fruit punch', label: 'Fruit punch - NRs 430', price: 430 },
    { value: 'Citrus salad', label: 'Citrus salad - NRs 280', price: 280 },
    // { value: 'Sandwich veg', label: 'Sandwich veg - NRs 230', price: 230 },
    // { value: 'Sandwich non-veg', label: 'Sandwich non-veg - NRs 280', price: 280 },
    { value: 'Mix veg puree soup', label: 'Mix veg puree soup - NRs 250', price: 250 },
    { value: 'Cream of mushroom soup', label: 'Cream of mushroom soup - NRs 250', price: 250 },
    { value: 'Saute vegetable', label: 'Saute vegetable - NRs 180', price: 180 },

      ];

    
      const router = useRouter();

    const validateForm = () => {
        const newErrors = {};
        
        if (!newOrdertitle) {
            newErrors.order_title = "Please select an item";
        }
        
        if (!order_type) {
            newErrors.order_type = "Please select order type";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
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
        
        // Clear error if item is selected
        if (selectedOption.value && errors.order_title) {
            setErrors(prev => ({...prev, order_title: ""}));
        }
    }

    const incrementQuantity = () => {
        setOrderQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (order_quantity > 1) {
            setOrderQuantity(prev => prev - 1);
        }
    };

    const handleOrderTypeSelect = (type) => {
        setOrderType(type);
        
        // Clear error if type is selected
        if (type && errors.order_type) {
            setErrors(prev => ({...prev, order_type: ""}));
        }
    };

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
                    
                    <div className="max-w-3xl mx-auto p-4 mt-8">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4 text-center">Add New Order</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Order Selection */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 mb-1 text-sm font-medium">Select Item</label>
                                        <Select 
                                            options={options}
                                            onChange={Dropdown}
                                            value={{ value: newOrdertitle, label: newOrdertitle }}
                                            styles={{
                                                control: (provided, state) => ({ 
                                                    ...provided, 
                                                    backgroundColor: '#2d3748',
                                                    borderColor: errors.order_title ? '#e53e3e' : state.isFocused ? '#4a5568' : '#4a5568',
                                                    color: 'white',
                                                    minHeight: '40px',
                                                    fontSize: '14px',
                                                    boxShadow: errors.order_title ? '0 0 0 1px #e53e3e' : provided.boxShadow,
                                                }),
                                                menu: (provided) => ({ 
                                                    ...provided, 
                                                    backgroundColor: '#2d3748',
                                                    color: 'white'
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
                                            placeholder="Search for menu items..."
                                        />
                                        {errors.order_title && (
                                            <p className="text-red-400 text-xs mt-1 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.order_title}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Price Display */}
                                    <div>
                                        <label className="block text-gray-300 mb-1 text-sm font-medium">Price</label>
                                        <div className="bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm">
                                            NRs. {order_price || "0"}
                                        </div>
                                    </div>
                                    
                                    {/* Quantity Selector */}
                                    <div>
                                        <label className="block text-gray-300 mb-1 text-sm font-medium">Quantity</label>
                                        <div className="flex items-center h-9">
                                            <button 
                                                type="button"
                                                onClick={decrementQuantity}
                                                className="bg-gray-600 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-1 px-3 rounded-l"
                                            >
                                                -
                                            </button>
                                            <div className="bg-gray-700 text-white text-center py-1 px-4 w-12 border-y border-gray-600 text-sm">
                                                {order_quantity}
                                            </div>
                                
                                            <button 
                                                type="button"
                                                onClick={incrementQuantity}
                                                className="bg-gray-600 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-1 px-3 rounded-r"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Order Type Selection */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 mb-1 text-sm font-medium">Order Type</label>
                                        {errors.order_type && (
                                            <p className="text-red-400 text-xs mb-1 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.order_type}
                                            </p>
                                        )}
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOrderTypeSelect("Kitchen")}
                                                className={`flex-1 py-2 px-3 rounded text-center text-sm font-medium transition-all duration-200 ${
                                                    order_type === "Kitchen" 
                                                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow" 
                                                    : errors.order_type 
                                                        ? "bg-red-900 text-white border border-red-600" 
                                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                }`}
                                            >
                                                Kitchen
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleOrderTypeSelect("Bar")}
                                                className={`flex-1 py-2 px-3 rounded text-center text-sm font-medium transition-all duration-200 ${
                                                    order_type === "Bar" 
                                                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow" 
                                                    : errors.order_type 
                                                        ? "bg-red-900 text-white border border-red-600" 
                                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                }`}
                                            >
                                                Bar
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 mb-1 text-sm font-medium">Special Instructions</label>
                                        <input
                                            onChange={(e) => setDescription(e.target.value)}
                                            value={order_description}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            type="text"
                                            placeholder="Any special requests or notes"
                                        />
                                    </div>
                                    
                                    {/* Table ID Display */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 mb-1 text-sm font-medium">Table Number</label>
                                        <div className="bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm">
                                            {id}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-4xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded shadow transition-all duration-200"
                                    >
                                        Add Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <style jsx>{`
                    .navbar {
                        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
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