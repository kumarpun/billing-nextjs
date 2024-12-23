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
    // const [order_type, setOrderType] = useState("Kitchen");
    const [order_type, setOrderType] = useState(""); // Initially empty

    const options = [
      // kitchen menu
      { value: 'Kitchen menu', label: 'Kitchen menu', price: 0 },
     // veg starter
     { value: 'Dynamite Fries - veg', label: 'Dynamite Fries veg - NRs 230', price: 230 },
     { value: 'Veg Crispy', label: 'Veg Crispy - NRs 210', price: 210 },
     { value: 'Chilly Paneer', label: 'Chilly Paneer - NRs 390', price: 390 },
     { value: 'Corn salt & Pepper', label: 'Corn salt & Pepper - NRs 250', price: 250 },
     { value: 'Aloo Papdi Chat', label: 'Aloo Papdi Chat - NRs 200', price: 200 },
     { value: 'French Fries', label: 'French Fries - NRs 95', price: 95 },
     { value: 'Veg Bullet', label: 'Veg Bullet - NRs 150', price: 150 },
     { value: 'Cheese Ball', label: 'Cheese Ball - NRs 290', price: 290 },
     { value: 'Chilly Mushroom', label: 'Chilly Mushroom - NRs 280', price: 280 },
     { value: 'Afgani Fries', label: 'Afgani Fries - NRs 170', price: 170 },
     { value: 'Bolled Vegetables', label: 'Bolled Vegetables - NRs 150', price: 150 },
     { value: 'Mushroom Steak', label: 'Mushroom Steak - NRs 200', price: 200 },
     { value: 'Paneer Steak', label: 'Paneer Steak - NRs 350', price: 350 },
     { value: 'Jalapeno Poppers', label: 'Jalapeno Poppers - NRs 250', price: 250 },
   
     // NEPALI CUISINE
     { value: 'Chicken Choila', label: 'Chicken Choila - NRs 300', price: 300 },
     { value: 'Chicken Tass', label: 'Chicken Tass - NRs 350', price: 350 },
     { value: 'Chicken Sadheko Fry/Boill', label: 'Chicken Sadheko Fry/Boill - NRs 250', price: 250 },
     { value: 'Peanul Sadheko', label: 'Peanul Sadheko - NRs 180', price: 180 },
     { value: 'Wal Wal Sadheko', label: 'Wal Wal Sadheko - NRs 140', price: 140 },
     { value: 'Chicken Sutuki', label: 'Chicken Sutuki - NRs 320', price: 320 },
     { value: 'Buff Sukuti', label: 'Buff Sukuti - NRs 300', price: 300 },
     { value: 'Buff Choila', label: 'Buff Choila - NRs 360', price: 360 },
     { value: 'Chicken Chatpate', label: 'Chicken Chatpate - NRs 250', price: 250 },
     { value: 'Sukuti Chatpate Buff', label: 'Sukuti Chatpate Buff - NRs 270', price: 270 },
     { value: 'Timur Chicken', label: 'Timur Chicken - NRs 300', price: 300 },
   
     // NON-VEG STARTER
     { value: 'Dynamite Fries', label: 'Dynamite Fries - NRs 220', price: 220 },
     { value: 'Chilly Chicken', label: 'Chilly Chicken - NRs 350', price: 350 },
     { value: 'Hot Wings', label: 'Hot Wings - NRs 390', price: 390 },
     { value: 'Kungpao Chicken', label: 'Kungpao Chicken - NRs 390', price: 390 },
     { value: 'Pepper Chicken', label: 'Pepper Chicken - NRs 330', price: 330 },
     { value: 'Chicken 65', label: 'Chicken 65 - NRs 350', price: 350 },
     { value: 'Hunan Chicken', label: 'Hunan Chicken - NRs 430', price: 430 },
     { value: 'Finger Chicken', label: 'Finger Chicken - NRs 330', price: 330 },
     { value: 'Chicken Steak', label: 'Chicken Steak - NRs 390', price: 390 },
     { value: 'Chicken Crispy', label: 'Chicken Crispy - NRs 340', price: 340 },
     { value: 'Periperi Chicken', label: 'Periperi Chicken - NRs 350', price: 350 },
     { value: 'Dragon Chicken', label: 'Dragon Chicken - NRs 350', price: 350 },
     { value: 'Drumstick Chicken', label: 'Drumstick Chicken - NRs 390', price: 390 },
     { value: 'Buffalo Wild Wings', label: 'Buffalo Wild Wings - NRs 380', price: 380 },
     { value: 'Szechuan Chicken', label: 'Szechuan Chicken - NRs 320', price: 320 },
     { value: 'Chilly Sausage', label: 'Chilly Sausage - NRs 250', price: 250 },
     { value: 'Crown Chicken', label: 'Crown Chicken - NRs 450', price: 450 },

       // SALAD
       { value: 'Green Salad', label: 'Green Salad - NRs 165', price: 165 },
       { value: 'Fruit Salad', label: 'Fruit Salad - NRs 320', price: 320 },
       { value: 'Russian Salad', label: 'Russian Salad - NRs 250', price: 250 },
       { value: 'Yogurt Cucumber Salad', label: 'Yogurt Cucumber Salad - NRs 230', price: 230 },
       { value: 'Eggmayo Salad', label: 'Eggmayo Salad - NRs 300', price: 300 },
       { value: 'Cheese Cheery Pineapple', label: 'Cheese Cheery Pineapple - NRs 210', price: 210 },
       { value: 'Nepali Salad', label: 'Nepali Salad - NRs 140', price: 140 },
       { value: 'Classic Salad', label: 'Classic Salad - NRs 250', price: 250 },
       { value: 'Classic Salad - boiled chicken', label: 'Classic Salad boiled chicken - NRs 350', price: 350 },

       // SOUP
       { value: 'Manchow Soup (Veg)', label: 'Manchow Soup (Veg) - NRs 160', price: 160 },
       { value: 'Manchow Soup (Non-Veg)', label: 'Manchow Soup (Non-Veg) - NRs 220', price: 220 },
       { value: 'Hot & Sour Soup (Veg)', label: 'Hot & Sour Soup (Veg) - NRs 150', price: 150 },
       { value: 'Hot & Sour Soup (Non-Veg)', label: 'Hot & Sour Soup (Non-Veg) - NRs 200', price: 200 },
       { value: 'Clear Soup (Veg)', label: 'Clear Soup (Veg) - NRs 140', price: 140 },
       { value: 'Clear Soup (Non-Veg)', label: 'Clear Soup (Non-Veg) - NRs 180', price: 180 },
       { value: 'Avocado Cold Soup', label: 'Avocado Cold Soup - NRs 170', price: 170 },
       { value: 'Yogurt Cucumber Cold Soup', label: 'Yogurt Cucumber Cold Soup - NRs 180', price: 180 },
       { value: 'Mushroom Soup', label: 'Mushroom Soup - NRs 190', price: 190 },

       // INDIAN CUISINE
       { value: 'Chicken Curry', label: 'Chicken Curry - NRs 320', price: 320 },
       { value: 'Chicken Rogan Josh', label: 'Chicken Rogan Josh - NRs 320', price: 320 },

       // LAPHING
       { value: 'Laphing', label: 'Laphing - NRs 90', price: 90 },
       { value: 'Chicken Laphing', label: 'Chicken Laphing - NRs 210', price: 210 },
       { value: 'Soupy Chauchau Laphing', label: 'Soupy Chauchau Laphing - NRs 110', price: 110 },
       { value: 'Soupy Peanuts Laphing', label: 'Soupy Peanuts Laphing - NRs 130', price: 130 },
       { value: 'Soupy Plain Laphing', label: 'Soupy Plain Laphing - NRs 90', price: 90 },

       { value: 'Sizzler veg', label: 'Sizzler veg - NRs 470', price: 470 },
       { value: 'Sizzler non-veg', label: 'Sizzler non-veg - NRs 590', price: 590 },
       { value: 'Hybe special', label: 'Hybe special - NRs 1000', price: 1000 },
       { value: 'Chinese Platter', label: 'Chinese Platter - NRs 1050', price: 1050 },

       // BREAD
       { value: 'Crunchy Bread', label: 'Crunchy Bread - NRs 75', price: 75 },
       { value: 'Garlic Bread', label: 'Garlic Bread - NRs 120', price: 120 },
       { value: 'Cheese Bread', label: 'Cheese Bread - NRs 150', price: 150 },
       { value: 'Bread Omelette', label: 'Bread Omelette - NRs 150', price: 150 },
       { value: 'Veg Sandwich', label: 'Veg Sandwich - NRs 230', price: 230 },
       { value: 'Non-Veg Sandwich', label: 'Non-Veg Sandwich - NRs 280', price: 280 },
       { value: 'Grilled Veg Sandwich', label: 'Grilled Veg Sandwich - NRs 240', price: 240 },
       { value: 'Grilled Non-Veg Sandwich', label: 'Grilled Non-Veg Sandwich - NRs 290', price: 290 },
       { value: 'Club Sandwich', label: 'Club Sandwich - NRs 350', price: 350 },
     
       // MO:MO
       { value: 'Steam Veg MO:MO', label: 'Steam Veg MO:MO - NRs 130', price: 130 },
       { value: 'Steam Chicken MO:MO', label: 'Steam Chicken MO:MO - NRs 180', price: 180 },
       { value: 'Steam Buff MO:MO', label: 'Steam Buff MO:MO - NRs 200', price: 200 },
       { value: 'Chilly Veg MO:MO', label: 'Chilly Veg MO:MO - NRs 180', price: 180 },
       { value: 'Chilly Chicken MO:MO', label: 'Chilly Chicken MO:MO - NRs 220', price: 220 },
       { value: 'Chilly Buff MO:MO', label: 'Chilly Buff MO:MO - NRs 240', price: 240 },
       { value: 'Afghani Veg MO:MO', label: 'Afghani Veg MO:MO - NRs 200', price: 200 },
       { value: 'Afghani Chicken MO:MO', label: 'Afghani Chicken MO:MO - NRs 280', price: 280 },
       { value: 'Afghani Buff MO:MO', label: 'Afghani Buff MO:MO - NRs 300', price: 300 },
       { value: 'Crunchy Veg MO:MO', label: 'Crunchy Veg MO:MO - NRs 190', price: 190 },
       { value: 'Crunchy Chicken MO:MO', label: 'Crunchy Chicken MO:MO - NRs 230', price: 230 },
       { value: 'Crunchy Buff MO:MO', label: 'Crunchy Buff MO:MO - NRs 250', price: 250 },
       { value: 'Fried Veg MO:MO', label: 'Fried Veg MO:MO - NRs 150', price: 150 },
       { value: 'Fried Chicken MO:MO', label: 'Fried Chicken MO:MO - NRs 200', price: 200 },
       { value: 'Fried Buff MO:MO', label: 'Fried Buff MO:MO - NRs 220', price: 220 },
       { value: 'Jhol Veg MO:MO', label: 'Jhol Veg MO:MO - NRs 180', price: 180 },
       { value: 'Jhol Chicken MO:MO', label: 'Jhol Chicken MO:MO - NRs 220', price: 220 },
       { value: 'Jhol Buff MO:MO', label: 'Jhol Buff MO:MO - NRs 240', price: 240 },
       { value: 'Kothe Veg MO:MO', label: 'Kothe Veg MO:MO - NRs 170', price: 170 },
       { value: 'Kothe Chicken MO:MO', label: 'Kothe Chicken MO:MO - NRs 210', price: 210 },
       { value: 'Kothe Buff MO:MO', label: 'Kothe Buff MO:MO - NRs 230', price: 230 },
       { value: 'Sadheko Veg MO:MO', label: 'Sadheko Veg MO:MO - NRs 180', price: 180 },
       { value: 'Sadheko Chicken MO:MO', label: 'Sadheko Chicken MO:MO - NRs 250', price: 250 },
       { value: 'Sadheko Buff MO:MO', label: 'Sadheko Buff MO:MO - NRs 270', price: 270 },
     
       // PASTA
       { value: 'Veg Pasta (White)', label: 'Veg Pasta (White) - NRs 280', price: 280 },
       { value: 'Veg Pasta (Red)', label: 'Veg Pasta (Red) - NRs 280', price: 280 },
       { value: 'Veg Pasta (Mixed)', label: 'Veg Pasta (Mixed) - NRs 280', price: 280 },

       { value: 'Non-Veg Pasta (White)', label: 'Non-Veg Pasta (White) - NRs 320', price: 320 },
       { value: 'Non-Veg Pasta (Red)', label: 'Non-Veg Pasta (Red) - NRs 320', price: 320 },
       { value: 'Non-Veg Pasta (Mixed)', label: 'Non-Veg Pasta (Mixed) - NRs 320', price: 320 },
       { value: 'Aglio e Olio Veg', label: 'Aglio e Olio Veg - NRs 290', price: 290 },
       { value: 'Aglio e Olio Non-Veg', label: 'Aglio e Olio Non-Veg - NRs 340', price: 340 },
     
       // BURGER
       { value: 'Veg Burger', label: 'Veg Burger - NRs 210', price: 210 },
       { value: 'Non-Veg Burger', label: 'Non-Veg Burger - NRs 300', price: 300 },
       { value: 'Extra Cheese Veg Burger', label: 'Extra Cheese Veg Burger - NRs 260', price: 260 },
       { value: 'Extra Cheese Non-Veg Burger', label: 'Extra Cheese Non-Veg Burger - NRs 350', price: 350 },
       { value: 'Cottage Cheese Burger', label: 'Cottage Cheese Burger - NRs 360', price: 360 },
     
       // PIZZA
       { value: 'Margherita Pizza', label: 'Margherita Pizza - NRs 400', price: 400 },
       { value: 'Farm House Pizza', label: 'Farm House Pizza - NRs 370', price: 370 },
       { value: 'Chicken Pizza', label: 'Chicken Pizza - NRs 450', price: 450 },
       { value: 'Mushroom Pizza', label: 'Mushroom Pizza - NRs 420', price: 420 },
       { value: 'Sweet Corn Pizza', label: 'Sweet Corn Pizza - NRs 380', price: 380 },
     
       // RICE
       { value: 'Fried Rice (Veg)', label: 'Fried Rice (Veg) - NRs 150', price: 150 },
       { value: 'Fried Rice (Chicken)', label: 'Fried Rice (Chicken) - NRs 190', price: 190 },
       { value: 'Fried Rice (Buff)', label: 'Fried Rice (Buff) - NRs 210', price: 210 },
       { value: 'Fried Rice (Mixed)', label: 'Fried Rice (Mixed) - NRs 260', price: 260 },
       { value: 'Fried Rice (Mixed with buff)', label: 'Fried Rice (Mixed with buff) - NRs 300', price: 300 },

       { value: 'Cilantro Lime Rice (Veg)', label: 'Cilantro Lime Rice (Veg) - NRs 170', price: 170 },
       { value: 'Cilantro Lime Rice (Chicken)', label: 'Cilantro Lime Rice (Chicken) - NRs 210', price: 210 },
       { value: 'Cilantro Lime Rice (Buff)', label: 'Cilantro Lime Rice (Buff) - NRs 230', price: 230 },
       { value: 'Cilantro Lime Rice (Mixed)', label: 'Cilantro Lime Rice (Mixed) - NRs 280', price: 280 },
       { value: 'Pulao (Muttor)', label: 'Pulao (Muttor) - NRs 250', price: 250 },
       { value: 'Pulao (Kashmiri)', label: 'Pulao (Kashmiri) - NRs 300', price: 300 },
       { value: 'Jeera Rice', label: 'Jeera Rice - NRs 150', price: 150 },
       { value: 'Veg Biryani', label: 'Veg Biryani - NRs 350', price: 350 },
       { value: 'Non-Veg Biryani', label: 'Non-Veg Biryani - NRs 450', price: 450 },

       { value: 'Hakka Noodles half (Veg)', label: 'Hakka Noodles half (Veg) - NRs 80', price: 80 },
       { value: 'Hakka Noodles half (Chicken)', label: 'Hakka Noodles half(Chicken) - NRs 100', price: 100 },
       { value: 'Hakka Noodles half (Buff)', label: 'Hakka Noodles half (Buff) - NRs 110', price: 110 },
     
       // NOODLES
       { value: 'Keema Noodles', label: 'Keema Noodles - NRs 200', price: 200 },
       { value: 'Hakka Noodles (Veg)', label: 'Hakka Noodles (Veg) - NRs 150', price: 150 },
       { value: 'Hakka Noodles (Chicken)', label: 'Hakka Noodles (Chicken) - NRs 190', price: 190 },
       { value: 'Hakka Noodles (Buff)', label: 'Hakka Noodles (Buff) - NRs 220', price: 220 },
       { value: 'Singapore Noodles', label: 'Singapore Noodles - NRs 220', price: 220 },
       { value: 'Szechwan Noodles (Veg)', label: 'Szechwan Noodles (Veg) - NRs 170', price: 170 },
       { value: 'Szechwan Noodles (Chicken)', label: 'Szechwan Noodles (Chicken) - NRs 210', price: 210 },
       { value: 'Szechwan Noodles (Buff)', label: 'Szechwan Noodles (Buff) - NRs 230', price: 230 },
       { value: 'Mixed Noodles', label: 'Mixed Noodles - NRs 260', price: 260 },
       { value: 'Thukpa (Veg)', label: 'Thukpa (Veg) - NRs 190', price: 190 },
       { value: 'Thukpa (Chicken)', label: 'Thukpa (Chicken) - NRs 250', price: 250 },
       { value: 'Thukpa (Buff)', label: 'Thukpa (Buff) - NRs 280', price: 280 },
     
       // ROLL
       { value: 'Kathi Roll (Veg)', label: 'Kathi Roll (Veg) - NRs 200', price: 200 },
       { value: 'Kathi Roll (Egg)', label: 'Kathi Roll (Egg) - NRs 250', price: 250 },
       { value: 'Kathi Roll (Chicken)', label: 'Kathi Roll (Chicken) - NRs 310', price: 310 },
       { value: 'Kathi Roll (Paneer)', label: 'Kathi Roll (Paneer) - NRs 350', price: 350 },
       { value: 'Spring Roll (Veg)', label: 'Spring Roll (Veg) - NRs 210', price: 210 },
       { value: 'Spring Roll (Chicken)', label: 'Spring Roll (Chicken) - NRs 320', price: 320 },
       { value: 'Spring Roll (Paneer)', label: 'Spring Roll (Paneer) - NRs 360', price: 360 },
       { value: 'Cheese Roll (Veg)', label: 'Cheese Roll (Veg) - NRs 210', price: 210 },
       { value: 'Cheese Roll (Chicken)', label: 'Cheese Roll (Chicken) - NRs 350', price: 350 },
       { value: 'Cheese Roll (Paneer)', label: 'Cheese Roll (Paneer) - NRs 390', price: 390 },

       { value: 'Peanut', label: 'Peanut - NRs 80', price: 80 },
       { value: 'Honey', label: 'Honey - NRs 50', price: 50 },

      // bar menu
        { value: 'Bar menu', label: 'Bar menu', price: 0 },
        // Soft Drinks
        { value: 'Pineapple Juice - Glass', label: 'Pineapple Juice - Glass - NRs 130', price: 130 },
        { value: 'Pineapple Juice - Bottle', label: 'Pineapple Juice - Bottle - NRs 490', price: 490 },
        { value: 'Orange Juice - Glass', label: 'Orange Juice - Glass - NRs 130', price: 130 },
        { value: 'Orange Juice - Bottle', label: 'Orange Juice - Bottle - NRs 490', price: 490 },
        { value: 'Mango Juice - Glass', label: 'Mango Juice - Glass - NRs 130', price: 130 },
        { value: 'Mango Juice - Bottle', label: 'Mango Juice - Bottle - NRs 490', price: 490 },
        { value: 'Cranberry Juice - Glass', label: 'Cranberry Juice - Glass - NRs 130', price: 130 },
        { value: 'Cranberry Juice - Bottle', label: 'Cranberry Juice - Bottle - NRs 490', price: 490 },
        { value: 'Mix Juice - Glass', label: 'Mix Juice - Glass - NRs 130', price: 130 },
        { value: 'Mix Juice - Bottle', label: 'Mix Juice - Bottle - NRs 490', price: 490 },
        { value: 'Coke - Glass', label: 'Coke - Glass - NRs 90', price: 90 },
        { value: 'Coke - Bottle', label: 'Coke - Bottle - NRs 400', price: 400 },
        { value: 'Fanta - Glass', label: 'Fanta - Glass - NRs 90', price: 90 },
        { value: 'Fanta - Bottle', label: 'Fanta - Bottle - NRs 400', price: 400 },
        { value: 'Sprite - Glass', label: 'Sprite - Glass - NRs 90', price: 90 },
        { value: 'Sprite - Bottle', label: 'Sprite - Bottle - NRs 400', price: 400 },
        { value: 'Lemon Sprite', label: 'Lemon Sprite - NRs 110', price: 110 },

        // Beer
        { value: 'Gorkha Premium', label: 'Gorkha Premium - NRs 500', price: 500 },
        { value: 'Gorkha Strong', label: 'Gorkha Strong - NRs 440', price: 440 },
        { value: 'Tuborg Gold', label: 'Tuborg Gold - NRs 550', price: 550 },
        { value: 'Tuborg Strong', label: 'Tuborg Strong - NRs 460', price: 460 },
        { value: 'Barahsinghe', label: 'Barahsinghe - NRs 530', price: 530 },
        { value: 'Carlsberg', label: 'Carlsberg - NRs 590', price: 590 },
      
        // Vodka
        { value: '8848 - 60ml', label: '8848 - 60ml - NRs 260', price: 260 },
        { value: '8848 - 180ml', label: '8848 - 180ml - NRs 740', price: 740 },
        { value: '8848 - Bottle', label: '8848 - Bottle - NRs 2900', price: 2900 },
        { value: 'Nude - 60ml', label: 'Nude - 60ml - NRs 280', price: 280 },
        { value: 'Nude - 180ml', label: 'Nude - 180ml - NRs 790', price: 790 },
        { value: 'Nude - Bottle', label: 'Nude - Bottle - NRs 2990', price: 2990 },
        { value: 'Absolute - 60ml', label: 'Absolute - 60ml - NRs 590', price: 590 },
        { value: 'Absolute - 180ml', label: 'Absolute - 180ml - NRs 1680', price: 1680 },
        { value: 'Absolute - Bottle', label: 'Absolute - Bottle - NRs 8850', price: 8850 },
      
        // Whisky
        { value: 'Old Durbar Regular - 60ml', label: 'Old Durbar Regular - 60ml - NRs 320', price: 320 },
        { value: 'Old Durbar Regular - 180ml', label: 'Old Durbar Regular - 180ml - NRs 890', price: 890 },
        { value: 'Old Durbar Regular - Bottle', label: 'Old Durbar Regular - Bottle - NRs 3750', price: 3750 },
        { value: 'Old Durbar Chimney - 60ml', label: 'Old Durbar Chimney - 60ml - NRs 450', price: 450 },
        { value: 'Old Durbar Chimney - 180ml', label: 'Old Durbar Chimney - 180ml - NRs 1300', price: 1300 },
        { value: 'Old Durbar Chimney - Bottle', label: 'Old Durbar Chimney - Bottle - NRs 4990', price: 4990 },
        { value: 'Gurkhas & Guns - 60ml', label: 'Gurkhas & Guns - 60ml - NRs 350', price: 350 },
        { value: 'Gurkhas & Guns - 180ml', label: 'Gurkhas & Guns - 180ml - NRs 1030', price: 1030 },
        { value: 'Gurkhas & Guns - Bottle', label: 'Gurkhas & Guns - Bottle - NRs 3800', price: 3800 },
        { value: 'Jack Daniel (JD) - 60ml', label: 'Jack Daniel (JD) - 60ml - NRs 700', price: 700 },
        { value: 'Jack Daniel (JD) - 180ml', label: 'Jack Daniel (JD) - 180ml - NRs 2050', price: 2050 },
        { value: 'Jack Daniel (JD) - Bottle', label: 'Jack Daniel (JD) - Bottle - NRs 10900', price: 10900 },
      
        // Liqueur
        { value: 'Baileys - 30ml', label: 'Baileys - 30ml - NRs 325', price: 325 },
        { value: 'Baileys - 60ml', label: 'Baileys - 60ml - NRs 650', price: 650 },
        { value: 'Triple Sec - 30ml', label: 'Triple Sec - 30ml - NRs 450', price: 450 },
        { value: 'Triple Sec - 60ml', label: 'Triple Sec - 60ml - NRs 900', price: 900 },
      
        // Tobacco
        { value: 'Shikhar Ice', label: 'Shikhar Ice - NRs 25', price: 25 },
        { value: 'Surya Red', label: 'Surya Red - NRs 30', price: 30 },
        { value: 'Surya Light', label: 'Surya Light - NRs 30', price: 30 },
      
        // Hookah
        { value: 'Hookah Cloud', label: 'Hookah Cloud - NRs 390', price: 390 },
        { value: 'Hybe Hookah (Seasonal Fruits)', label: 'Hybe Hookah (Seasonal Fruits) - NRs 550', price: 550 },
        { value: 'Hybe Hookah (Blueberry)', label: 'Hybe Hookah (Blueberry) - NRs 590', price: 590 },
        { value: 'Hookah refill', label: 'Hookah refill - NRs 300', price: 300 },

        { value: 'Coil', label: 'Coil - NRs 50', price: 50 },

         // Rum
{ value: 'Khukrirum Light - 30 ml', label: 'Khukrirum Light - 30 ml - NRs 130', price: 130 },
  { value: 'Khukri Rum Light - 60ml', label: 'Khukri Rum Light - 60ml - NRs 280', price: 280 },
  { value: 'Khukri Rum Light - 180ml', label: 'Khukri Rum Light - 180ml - NRs 800', price: 800 },
  { value: 'Khukri Rum Light - Bottle', label: 'Khukri Rum Light - Bottle - NRs 3100', price: 3100 },
  
  { value: 'Khukrirum Dark -30', label: 'Khukrirum Dark - 30 ml - NRs 110', price: 110 },
  { value: 'Khukri Rum Dark - 60ml', label: 'Khukri Rum Dark - 60ml - NRs 250', price: 250 },
  { value: 'Khukri Rum Dark - 180ml', label: 'Khukri Rum Dark - 180ml - NRs 720', price: 720 },
  { value: 'Khukri Rum Dark - Bottle', label: 'Khukri Rum Dark - Bottle - NRs 2800', price: 2800 },

  { value: 'Khukri spiced rum - 30 ml', label: 'Khukrirum spiced rum - 30 ml - NRs 150', price: 150 },
  { value: 'Khukri Spiced Rum - 60ml', label: 'Khukri Spiced Rum - 60ml - NRs 280', price: 280 },
  { value: 'Khukri Spiced Rum - 180ml', label: 'Khukri Spiced Rum - 180ml - NRs 800', price: 800 },
  { value: 'Khukri Spiced Rum - Bottle', label: 'Khukri Spiced Rum - Bottle - NRs 3100', price: 3100 },

  // Gin
  { value: 'Beefeater - 30ml', label: 'Beefeater - 30ml - NRs 300', price: 300 },
  { value: 'Beefeater - 60ml', label: 'Beefeater - 60ml - NRs 600', price: 600 },

  // Tequila
  { value: 'Agavila Silver - 30ml', label: 'Agavila Silver - 30ml - NRs 350', price: 350 },
  { value: 'Agavila Silver - 60ml', label: 'Agavila Silver - 60ml - NRs 700', price: 700 },

  // Wine
  { value: 'Jacob Creek Red Wine (Merlot/Shiraz)', label: 'Jacob Creek Red Wine (Merlot/Shiraz) - NRs 3200', price: 3200 },
  { value: 'Rose Wine (Moscato)', label: 'Rose Wine (Moscato) - NRs 3100', price: 3100 },
  { value: 'Jacob Creek White Wine (Chardonnay)', label: 'Jacob Creek White Wine (Chardonnay) - NRs 3200', price: 3200 },
  { value: 'Sparkling Wine (Calver)', label: 'Sparkling Wine (Calver) - NRs 3900', price: 3900 },

  // Cocktail
  { value: 'Cosmopolitan', label: 'Cosmopolitan - Vodka, Triple Sec, Cranberry - NRs 500', price: 500 },
  { value: 'Espresso Martini', label: 'Espresso Martini - Vodka, Kahlua, Espresso Shot - NRs 590', price: 590 },
  { value: 'Whisky Sour', label: 'Whisky Sour - Bourbon, Angostura Bitter - NRs 510', price: 510 },
  { value: 'Classic Mojito', label: 'Classic Mojito - Rum, Sprite, Lemon Juice - NRs 460', price: 460 },
  { value: 'Blue Lagoon', label: 'Blue Lagoon - Vodka, Sprite, Blue Curacao - NRs 460', price: 460 },
  { value: 'Cape Cod', label: 'Cape Cod - Vodka, Cranberry - NRs 440', price: 440 },
  { value: 'Screw Driver', label: 'Screw Driver - Vodka, Orange Juice - NRs 440', price: 440 },
  { value: 'Cuba Libre', label: 'Cuba Libre - Light Rum, Coke, Lime Juice - NRs 450', price: 450 },
  { value: 'Long Island Tea', label: 'Long Island Tea - Vodka, Gin, Tequila, Rum, Triple Sec - NRs 730', price: 730 },
  { value: 'Daiquiri', label: 'Daiquiri - Rum, Lime Juice - NRs 450', price: 450 },
  { value: 'Margarita', label: 'Margarita - Tequila, Triple Sec, Lime Juice - NRs 490', price: 490 },
  { value: 'Kamikaze', label: 'Kamikaze - Vodka, Triple Sec, Lime Juice - NRs 490', price: 490 },
  { value: 'Hot Rum Punch', label: 'Hot Rum Punch - NRs 450', price: 450 },
  { value: 'Sex on the Beach', label: 'Sex on the Beach - Vodka, Peach Schnapps - NRs 500', price: 500 },

  { value: 'Chivas Regal 12 yrs - 30', label: 'Chivas Regal 12 yrs - 30 ml - NRs 350', price: 350 },
  { value: 'Chivas Regal 12 yrs - 60', label: 'Chivas Regal 12 yrs - 60 ml - NRs 810', price: 810 },
  { value: 'Chivas Regal 12 yrs - 180', label: 'Chivas Regal 12 yrs - 180 ml - NRs 2250', price: 2250 },
  { value: 'Chivas Regal 12 yrs - bottle', label: 'Chivas Regal 12 yrs - bottle - NRs 11500', price: 11500 },

  { value: 'Red bull', label: 'Red bull - NRs 280', price: 280 },

  // Mocktail
  { value: 'Blue Angel', label: 'Blue Angel - NRs 300', price: 300 },
  { value: 'Coco Rush', label: 'Coco Rush - NRs 320', price: 320 },
  { value: 'Virgin Mojito', label: 'Virgin Mojito - NRs 280', price: 280 },
  { value: 'Cinderella', label: 'Cinderella - NRs 430', price: 430 },
  { value: 'Lady on the Beach', label: 'Lady on the Beach - NRs 430', price: 430 },
  { value: 'Purple Galaxy', label: 'Purple Galaxy - NRs 430', price: 430 },

  // Shots
  { value: 'B-52', label: 'B-52 - Baileys, Vodka, Kahlua - NRs 590', price: 590 },
  { value: 'Brain Damage', label: 'Brain Damage - Peach Schnapps, Grenadine, Baileys - NRs 565', price: 565 },
  { value: 'Kamikaze Shot', label: 'Kamikaze - Vodka, Triple Sec, Fresh Lime - NRs 500', price: 500 },
  { value: 'Jager Bomb', label: 'Jager Bomb - Redbull, Jägermeister - NRs 590', price: 590 },
  { value: 'Flaming Lambo', label: 'Flaming Lambo - NRs 1300', price: 1300 },


        // Espresso Brew (Barista Menu)
  { value: 'Ristretto', label: 'Ristretto - NRs 90', price: 90 },
  { value: 'Espresso', label: 'Espresso - NRs 100', price: 100 },
  { value: 'Espresso Macchiato', label: 'Espresso Macchiato - NRs 120', price: 120 },
  { value: 'Americano (Single)', label: 'Americano (Single) - NRs 125', price: 125 },
  { value: 'Americano (Double)', label: 'Americano (Double) - NRs 135', price: 135 },
  { value: 'Lungo (Single)', label: 'Lungo (Single) - NRs 120', price: 120 },
  { value: 'Lungo (Double)', label: 'Lungo (Double) - NRs 145', price: 145 },
  { value: 'Doppio', label: 'Doppio - NRs 130', price: 130 },
  { value: 'Espresso Affogato', label: 'Espresso Affogato - NRs 190', price: 190 },

  // Milkshake
  { value: 'Chocolate Shake', label: 'Chocolate Shake - NRs 270', price: 270 },
  { value: 'Strawberry Shake', label: 'Strawberry Shake - NRs 270', price: 270 },
  { value: 'Vanilla Shake', label: 'Vanilla Shake - NRs 270', price: 270 },
  { value: 'Caramel Shake', label: 'Caramel Shake - NRs 270', price: 270 },
  { value: 'Blueberry Shake', label: 'Blueberry Shake - NRs 270', price: 270 },
  { value: 'Oreo Milkshake', label: 'Oreo Milkshake - NRs 285', price: 285 },
  { value: 'KitKat Milkshake', label: 'KitKat Milkshake - NRs 315', price: 315 },

  // Cappuccino Brew (Hot Beverage)
  { value: 'Latte (Single)', label: 'Latte (Single) - NRs 150', price: 150 },
  { value: 'Latte (Double)', label: 'Latte (Double) - NRs 230', price: 230 },
  { value: 'Cappuccino (Single)', label: 'Cappuccino (Single) - NRs 160', price: 160 },
  { value: 'Cappuccino (Double)', label: 'Cappuccino (Double) - NRs 250', price: 250 },
  { value: 'Flavored Latte', label: 'Flavored Latte - Chocolate/Strawberry/Vanilla/Caramel/Honey - NRs 220', price: 220 },
  { value: 'Hot Chocolate', label: 'Hot Chocolate - NRs 150', price: 150 },
  { value: 'Hot Lemon with Honey', label: 'Hot Lemon with Honey - NRs 140', price: 140 },
  { value: 'Hot Lemon with Honey and Ginger', label: 'Hot Lemon with Honey and Ginger - NRs 150', price: 150 },

  // Smoothies
  { value: 'Blueberry Smoothies', label: 'Blueberry Smoothies - NRs 200', price: 200 },
  { value: 'Apple Smoothies', label: 'Apple Smoothies - NRs 220', price: 220 },
  { value: 'Banana Smoothies', label: 'Banana Smoothies - NRs 150', price: 150 },

  // Lassi
  { value: 'Plain Lassi', label: 'Plain Lassi - NRs 100', price: 100 },
  { value: 'Sweet Lassi', label: 'Sweet Lassi - NRs 110', price: 110 },
  { value: 'Vanilla Lassi', label: 'Vanilla Lassi - NRs 160', price: 160 },
  { value: 'Caramel Lassi', label: 'Caramel Lassi - NRs 160', price: 160 },
  { value: 'Banana Lassi', label: 'Banana Lassi - NRs 150', price: 150 },
  { value: 'Apple Lassi', label: 'Apple Lassi - NRs 160', price: 160 },
  { value: 'Mix Fruit Lassi', label: 'Mix Fruit Lassi - NRs 200', price: 200 },

  // Iced Cold Beverage
  { value: 'Iced Americano (Single)', label: 'Iced Americano (Single) - NRs 155', price: 155 },
  { value: 'Iced Americano (Double)', label: 'Iced Americano (Double) - NRs 245', price: 245 },
  { value: 'Iced Latte', label: 'Iced Latte - NRs 180', price: 180 },
  { value: 'Iced Mocha', label: 'Iced Mocha - NRs 200', price: 200 },
  { value: 'Peach Iced Tea', label: 'Peach Iced Tea - NRs 190', price: 190 },
  { value: 'Lemon Iced Tea', label: 'Lemon Iced Tea - NRs 190', price: 190 },
  { value: 'Iced Caramel Macchiato', label: 'Iced Caramel Macchiato - NRs 210', price: 210 },
  { value: 'Iced Blended Mocha', label: 'Iced Blended Mocha - NRs 230', price: 230 },
  { value: 'Lemonade', label: 'Lemonade - NRs 190', price: 190 },
  { value: 'Mini Lemonade', label: 'Mini Lemonade - NRs 210', price: 210 },

  // Tea
  { value: 'Black Tea', label: 'Black Tea - NRs 50', price: 50 },
  { value: 'Lemon Tea', label: 'Lemon Tea - NRs 70', price: 70 },
  { value: 'Milk Tea', label: 'Milk Tea (Steam Milk) - NRs 90', price: 90 },
  { value: 'Green Tea', label: 'Green Tea - NRs 90', price: 90 },

  // Ice Cream
  { value: 'Chocolate Ice Cream', label: 'Chocolate Ice Cream - NRs 100', price: 100 },
  { value: 'Vanilla Ice Cream', label: 'Vanilla Ice Cream - NRs 100', price: 100 },
  { value: 'Strawberry Ice Cream', label: 'Strawberry Ice Cream - NRs 100', price: 100 },
  { value: 'Butterscotch Ice Cream', label: 'Butterscotch Ice Cream - NRs 100', price: 100 },

        { value: 'Water', label: 'Water - NRs 50', price: 50 },

      ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newOrdertitle || !order_status || !customer_status || !order_type) {
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
                <br />
                <div className="bg-page1">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
    
                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Order Name:</label>
                            <Select
                                options={options}
                                onChange={Dropdown}
                                value={{ value: newOrdertitle, label: newOrdertitle }}
                                styles={{
                                    control: (provided) => ({ ...provided, width: 400 }),
                                    menu: (provided) => ({ ...provided, width: 400 })
                                }}
                                placeholder="Select an option"
                            />
                        </div>
    
                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Price:</label>
                            <input
                                value={`NRs. ${order_price}`}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order price"
                                disabled
                            />
                        </div>
    
                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Quantity:</label>
                            <input
                                onChange={(e) => setOrderQuantity(e.target.value)}
                                value={order_quantity}
                                className="border border-slate-500 px-8 py-2"
                                type="number"
                                placeholder="Order quantity"
                            />
                        </div>
    
                        {/* <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Order Type:</label>
                            <select
                                className="border border-slate-500 px-8 py-2"
                                value={order_type}
                                onChange={(e) => setOrderType(e.target.value)}
                            >
                                <option value="Kitchen">Kitchen</option>
                                <option value="Bar">Bar</option>
                            </select>
                        </div> */}
                        <div className="flex items-center">
                                <label className="mr-4 w-32 order-label">Order Type:</label>
                                <select
                                    className="border border-slate-500 px-8 py-2"
                                    value={order_type}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    required // Added required attribute
                                >
                                    <option value="">Select Order Type</option> {/* Default option for selection */}
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Bar">Bar</option>
                                </select>
                            </div>
    
                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Description:</label>
                            <input
                                onChange={(e) => setDescription(e.target.value)}
                                value={order_description}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order description"
                            />
                        </div>
    
                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Order Status:</label>
                            <input
                                onChange={(e) => setOrderStatus(e.target.value)}
                                value={order_status}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order status"
                                disabled
                            />
                        </div>
    
                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Customer Status:</label>
                            <input
                                onChange={(e) => setCustomerStatus(e.target.value)}
                                value={customer_status}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Customer status"
                                disabled
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="mr-4 w-32 order-label">Order ID:</label>
                            <input
                                value={id}
                                className="border border-slate-500 px-8 py-2"
                                type="text"
                                placeholder="Order id"
                                disabled
                            />
                        </div>
    
                        <button
                            type="submit"
                            className="bg-green-600 font-bold text-white py-3 px-6 w-fit order-label">
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

