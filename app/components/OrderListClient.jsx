"use client";

import { useState } from 'react';
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveOrderBtn from "./RemoveOrderBtn";
import EditCustomerForm from "./EditCustomerForm";
import AddBillForm from "./AddBillForm";
import Modal from "./ModalForm";
import EditBillForm from "./EditBillForm";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function OrderListClient({ orderbyTableId, total_price, totalKitchenPrice, totalBarPrice, tablebill_id, tableTitle, tableId, billById, totalFinalbill, billFinalStatus, order_type }) {
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

    const [updating, setUpdating] = useState(null); // Track updating item ID
    const router = useRouter(); // To refresh the data after update
    const handleQuantityChange = async (orderId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return; // Prevent quantity going below 1
    
        setUpdating(orderId); // Set the loading state for this order
    
        try {
          const res = await fetch(
            `https://billing-nextjs.vercel.app/api/orders/${orderId}`,
            {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                newOrderTitle: null, // Optional placeholder, adjust if needed
                newOrderDescription: null,
                newOrderStatus: null,
                newOrderQuantity: newQuantity,
              }),
            }
          );
    
          if (!res.ok) {
            throw new Error("Failed to update order quantity");
          }
    
          // Show success message
          toast.success("Order quantity updated!");
    
          // Refresh data
          router.refresh();
        } catch (error) {
          console.error("Error updating quantity:", error);
          toast.error("Failed to update order quantity");
        } finally {
          setUpdating(null); // Reset loading state
        }
      };

    return (
        <>
    <div className="bg-[#283141]">
            <div style={{ display: 'flex', gap: '12px' }}>
            {/* <button className="px-6 py-2 mt-3 add-table" onClick={() => handleOpenModal('add')}
            disabled={totalFinalbill > 0} >
                    Generate Bill
                </button> */}
                 {totalFinalbill <= 0 && (
                    <button className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" onClick={() => handleOpenModal('add')}>
                        Generate Bill
                    </button>
                )}
                     {/* {totalFinalbill > 0 && ( */}
                    <button className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" onClick={() => handleOpenModal('edit')}>
                        Update Bill
                    </button>
                {/* )} */}
                {/* <button className="px-6 py-2 mt-3 add-table" onClick={() => handleOpenModal('edit')}>
                    Update Bill
                </button> */}
                                     {/* {total_price > 0 && (
                <button className="px-6 py-2 mt-3 add-table" onClick={() => handleOpenModal('print')}>
                    Print Bill
                </button>
            )} */}
                                  {/* {totalFinalbill > 0 && ( */}
                <button className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" onClick={() => handleOpenModal('print')}>
                    Print Bill
                </button>
            {/* )} */}
            </div>

            {
                !orderbyTableId || orderbyTableId.length === 0 ? <span className="font-color1">No orders found for this table.</span> : ''
            }
        <div className="order-list-container max-h-[calc(3*10rem)] overflow-y-scroll custom-scrollbar">

            {orderbyTableId.map(order => (

                <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start relative font-color1" key={order._id}>
                    <div>
                        <h3 className="font-bold text-2xl">{order.order_title}</h3>
                        <div>{order.order_description}</div>
                        <div>{order.order_status}</div>
                        <div>{order.customer_status}</div>
                        <div>Order price: NRs. {order.order_price}</div>
                        <div>Order quantity: {order.order_quantity}</div>
                        {/* <div>Sum: NRs. {order.final_price}</div> */}
                        <div className="bg-green-600">Order type: {order.order_type}</div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">

                    <div className="flex items-center gap-2 mt-2 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">     
                  <button
                    onClick={() =>
                      handleQuantityChange(order._id, order.order_quantity, -1)
                    }
                    disabled={updating === order._id}
                    className={`px-6 py-4 text-3xl hover:text-gray-300 font-medium transition-colors duration-200 nav-button ${
                      updating === order._id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">{order.order_quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(order._id, order.order_quantity, 1)
                    }
                    disabled={updating === order._id}
                    className={`px-6 py-4 text-3xl hover:text-gray-300 font-medium transition-colors duration-200 nav-button ${
                      updating === order._id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    +
                  </button>
                    </div>

                         <div className="absolute right-40 top-1/3 mt-2 mr-2 text-3xl sum font-color1">
                        NRs. {order.final_price}
                    </div>
                </div>


                    <div>
                    <RemoveOrderBtn id={order._id} />
                        {/* <Link href={`/editOrder/${order._id}`}> */}
                        <Link href={`/editOrder/${order._id}?order_quantity=${order.order_quantity}`}>
                            <HiPencilAlt className="edit-icon font-color1" size={24} />
                        </Link>
                    </div>
                </div>
            ))}
            </div>
    
{/* {orderbyTableId.length > 0 && (
                <table className="order-table w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 text-left">Order Title</th>
                            <th className="border border-gray-300 p-2 text-left">Description</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                            <th className="border border-gray-300 p-2 text-left">Customer Status</th>
                            <th className="border border-gray-300 p-2 text-left">Order Price</th>
                            <th className="border border-gray-300 p-2 text-left">Quantity</th>
                            <th className="border border-gray-300 p-2 text-left">Sum</th>
                            <th className="border border-gray-300 p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderbyTableId.map(order => (
                            <tr key={order._id}>
                                <td className="border border-gray-300 p-2">{order.order_title}</td>
                                <td className="border border-gray-300 p-2">{order.order_description}</td>
                                <td className="border border-gray-300 p-2">{order.order_status}</td>
                                <td className="border border-gray-300 p-2">{order.customer_status}</td>
                                <td className="border border-gray-300 p-2">NRs. {order.order_price}</td>
                                <td className="border border-gray-300 p-2">{order.order_quantity}</td>
                                <td className="border border-gray-300 p-2">NRs. {order.final_price}</td>
                                <td className="border border-gray-300 p-2">
                                    <RemoveOrderBtn id={order._id} />
                                    <Link href={`/editOrder/${order._id}`}>
                                        <HiPencilAlt className="edit-icon" size={24} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )} */}

            <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold font-color1">Total bill: NRs. {total_price}</p>  
            {/* <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold">Total Kitchen bill: NRs. {totalKitchenPrice}</p>  
            <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold">Total Bar bill: NRs. {totalBarPrice}</p>   */}

        
             <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold font-color1">Final bill: NRs. {totalFinalbill} status: {billFinalStatus}</p>                
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {/* <AddBillForm initialOriginalPrice={total_price} initialBillId={tablebill_id} onBillAdded={handleBillAdded} /> */}
                {modalContent === 'add' && (
                    <AddBillForm initialOriginalPrice={total_price}
                    initialKitchenPrice={totalKitchenPrice}
                    initialBarPrice={totalBarPrice}
                    initialBillId={tablebill_id} order_type={order_type} onBillAdded={handleBillAdded} />
                )}
                {modalContent === 'edit' && (
                    <EditBillForm id={tablebill_id} bill={totalFinalbill} onBillAdded={handleBillAdded} />
                )}
                    {modalContent === 'print' && (
    <div className="bill-print" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button className="px-6 py-2 mt-3 add-table ml-auto" onClick={handlePrint}>
                Print
            </button>
        </div>

        <div className="receipt-container">
            <pre className="receipt-text">
                *************************************************
                {'\n'}   THE HYBE ({tableTitle})
                {'\n'}*************************************************
            </pre>
        </div>

        <pre className="receipt-text">
            TERMINAL#132f2wd33
            {/* {'\n'}_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _  */}
        </pre>

        <br />

        <div className="table-wrapper">
            <table className="order-table w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left">Order</th>
                        <th className="border border-gray-300 p-2 text-left">Qty</th>
                        <th className="border border-gray-300 p-2 text-left">Price</th>
                        <th className="border border-gray-300 p-2 text-left">Total</th>
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
        </div>

        <br />

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

        <pre className="receipt-text">
            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
            {'\n'}*************************** THANK YOU! ***************************
            {'\n'}_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
        </pre>
    </div>
)}


            </Modal>
        </>
    );
}