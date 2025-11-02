"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import { FiPlus, FiMinus, FiPrinter, FiDollarSign, FiEdit, FiFileText } from "react-icons/fi";
import RemoveOrderBtn from "./RemoveOrderBtn";
import AddBillForm from "./AddBillForm";
import Modal from "./ModalForm";
import EditBillForm from "./EditBillForm";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function OrderListClient({ orderbyTableId, total_price, totalKitchenPrice, totalBarPrice, tablebill_id, tableTitle, tableId, billById, totalFinalbill, billFinalStatus, order_type }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [discount, setDiscount] = useState('');
    const [updating, setUpdating] = useState(null);
    const [displayFinalAmount, setDisplayFinalAmount] = useState(totalFinalbill);
    const router = useRouter();

    // Smart final amount calculation - FIXED LOGIC
    useEffect(() => {
        if (totalFinalbill > 0) {
            // Bill has been generated
            if (total_price > totalFinalbill) {
                // New orders were added after bill generation
                // Show current total price as pending update
                setDisplayFinalAmount(total_price);
            } else if (total_price < totalFinalbill) {
                // This case shouldn't normally happen as totalFinalbill includes discount
                // But if orders were deleted, show the adjusted amount
                setDisplayFinalAmount(total_price);
            } else {
                // No order changes after bill generation
                // Show the original discounted bill amount
                setDisplayFinalAmount(totalFinalbill);
            }
        } else {
            // No bill generated yet
            setDisplayFinalAmount(0);
        }
    }, [total_price, totalFinalbill]);

    const handleOpenModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalContent(null);
    }

    const handleBillAdded = () => {
        setModalOpen(false);
        router.refresh();
    }

    const handlePrint = () => {
        const discountElement = document.getElementById('discount-section');
        if (discount === '') {
            discountElement.style.display = 'none';
        }
        window.print();
        discountElement.style.display = '';
    }

    const handleQuantityChange = async (orderId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        setUpdating(orderId);

        try {
            const res = await fetch(
                `https://billing-nextjs.vercel.app/api/orders/${orderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        newOrderTitle: null,
                        newOrderDescription: null,
                        newOrderStatus: null,
                        newOrderQuantity: newQuantity,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update order quantity");
            }

            toast.success("Order quantity updated!");
            router.refresh();
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Failed to update order quantity");
        } finally {
            setUpdating(null);
        }
    };

    // Check order status - FIXED LOGIC
    const hasBillGenerated = totalFinalbill > 0;

    // Get the original order total when bill was generated from billById
    // This is the order total BEFORE any discount was applied
    // billById is an array, so we access the first element
    const originalBillTotal = billById && billById.length > 0 ? billById[0].originalPrice : null;

    // Check if bill has been updated after new orders were added
    // If totalFinalbill > originalBillTotal, it means the bill was updated to include new orders
    const billWasUpdated = hasBillGenerated && originalBillTotal && totalFinalbill > originalBillTotal;

    // If we have original bill total, use it for comparison
    // Otherwise fall back to checking if current total matches or exceeds final bill
    const hasNewOrders = hasBillGenerated && !billWasUpdated && (
        originalBillTotal ? total_price > originalBillTotal : total_price > totalFinalbill
    );

    // Orders deleted only if we're sure orders were removed (not just discount applied)
    const hasDeletedOrders = hasBillGenerated && !billWasUpdated && originalBillTotal && total_price < originalBillTotal;

    // No order changes if current price equals original bill price
    const noOrderChanges = hasBillGenerated && !billWasUpdated && !hasNewOrders && !hasDeletedOrders && (
        originalBillTotal ? total_price === originalBillTotal : total_price <= totalFinalbill
    );

    const pendingAmount = hasNewOrders ? total_price - (originalBillTotal || totalFinalbill) : 0;

    // Determine what to display in the final amount section - FIXED LOGIC
    const getFinalAmountDisplay = () => {
        if (!hasBillGenerated) {
            return {
                title: 'Final Amount',
                amount: 0,
                displayAmount: 0,
                status: 'No bill generated',
                bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
                showStatus: false
            };
        } else if (billWasUpdated) {
            // Bill was updated after new orders were added - show the updated final bill
            return {
                title: 'Updated Final Amount',
                amount: totalFinalbill, // Show the updated final bill amount
                displayAmount: totalFinalbill,
                status: 'Bill Updated',
                bgColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
                showStatus: true
            };
        } else if (hasNewOrders) {
            return {
                title: 'Updated Final Amount',
                amount: total_price, // Show current total including new orders
                displayAmount: total_price,
                status: 'Pending Update',
                bgColor: 'bg-gradient-to-r from-amber-600 to-orange-600',
                showStatus: true
            };
        } else if (hasDeletedOrders) {
            return {
                title: 'Adjusted Final Amount',
                amount: total_price, // Show adjusted amount
                displayAmount: total_price,
                status: 'Auto-adjusted',
                bgColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
                showStatus: true
            };
        } else {
            // No changes after bill generation - show the original discounted amount
            return {
                title: 'Final Bill Amount',
                amount: totalFinalbill, // This is the discounted amount
                displayAmount: totalFinalbill,
                status: billFinalStatus,
                bgColor: 'bg-gradient-to-r from-indigo-600 to-purple-600',
                showStatus: true
            };
        }
    };

    const finalAmountDisplay = getFinalAmountDisplay();

    return (
        <>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100 p-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-gray-800 rounded-lg shadow">
                    <div>
                        <h1 className="text-xl font-bold table-title mb-1">{tableTitle} - Orders</h1>
                        {hasNewOrders && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-md">
                                <span className="text-amber-300 text-sm font-medium">
                                    ⚡ New orders pending bill update (+NRs. {pendingAmount})
                                </span>
                            </div>
                        )}
                        {hasDeletedOrders && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-md">
                                <span className="text-green-300 text-sm font-medium">
                                    ↻ Orders deleted, bill adjusted
                                </span>
                            </div>
                        )}
                        {noOrderChanges && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-md">
                                <span className="text-blue-300 text-sm font-medium">
                                    ✓ Bill is accurate and up to date
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                        {!hasBillGenerated && (
                            <button 
                                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-md font-medium text-sm transition-all duration-200 shadow hover:shadow-md"
                                onClick={() => handleOpenModal('add')}
                            >
                                <FiDollarSign className="text-sm" />
                                Generate Bill
                            </button>
                        )}
                        
                        {hasBillGenerated && (
                            <button 
                                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md font-medium text-sm transition-all duration-200 shadow hover:shadow-md"
                                onClick={() => handleOpenModal('edit')}
                            >
                                <FiEdit className="text-sm" />
                                {hasNewOrders ? 'Update Bill' : 'Modify Bill'}
                            </button>
                        )}
                        
                        <button 
                            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-md font-medium text-sm transition-all duration-200 shadow hover:shadow-md"
                            onClick={() => handleOpenModal('print')}
                        >
                            <FiPrinter className="text-sm" />
                            Print Bill
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Order Items</h2>
                        <span className="text-gray-400 text-sm">{orderbyTableId.length} items</span>
                    </div>

                    {!orderbyTableId || orderbyTableId.length === 0 ? (
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">🍽️</div>
                            <h3 className="text-lg font-medium mb-1">No orders found</h3>
                            <p className="text-gray-400 text-sm">This table doesn't have any orders yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orderbyTableId.map(order => (
                                <div key={order._id} className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-all duration-200 border border-gray-700">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-base font-semibold text-white truncate">{order.order_title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.order_type === 'kitchen' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {order.order_type}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-400 text-xs mb-3 truncate">{order.order_description}</p>
                                    
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-xs">
                                            <span className="text-gray-400">Price: </span>
                                            <span className="font-medium">NRs. {order.order_price}</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-gray-400">Status: </span>
                                            <span className="font-medium">{order.order_status}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(order._id, order.order_quantity, -1)}
                                                disabled={updating === order._id}
                                                className={`p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors ${updating === order._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                <FiMinus className="text-sm" />
                                            </button>
                                            
                                            <span className="text-base font-bold px-1 min-w-[1.5rem] text-center">
                                                {order.order_quantity}
                                            </span>
                                            
                                            <button
                                                onClick={() => handleQuantityChange(order._id, order.order_quantity, 1)}
                                                disabled={updating === order._id}
                                                className={`p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors ${updating === order._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                <FiPlus className="text-sm" />
                                            </button>
                                        </div>
                                        
                                        <div className="text-base font-bold text-white">
                                            NRs. {order.final_price}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                        <RemoveOrderBtn id={order._id} />
                                        
                                        <Link 
                                            href={`/editOrder/${order._id}?order_quantity=${order.order_quantity}`}
                                            className="p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                                        >
                                            <HiPencilAlt size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                <div className="bg-gray-800 rounded-lg p-4 shadow">
                    <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Bill Summary</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900 p-3 rounded-md">
                            <div className="text-gray-400 text-xs mb-1">Current Order Total</div>
                            <div className="text-xl font-bold text-white">NRs. {total_price}</div>
                            <div className="text-gray-500 text-xs mt-1">Sum of all orders</div>
                        </div>
                        
                        <div className={`p-3 rounded-md ${finalAmountDisplay.bgColor}`}>
                            <div className="text-xs text-white/80 mb-1">
                                {finalAmountDisplay.title}
                            </div>
                            <div className="text-2xl font-bold text-white">NRs. {finalAmountDisplay.displayAmount}</div>
                            {finalAmountDisplay.showStatus && (
                                <div className="text-white/80 text-xs mt-1">
                                    Status: {finalAmountDisplay.status}
                                    {hasBillGenerated && !hasNewOrders && !hasDeletedOrders && (
                                        <div className="text-green-300 mt-1">
                                            ✓ Includes discount
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {hasNewOrders && (
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-md">
                                <div className="text-xs text-amber-100 mb-1">Pending Amount</div>
                                <div className="text-xl font-bold text-white">+NRs. {pendingAmount}</div>
                                <div className="text-amber-100 text-xs mt-1">New orders added after bill</div>
                            </div>
                        )}

                        {noOrderChanges && hasBillGenerated && (
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-md">
                                <div className="text-xs text-blue-100 mb-1">Discount Applied</div>
                                <div className="text-xl font-bold text-white">-NRs. {(originalBillTotal || total_price) - totalFinalbill}</div>
                                <div className="text-blue-100 text-xs mt-1">Original: NRs. {originalBillTotal || total_price}</div>
                            </div>
                        )}
                    </div>

                    {/* Bill Status Summary */}
                    {hasBillGenerated && (
                        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
                            <div className="text-xs text-gray-400 mb-2">Bill Status Summary</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-400">Order Total: </span>
                                    <span className="font-medium">NRs. {originalBillTotal || total_price}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Final Bill: </span>
                                    <span className="font-medium">NRs. {totalFinalbill}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Discount: </span>
                                    <span className="font-medium text-green-400">-NRs. {(originalBillTotal || total_price) - totalFinalbill}</span>
                                </div>
                                <div className={`font-semibold ${
                                    hasNewOrders ? 'text-amber-400' :
                                    'text-green-400'
                                }`}>
                                    {hasNewOrders ? `+NRs. ${pendingAmount} pending` :
                                     'Bill is finalized'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {modalContent === 'add' && (
                    <AddBillForm 
                        initialOriginalPrice={total_price}
                        initialKitchenPrice={totalKitchenPrice}
                        initialBarPrice={totalBarPrice}
                        initialBillId={tablebill_id} 
                        order_type={order_type} 
                        onBillAdded={handleBillAdded} 
                    />
                )}
                {modalContent === 'edit' && (
                    <EditBillForm 
                        id={tablebill_id} 
                        bill={total_price}
                        onBillAdded={handleBillAdded} 
                    />
                )}
           
                {modalContent === 'print' && (
                    <div className="bill-print text-black" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>
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

                        <p>Total orders: NRs. {total_price}</p>
                    
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

                        <p className="font-bold text-lg">Final bill: NRs. {finalAmountDisplay.displayAmount}</p>

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