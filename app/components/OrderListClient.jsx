"use client";

import { useState } from 'react';
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveOrderBtn from "./RemoveOrderBtn";
import EditCustomerForm from "./EditCustomerForm";
import AddBillForm from "./AddBillForm";
import Modal from "./ModalForm";
import EditBillForm from "./EditBillForm";

export default function OrderListClient({ orderbyTableId, total_price, tablebill_id, tableId, billById, totalFinalbill, billFinalStatus }) {
    const [isModalOpen, setModalOpen] = useState(false);
    // const [finalBill, setFinalBill] = useState(null); // Manage final bill state
    // const [finalBill, setFinalBill] = useState(finalBillFromAPI); // Initialize with the value from API
    const [modalContent, setModalContent] = useState(null); // to track which form to display
    const [discount, setDiscount] = useState(''); // State to track discount value


    const handleOpenModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalContent(null);
    }

    const handleBillAdded = () => {
        // setFinalBill(finalPrice); // Update final bill when the bill is added
        setModalOpen(false); // Close modal after adding the bill
    }

    const handlePrint = () => {
        // window.print();
        const discountElement = document.getElementById('discount-section');
        if (discount === '') {
            discountElement.style.display = 'none';
        }
        window.print();
        discountElement.style.display = '';
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '12px' }}>
            <button className="px-6 py-2 mt-3 add-table" onClick={() => handleOpenModal('add')}>
                    Generate Bill
                </button>
                <button className="px-6 py-2 mt-3 add-table" onClick={() => handleOpenModal('edit')}>
                    Update Bill
                </button>
                <button className="px-6 py-2 mt-3 add-table" onClick={() => handleOpenModal('print')}>
                    Print Bill
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

        
             <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold">Final bill: NRs. {totalFinalbill} status: {billFinalStatus}</p>                

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {/* <AddBillForm initialOriginalPrice={total_price} initialBillId={tablebill_id} onBillAdded={handleBillAdded} /> */}
                {modalContent === 'add' && (
                    <AddBillForm initialOriginalPrice={total_price} initialBillId={tablebill_id} onBillAdded={handleBillAdded} />
                )}
                {modalContent === 'edit' && (
                    <EditBillForm id={tablebill_id} onBillAdded={handleBillAdded} />
                )}
                     {modalContent === 'print' && (
                    <div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="px-6 py-2 mt-3 add-table ml-auto" onClick={handlePrint}>
                    Print
                </button>
                        </div>
                        

                        <div class="receipt-container">
        <pre class="receipt-text">
            *************************************************
            {'\n'}   RECEIPT
            {'\n'}*************************************************
        </pre>
    </div>
    <pre class="receipt-text">
    TERMINAL#132f2wd33
    {'\n'}_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
    </pre>

                        <br></br>

              <table className="order-table w-full border-collapse border border-gray-300">
    <thead>
        <tr>
            <th className="border border-gray-300 p-2 text-left">Order</th>
            <th className="border border-gray-300 p-2 text-left">Quantity</th>
            <th className="border border-gray-300 p-2 text-left">Price</th>
            <th className="border border-gray-300 p-2 text-left">Total Price</th>
        </tr>
    </thead>
    <tbody>
        {orderbyTableId.map(order => (
            <tr key={order._id}>
                <td className="border border-gray-300 p-2">{order.order_title}</td>
                <td className="border border-gray-300 p-2">{order.order_quantity}</td>
                <td className="border border-gray-300 p-2">{order.order_price}</td>
                <td className="border border-gray-300 p-2">{order.final_price}</td>
            </tr>
        ))}
    </tbody>
</table>
        <br></br>


                        <p>Total bill: NRs. {total_price}</p>
                        
                        <p id="discount-section">
                    Discount: 
                    <input
                        className="px-8 py-2 border-none border-b border-gray-500 focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="discount"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                </p>
                     


                        <p>Final bill: NRs. {totalFinalbill}</p>
                        {/* You can add more details here if necessary */}
                        <pre class="receipt-text">
                        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                        {'\n'}*************************** THANK YOU!  ***************************
    {'\n'}_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    </pre>
                    </div>
                )}
            </Modal>
        </>
    );
}