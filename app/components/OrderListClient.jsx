"use client";

import { useState } from 'react';
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveOrderBtn from "./RemoveOrderBtn";
import EditCustomerForm from "./EditCustomerForm";
import AddBillForm from "./AddBillForm";
import Modal from "./ModalForm";

export default function OrderListClient({ orderbyTableId, total_price, tableId }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [finalBill, setFinalBill] = useState(null); // Manage final bill state

    const handleOpenModal = () => {
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const handleBillAdded = (finalPrice) => {
        setFinalBill(finalPrice); // Update final bill when the bill is added
        setModalOpen(false); // Close modal after adding the bill
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="px-6 py-2 mt-3 add-table" onClick={handleOpenModal}>
                    Generate Bill
                </button>
            </div>

            {
                !orderbyTableId || orderbyTableId.length === 0 ? 'No orders found for this table.' : ''
            }
            {orderbyTableId.map(order => (
                <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start" key={order._id}>
                    <div>
                        <h3 className="font-bold text-2xl">{order.order_title}</h3>
                        <div>{order.order_description}</div>
                        <div>{order.order_status}</div>
                        <div>{order.customer_status}</div>
                        <div>Order price: NRs. {order.order_price}</div>
                        <div>Order quantity: {order.order_quantity}</div>
                        <div>Sum: NRs. {order.final_price}</div>
                    </div>
                    <div>
                        <RemoveOrderBtn id={order._id} />
                        <Link href={`/editOrder/${order._id}`}>
                            <HiPencilAlt className="edit-icon" size={24} />
                        </Link>
                    </div>
                </div>
            ))}
            <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold">Total bill: NRs. {total_price}</p>  
            <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold">Final bill: NRs. {finalBill}</p>  

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <AddBillForm initialOriginalPrice={total_price} onBillAdded={handleBillAdded} />
            </Modal>
        </>
    );
}