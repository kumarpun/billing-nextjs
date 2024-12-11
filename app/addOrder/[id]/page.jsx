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
      { value: 'Fries - dynamite fries', label: 'Fries - dynamite fries - NRs 180', price: 180 },
      { value: 'French fries', label: 'French fries - NRs 95', price: 95 },
      { value: 'Suracha tempura', label: 'Suracha tempura - NRs 220', price: 220 },
      { value: 'Chilly paneer', label: 'Chilly paneer - NRs 350', price: 350 },
      { value: 'Aloo papdi chat', label: 'Aloo papdi chat - NRs 200', price: 200 },
      { value: 'Dynamite fries non-veg', label: 'Dynamite fries non-veg - NRs 220', price: 220 },
      { value: 'Chilly chicken', label: 'Chilly chicken - NRs 350', price: 350 },
      { value: 'Mushroom chilly', label: 'Mushroom chilly - NRs 350', price: 350 },
      { value: 'Corn salt & pepper', label: 'Corn salt & pepper - NRs 250', price: 250 },
      { value: 'Hot wings', label: 'Hot wings - NRs 390', price: 390 },
      { value: 'Chicken lollipop', label: 'Chicken lollipop - NRs 390', price: 390 },
      { value: 'Kungpao chicken', label: 'Kungpao chicken - NRs 390', price: 390 },
      { value: 'Pepper chicken', label: 'Pepper chicken - NRs 330', price: 330 },
      { value: 'Chicken 65', label: 'Chicken 65 - NRs 330', price: 330 },
      { value: 'Timur chicken', label: 'Timur chicken - NRs 300', price: 300 },
      { value: 'GGR chicken', label: 'GGR chicken - NRs 390', price: 390 },
      { value: 'Green salad', label: 'Green salad - NRs 165', price: 165 },
      { value: 'Fruits platter', label: 'Fruits platter - NRs 320', price: 320 },
      { value: 'Chicken choila', label: 'Chicken choila - NRs 300', price: 300 },
      { value: 'Chicken tass', label: 'Chicken tass - NRs 350', price: 350 },
      { value: 'Chicken sadheko', label: 'Chicken sadheko - NRs 250', price: 250 },
      { value: 'Peanut sadheko', label: 'Peanut sadheko - NRs 180', price: 180 },
      { value: 'Waiwai sadheko', label: 'Waiwai sadheko - NRs 150', price: 150 },
      { value: 'Bhatmas sadeko', label: 'Bhatmas sadeko - NRs 175', price: 175 },
      { value: 'Chicken sukuti', label: 'Chicken sukuti - NRs 320', price: 320 },
      { value: 'Buff sukuti', label: 'Buff sukuti - NRs 300', price: 300 },
      { value: 'Buff chooila', label: 'Buff chooila - NRs 360', price: 360 },
      { value: 'Steam veg momo', label: 'Steam veg momo - NRs 130', price: 130 },
      { value: 'Steam chicken momo', label: 'Steam chicken momo - NRs 170', price: 170 },
      { value: 'Chilly veg momo', label: 'Chilly veg momo - NRs 180', price: 180 },
      { value: 'Chilly chicken momo', label: 'Chilly chicken momo - NRs 220', price: 220 },
      { value: 'Afghani veg momo', label: 'Afghani veg momo - NRs 200', price: 200 },
      { value: 'Afghani chicken momo', label: 'Afghani chicken momo - NRs 280', price: 280 },
      { value: 'Fry chicken momo', label: 'Fry chicken momo - NRs 250', price: 250 },
      { value: 'Burger veg', label: 'Burger veg - NRs 210', price: 210 },
      { value: 'Burger non-veg', label: 'Burger non-veg - NRs 250', price: 250 },
      { value: 'Pasta veg', label: 'Pasta veg - NRs 280', price: 280 },
      { value: 'Pasta non-veg', label: 'Pasta non-veg - NRs 320', price: 320 },
      { value: 'Spaghetti non-veg', label: 'Spaghetti non-veg - NRs 320', price: 320 },
      { value: 'Fried rice veg', label: 'Fried rice veg - NRs 120', price: 120 },
      { value: 'Fried rice non-veg', label: 'Fried rice non-veg - NRs 150', price: 150 },
      { value: 'Mix Fried rice', label: 'Mix Fried rice - NRs 230', price: 230 },
      { value: 'Noodles veg', label: 'Noodles veg - NRs 150', price: 150 },
      { value: 'Noodles non-veg', label: 'Noodles non-veg - NRs 190', price: 190 },
      { value: 'Half Noodles veg', label: 'Half Noodles veg - NRs 80', price: 80 },
      { value: 'Half Noodles non-veg', label: 'Half Noodles non-veg - NRs 100', price: 100 },
      { value: 'Buff Noodles', label: 'Buff Noodles - NRs 200', price: 200 },
      { value: 'Sandwich veg', label: 'Sandwich veg - NRs 230', price: 230 },
      { value: 'Sandwich non-veg', label: 'Sandwich non-veg - NRs 300', price: 300 },
      { value: 'Biryani veg', label: 'Biryani veg - NRs 350', price: 350 },
      { value: 'Biryani non-veg', label: 'Biryani non-veg - NRs 450', price: 450 },
      { value: 'Pizza veg', label: 'Pizza veg - NRs 350', price: 350 },
      { value: 'Hot sour & soup', label: 'Hot sour & soup - NRs 250', price: 250 },
      { value: 'Mushroom soup', label: 'Mushroom soup - NRs 300', price: 300 },
      { value: 'Mix Pizza', label: 'Mix Pizza - NRs 550', price: 550 },

      { value: 'Pizza non-veg', label: 'Pizza non-veg - NRs 400', price: 400 },
      { value: 'Paneer fried rice', label: 'Paneer fried rice - NRs 170', price: 170 },
      { value: 'Paneer noodles', label: 'Paneer noodles - NRs 210', price: 210 },
      { value: 'Chef special', label: 'Chef special - NRs 600', price: 600 },
      { value: 'Papad fry', label: 'Papad fry - NRs 25', price: 25 },
      { value: 'Thupka non-veg', label: 'Thupka non-veg - NRs 290', price: 290 },
      { value: 'Thupka veg', label: 'Thupka veg - NRs 200', price: 200 },
      { value: 'Jhol momo non-veg', label: 'Jhol momo non-veg - NRs 250', price: 250 },
      { value: 'Crispy chiken', label: 'Crispy chiken - NRs 350', price: 350 },
      { value: 'Extra cheese', label: 'Extra cheese - NRs 60', price: 60 },

      { value: 'Crown chicken', label: 'Crown chicken - NRs 450', price: 450 },
      { value: 'Sausage fry', label: 'Sausage fry - NRs 300', price: 300 },


      { value: 'Grill chicken - brown sauce/lime rice', label: 'Grill chicken - brown sauce/lime rice - NRs 680', price: 680 },

      { value: 'Hybe special platter veg', label: 'Hybe special platter veg - NRs 700', price: 700 },
      { value: 'Hybe special platter non-veg', label: 'Hybe special platter non-veg - NRs 1050', price: 1050 },
      { value: 'Steam Buff MO:MO', label: 'Steam Buff MO:MO - NRs 200', price: 200 },
      { value: 'Fried Veg MO:MO', label: 'Fried Veg MO:MO - NRs 150', price: 150 },
      { value: 'Fried Chicken MO:MO', label: 'Fried Chicken MO:MO - NRs 200', price: 200 },
      { value: 'Fried Buff MO:MO', label: 'Fried Buff MO:MO - NRs 220', price: 220 },

      // bar menu
        { value: 'Bar menu', label: 'Bar menu', price: 0 },
        { value: 'Pineapple Juice - glass', label: 'Pineapple Juice - glass - NRs 130', price: 130 },
        { value: 'Pineapple Juice - bottle', label: 'Pineapple Juice - bottle - NRs 490', price: 490 },
        { value: 'Orange juice - glass', label: 'Orange juice - glass - NRs 130', price: 130 },
        { value: 'Orange juice - bottle', label: 'Orange juice - bottle - NRs 490', price: 490 },
        { value: 'Mango Juice - glass', label: 'Mango Juice - glass - NRs 130', price: 130 },
        { value: 'Mango juice - bottle', label: 'Orange juice - bottle - NRs 490', price: 490 },
        { value: 'Cranberry Juice - glass', label: 'Cranberry Juice - glass - NRs 130', price: 130 },
        { value: 'Cranberry juice - bottle', label: 'Cranberry juice - bottle - NRs 490', price: 490 },
        { value: 'Mix Juice - glass', label: 'Mix Juice - glass - NRs 130', price: 130 },
        { value: 'Mix juice - bottle', label: 'Mix juice - bottle - NRs 490', price: 490 },
        { value: 'Coke - glass', label: 'Coke - glass - NRs 90', price: 90 },
        { value: 'Coke - bottle', label: 'Coke - bottle - NRs 400', price: 400 },
        { value: 'Fanta - glass', label: 'Fanta - glass - NRs 90', price: 90 },
        { value: 'Fanta - bottle', label: 'Fanta - bottle - NRs 400', price: 400 },
        { value: 'Sprite - glass', label: 'Sprite - glass - NRs 90', price: 90 },
        { value: 'Sprite - bottle', label: 'Sprite - bottle - NRs 400', price: 400 },
        { value: 'Gorkha premium', label: 'Gorkha premium - NRs 500', price: 500 },
        { value: 'Gorkha strong', label: 'Gorkha strong - NRs 430', price: 430 },
        { value: 'Tuborg gold', label: 'Tuborg gold - NRs 530', price: 530 },
        { value: 'Tuborg strong', label: 'Tuborg strong - NRs 450', price: 450 },
        { value: 'Barahsinghe', label: 'Barahsinghe - NRs 520', price: 520 },

        { value: '8848 Vodka - 30', label: '8848 Vodka - 30 ml - NRs 110', price: 110 },
        { value: '8848 Vodka - 60', label: '8848 Vodka - 60 ml - NRs 220', price: 220 },
        { value: '8848 Vodka -180', label: '8848 Vodka - 180 ml - NRs 660', price: 660 },
        { value: '8848 Vodka', label: '8848 Vodka - bottle - NRs 2670', price: 2670 },
        { value: 'Nude - 30', label: 'Nude - 30 ml - NRs 115', price: 115 },
        { value: 'Nude - 60', label: 'Nude - 60 ml - NRs 230', price: 230 },
        { value: 'Nude - 90', label: 'Nude - 90 ml - NRs 345', price: 345 },
        { value: 'Nude', label: 'Nude - bottle - NRs 2690', price: 2690 },
        { value: 'Absolute', label: 'Absolute - 30 ml - NRs 255', price: 255 },
        { value: 'Absolute', label: 'Absolute - 60 ml - NRs 510', price: 510 },
        { value: 'Absolute', label: 'Absolute - bottle - NRs 8095', price: 8095 },


        { value: 'Old Durbar Regular - 30 ml', label: 'Old Durbar Regular - 30 ml - NRs 180', price: 180 },
        { value: 'Old Durbar Regular - 60 ml', label: 'Old Durbar Regular - 60 ml - NRs 360', price: 360 },
        { value: 'Old Durbar Regular - 90 ml', label: 'Old Durbar Regular - 90 ml - NRs 540', price: 540 },
        { value: 'Old Durbar Regular - 180 ml', label: 'Old Durbar Regular - 180 ml - NRs 1080', price: 1080 },

        { value: 'Old Durbar Regular - half bottle', label: 'Old Durbar Regular - half bottle - NRs 2200', price: 2200 },
        { value: 'Old Durbar Regular - bottle', label: 'Old Durbar Regular - bottle - NRs 4300', price: 4300 },

        { value: 'Old Durbar Chimney - 30 ml', label: 'Old Durbar Chimney - 30 ml - NRs 240', price: 240 },
        { value: 'Old Durbar Chimney - 60 ml', label: 'Old Durbar Chimney - 60 ml - NRs 480', price: 480 },
        { value: 'Old Durbar Chimney - 90 ml', label: 'Old Durbar Chimney - 90 ml - NRs 720', price: 720 },
        { value: 'Old Durbar Chimney - 180 ml', label: 'Old Durbar Chimney - 180 ml - NRs 1440', price: 1440 },

        { value: 'Old Durbar Chimney - half bottle', label: 'Old Durbar Chimney - half bottle - NRs 2650', price: 2650 },
        { value: 'Old Durbar Chimney - bottle', label: 'Old Durbar Chimney - bottle - NRs 5710', price: 5710 },

        { value: 'Gurkhas & Guns - 30', label: 'Gurkhas & Guns - 30 ml - NRs 155', price: 155 },
        { value: 'Gurkhas & Guns  60', label: 'Gurkhas & Guns - 60 ml - NRs 310', price: 310 },
        { value: 'Gurkhas & Guns - 180', label: 'Gurkhas & Guns - 180 ml - NRs 930', price: 930 },
        { value: 'Gurkhas & Guns', label: 'Gurkhas & Guns - bottle - NRs 3745', price: 3745 },
        { value: 'Jack Daniel (J.D) - 30 ml', label: 'Jack Daniel (J.D) - 30 ml - NRs 315', price: 315 },
        { value: 'Jack Daniel (J.D) - 60 ml', label: 'Jack Daniel (J.D) - 60 ml - NRs 630', price: 630 },
        { value: 'Jack Daniel (J.D) - 90 ml', label: 'Jack Daniel (J.D) - 90 ml - NRs 945', price: 945 },
        { value: 'Jack Daniel (J.D) - 180 ml', label: 'Jack Daniel (J.D) - 180 ml - NRs 1890', price: 1890 },

        { value: 'Jack Daniel (J.D)', label: 'Jack Daniel (J.D) - bottle - NRs 10125', price: 10125 },
        { value: 'Glenfiddhich', label: 'Glenfiddhich - 30 ml - NRs 480', price: 480 },
        { value: 'Glenfiddhich', label: 'Glenfiddhich - 60 ml - NRs 960', price: 960 },
        { value: 'Glenfiddhich', label: 'Glenfiddhich - bottle - NRs 15435', price: 15435 },
        { value: 'JW (Double Black)', label: 'JW (Double Black) - 30 ml - NRs 390', price: 390 },
        { value: 'JW (Double Black)', label: 'JW (Double Black) - 60 ml - NRs 780', price: 780 },
        { value: 'JW (Double Black)', label: 'JW (Double Black) - bottle - NRs 12530', price: 12530 },
        { value: 'JW (Black level)', label: 'JW (Black level) - 30 ml - NRs 335', price: 335 },
        { value: 'JW (Black level)', label: 'JW (Black level) - 60 ml - NRs 670', price: 670 },
        { value: 'JW (Black level)', label: 'JW (Black level) - bottle - NRs 10755', price: 10755 },
        { value: 'Chivas Regal 12 yrs', label: 'Chivas Regal 12 yrs - 30 ml - NRs 345', price: 345 },
        { value: 'Chivas Regal 12 yrs', label: 'Chivas Regal 12 yrs - 60 ml - NRs 690', price: 690 },
        { value: 'Chivas Regal 12 yrs', label: 'Chivas Regal 12 yrs - bottle - NRs 11080', price: 11080 },
        { value: 'Jameson', label: 'Jameson - 30 ml - NRs 290', price: 290 },
        { value: 'Jameson', label: 'Jameson - 60 ml - NRs 580', price: 580 },
        { value: 'Jameson', label: 'Jameson - bottle - NRs 9310', price: 9310 },

        { value: 'Khukrirum Light - 30 ml', label: 'Khukrirum Light - 30 ml - NRs 125', price: 125 },
        { value: 'Khukrirum Light  60 ml', label: 'Khukrirum Light - 60 ml - NRs 250', price: 250 },
        { value: 'Khukrirum Light - 90 ml', label: 'Khukrirum Light - 90 ml - NRs 375', price: 375 },
        { value: 'Khukrirum Light - 180 ml', label: 'Khukrirum Light - 180 ml - NRs 750', price: 750 },

        { value: 'Khukrirum Light - bottle', label: 'Khukrirum Light - bottle - NRs 2940', price: 2940 },
        
        { value: 'Khukrirum Dark -30', label: 'Khukrirum Dark - 30 ml - NRs 105', price: 105 },
        { value: 'Khukrirum Dark -60', label: 'Khukrirum Dark - 60 ml - NRs 210', price: 210 },
        { value: 'Khukrirum Dark -90', label: 'Khukrirum Dark - 90 ml - NRs 315', price: 315 },
        { value: 'Khukrirum Dark -180', label: 'Khukrirum Dark - 180 ml - NRs 630', price: 630 },
        { value: 'Khukrirum Dark - bottle', label: 'Khukrirum Dark - bottle - NRs 2545', price: 2545 },

        { value: 'Khukrirum spiced rum - 30 ml', label: 'Khukrirum spiced rum - 30 ml - NRs 150', price: 150 },
        { value: 'Khukrirum spiced rum - 60 ml', label: 'Khukrirum spiced rum - 60 ml - NRs 280', price: 280 },
        { value: 'Khukrirum spiced rum - 90 ml', label: 'Khukrirum spiced rum - 90 ml - NRs 420', price: 420 },
        { value: 'Khukrirum spiced rum - 180 ml', label: 'Khukrirum spiced rum - 180 ml - NRs 800', price: 800 },
        { value: 'Khukrirum spiced rum - bottle', label: 'Khukrirum spiced rum - bottle - NRs 3000', price: 3000 },

        { value: 'Captain Morgan Black', label: 'Captain Morgan Black - 30 ml - NRs 335', price: 335 },
        { value: 'Captain Morgan Black', label: 'Captain Morgan Black - 60 ml - NRs 670', price: 670 },
        { value: 'Captain Morgan Black', label: 'Captain Morgan Black - bottle - NRs 8040', price: 8040 },
        { value: 'Le cuvier napolian VSOP', label: 'Le cuvier napolian VSOP - 30 ml - NRs 220', price: 220 },
        { value: 'Le cuvier napolian VSOP', label: 'Le cuvier napolian VSOP - 60 ml - NRs 450', price: 450 },
        { value: 'Le cuvier napolian VSOP', label: 'Le cuvier napolian VSOP - 90 ml - NRs 670', price: 670 },
        { value: 'Le cuvier napolian VSOP - bottle', label: 'Le cuvier napolian VSOP - bottle - NRs 7200', price: 7200 },

        { value: 'Snowman Gin', label: 'Snowman Gin - 30 ml - NRs 120', price: 120 },
        { value: 'Snowman Gin', label: 'Snowman Gin - 60 ml - NRs 240', price: 240 },
        { value: 'Snowman Gin', label: 'Snowman Gin - bottle - NRs 2800', price: 2800 },
        { value: 'Bombay Sapphire', label: 'Bombay Sapphire - 30 ml - NRs 580', price: 580 },
        { value: 'Bombay Sapphire', label: 'Bombay Sapphire - 60 ml - NRs 1160', price: 1160 },
        { value: 'Bombay Sapphire', label: 'Bombay Sapphire - bottle - NRs 13975', price: 13975 },

        { value: 'Baileys Irish Cream - 30 ml', label: 'Baileys Irish Cream - 30 ml - NRs 260', price: 260 },
        { value: 'Baileys Irish Cream - 60 ml', label: 'Baileys Irish Cream - 60 ml - NRs 520', price: 520 },
        { value: 'Baileys Irish Cream - half bottle', label: 'Baileys Irish Cream - half bottle - NRs 4115', price: 4115 },
        { value: 'Baileys Irish Cream - full bottle', label: 'Baileys Irish Cream - full bottle - NRs 8230', price: 8230 },


        { value: 'Agavita Silver', label: 'Agavita Silver - 30 ml - NRs 260', price: 260 },
        { value: 'Agavita Silver', label: 'Agavita Silver - 60 ml - NRs 520', price: 520 },
        { value: 'Agavita Silver', label: 'Agavita Silver - bottle - NRs 6265', price: 6265 },

        { value: 'Hot rum punch', label: 'Hot rum punch - NRs 430', price: 430 },

      
        { value: 'Cosmopolitan', label: 'Cosmopolitan - NRs 500', price: 500 },
        { value: 'Espresso martini', label: 'Espresso martini - NRs 590', price: 590 },
        { value: 'Whiskey sour', label: 'Whiskey sour - NRs 510', price: 510 },
        { value: 'Classic mojito', label: 'Classic mojito - NRs 430', price: 430 },
        { value: 'Blue Angel', label: 'Blue Angel - NRs 430', price: 430 },


        { value: 'Blue lagoon', label: 'Blue lagoon - NRs 280', price: 280 },
        { value: 'Coco Rush', label: 'Coco Rush - NRs 280', price: 280 },
        { value: 'Virgin Mojito', label: 'Virgin Mojito - NRs 230', price: 230 },

        { value: 'B-52', label: 'B-52 - NRs 590', price: 590 },
        { value: 'Brain Damage', label: 'Brain Damage - NRs 565', price: 565 },
        { value: 'Kamikaze', label: 'Kamikaze - NRs 500', price: 500 },
        { value: 'Jager bomb', label: 'Jager bomb - NRs 530', price: 530 },
        { value: 'Flaming Lambo', label: 'Flaming Lambo - NRs 1250', price: 1250 },
        { value: 'Red bull', label: 'Red bull - NRs 280', price: 280 },

        { value: 'Shikhar Ice', label: 'Shikhar Ice - NRs 25', price: 25 },
        { value: 'Surya Red', label: 'Surya Red - NRs 30', price: 30 },
        { value: 'Surya Light', label: 'Surya Light - NRs 30', price: 30 },
        { value: 'Shikhar Ice packet', label: 'Shikhar Ice packet - NRs 480', price: 480 },
        { value: 'Surya Red packet', label: 'Surya Red packet - NRs 570', price: 570 },
        { value: 'Surya Light packet', label: 'Surya Light packet - NRs 570', price: 570 },

        { value: 'Hookah', label: 'Hookah - NRs 390', price: 390 },
        { value: 'Hybe Hookah', label: 'Hybe Hookah - NRs 500', price: 500 },
        { value: 'Hookah Refill', label: 'Hookah Refill - NRs 300', price: 300 },
        { value: 'Coil', label: 'Coil - NRs 40', price: 40 },

        { value: 'Red wine - Marlot Jacob creek', label: 'Red wine - Marlot Jacob creek - NRs 3000', price: 3000 },
        { value: 'Calvet chardonnay demi sec', label: 'Calvet chardonnay demi sec - NRs 3500', price: 3500 },
        { value: 'Calvet brut', label: 'Calvet brut - NRs 3500', price: 3500 },

        { value: 'Triple sec - 30 ml', label: 'Triple sec - 30 ml - NRs 400', price: 400 },
        { value: 'Purple galaxy', label: 'Purple galaxy - NRs 340', price: 340 },
        { value: 'Beefeater - 30 ml', label: 'Beefeater 30 ml - NRs 300', price: 300 },
        { value: 'Beefeater - 60 ml', label: 'Beefeater 60 ml - NRs 600', price: 600 },

        // Barista menu
        { value: 'Espresso', label: 'Espresso - NRs 90', price: 90 },
        { value: 'Ristretto', label: 'Ristretto - NRs 90', price: 90 },
        { value: 'Espresso Machhito', label: 'Espresso Machhito - NRs 120', price: 120 },
        { value: 'Americano single', label: 'Americano single - NRs 125', price: 125 },
        { value: 'Americano double', label: 'Americano double - NRs 135', price: 135 },
        { value: 'Lungo single', label: 'Lungo single - NRs 120', price: 120 },
        { value: 'Lungo double', label: 'Lungo double - NRs 145', price: 145 },
        { value: 'Doppio', label: 'Doppio - NRs 130', price: 130 },
        { value: 'Espresso Affagato', label: 'Espresso Affagato - NRs 170', price: 170 },

        { value: 'Latte single', label: 'Latte single - NRs 150', price: 150 },
        { value: 'Latte double', label: 'Latte double - NRs 180', price: 180 },
        { value: 'Honey latte', label: 'Honey latte - NRs 200', price: 200 },
        { value: 'Flavoured latte', label: 'Flavoured latte - NRs 200', price: 200 },
        { value: 'Cappuccino', label: 'Cappuccino - NRs 170', price: 170 },
        { value: 'Ice Cappuccino - single', label: 'Ice Cappuccino single - NRs 190', price: 190 },
        { value: 'Ice Cappuccino - double', label: 'Ice Cappuccino double - NRs 280', price: 280 },

        { value: 'Flavoured cappuccino', label: 'Flavoured cappuccino - NRs 200', price: 200 },
        { value: 'Hot chocolate', label: 'Hot chocolate - NRs 180', price: 180 },
        { value: 'Flavoured streamed milk', label: 'Flavoured streamed milk - NRs 120', price: 120 },
        { value: 'Hot lemon with honey', label: 'Hot lemon with honey - NRs 115', price: 115 },
        { value: 'Hot lemon with honey and ginger', label: 'Hot lemon with honey and ginger - NRs 125', price: 125 },
        { value: 'Lemon sprite', label: 'Lemon sprite - NRs 110', price: 110 },
        { value: 'Lemon water', label: 'Lemon water - NRs 60', price: 60 },
        { value: 'Lime soda', label: 'Lime soda - NRs 110', price: 110 },

        { value: 'Hot water', label: 'Hot water - NRs 20', price: 20 },

        { value: 'Black tea', label: 'Black tea - NRs 45', price: 45 },
        { value: 'Lemon tea', label: 'Lemon tea - NRs 60', price: 60 },
        { value: 'Milk tea', label: 'Milk tea - NRs 60', price: 60 },
        { value: 'Green tea', label: 'Green tea - NRs 90', price: 90 },
        { value: 'Steam milk', label: 'Steam milk - NRs 70', price: 70 },
        { value: 'Masala tea', label: 'Masala tea - NRs 95', price: 95 },

        { value: 'Iced Americano', label: 'Iced Americano - NRs 155', price: 155 },
        { value: 'Iced Americano double', label: 'Iced Americano double - NRs 245', price: 245 },

        { value: 'Iced latte', label: 'Iced latte - NRs 180', price: 180 },
        { value: 'Iced Mocha', label: 'Iced Mocha - NRs 200', price: 200 },
        { value: 'Peach Iced Tea', label: 'Peach Iced Tea - NRs 195', price: 195 },
        { value: 'Lemon Iced Tea', label: 'Lemon Iced Tea - NRs 195', price: 195 },
        { value: 'Iced Caramel Machhiato', label: 'Iced Caramel Machhiato - NRs 200', price: 200 },
        { value: 'Iced Mocha Madness', label: 'Iced Mocha Madness - NRs 220', price: 220 },
        { value: 'Iced blended Mocha', label: 'Iced blended Mocha - NRs 210', price: 210 },
        { value: 'Lemonade', label: 'Lemonade - NRs 190', price: 190 },
        { value: 'Mint lemonade', label: 'Mint lemonade - NRs 205', price: 205 },

        { value: 'Chocolate Shake', label: 'Chocolate Shake - NRs 270', price: 270 },
        { value: 'Strawberry Shake', label: 'Strawberry Shake - NRs 270', price: 270 },
        { value: 'Vanilla Shake', label: 'Vanilla Shake - NRs 270', price: 270 },
        { value: 'Caramel Shake', label: 'Caramel Shake - NRs 270', price: 270 },
        { value: 'Blue Berry Shake', label: 'Blue Berr Shake - NRs 270', price: 270 },
        { value: 'Oreo milkshake', label: 'Oreo milkshake - NRs 285', price: 285 },
        { value: 'Kitkat milkshake', label: 'Kitkat milkshake - NRs 315', price: 315 },

        { value: 'Banana smoothies', label: 'Banana smoothies - NRs 180', price: 180 },
        { value: 'Blueberry smoothies', label: 'Blueberry smoothies - NRs 180', price: 180 },
        { value: 'Apple smoothies', label: 'Apple smoothies - NRs 300', price: 180 },

        { value: 'Plain lassi', label: 'Plain lassi - NRs 100', price: 100 },
        { value: 'Sweet lassi', label: 'Sweet lassi - NRs 110', price: 110 },
        { value: 'Vannilla lassi', label: 'Vannilla lassi - NRs 160', price: 160 },
        { value: 'Mint lassi', label: 'Mint lassi - NRs 160', price: 160 },
        { value: 'Caramel lassi', label: 'Caramel lassi - NRs 160', price: 160 },
        { value: 'Banana lassi', label: 'Banana lassi - NRs 160', price: 160 },
        { value: 'Apple lassi', label: 'Apple lassi - NRs 160', price: 160 },
        { value: 'Mango lassi', label: 'Mango lassi - NRs 160', price: 160 },
        { value: 'Strawberry lassi', label: 'Strawberry lassi - NRs 160', price: 160 },
        { value: 'Mix Fruit lassi', label: 'Mix Fruit lassi - NRs 180', price: 180 },

        { value: 'Ice cream - Chocolate', label: 'Ice cream - Chocolate - NRs 80', price: 80 },
        { value: 'Ice cream - Vanilla', label: 'Ice cream - Vanilla - NRs 80', price: 80 },
        { value: 'Ice cream - Strawberry', label: 'Ice cream - Strawberry - NRs 80', price: 80 },
        { value: 'Ice cream - Butter scotch', label: 'Ice cream - Butter scotch - NRs 80', price: 80 },

        { value: 'Cocktail of the day', label: 'Cocktail of the day - NRs 550', price: 550 },
        { value: 'Mocktail of the day', label: 'Mocktail of the day - NRs 250', price: 250 },

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
                <div className="bg-page">
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

