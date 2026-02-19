"use client";

import { useState, useCallback } from 'react';
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import { FiPlus, FiMinus } from "react-icons/fi";
import RemoveOrderBtn from "./RemoveOrderBtn";
import Modal from "./ModalForm";
import BillingStepper from "./BillingStepper";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function OrderListClient({ orderbyTableId, total_price, totalKitchenPrice, totalBarPrice, tablebill_id, tableTitle, tableId, billById, totalFinalbill, billFinalStatus }) {
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [discount, setDiscount] = useState('');
    const [updating, setUpdating] = useState(null);
    const router = useRouter();

    const handlePrint = useCallback(() => {
        const discountElement = document.getElementById('discount-section');
        if (discount === '') {
            discountElement.style.display = 'none';
        }
        window.print();
        discountElement.style.display = '';
    }, [discount]);

    const handleQuantityChange = useCallback(async (orderId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        setUpdating(orderId);

        try {
            const res = await fetch(
                `/api/orders/${orderId}`,
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
    }, [router]);

    // Bill state detection
    const hasBillGenerated = totalFinalbill > 0;
    const originalBillTotal = billById && billById.length > 0 ? billById[0].originalPrice : null;
    const billWasUpdated = hasBillGenerated && originalBillTotal && totalFinalbill > originalBillTotal;
    const hasNewOrders = hasBillGenerated && !billWasUpdated && (
        originalBillTotal ? total_price > originalBillTotal : total_price > totalFinalbill
    );
    const hasDeletedOrders = hasBillGenerated && !billWasUpdated && originalBillTotal && total_price < originalBillTotal;
    const noOrderChanges = hasBillGenerated && !billWasUpdated && !hasNewOrders && !hasDeletedOrders && (
        originalBillTotal ? total_price === originalBillTotal : total_price <= totalFinalbill
    );
    const pendingAmount = hasNewOrders ? total_price - (originalBillTotal || totalFinalbill) : 0;

    // Stepper step detection
    const currentStep = (() => {
        const hasBillPaidOrders = orderbyTableId.some(
            order => order.customer_status === "Bill paid"
        );
        if (hasBillPaidOrders) return 3;
        if (hasBillGenerated) return 2;
        return 1;
    })();

    // Final amount display for summary and print
    const getFinalAmountDisplay = () => {
        if (!hasBillGenerated) {
            return { title: 'Final Amount', displayAmount: 0, status: 'No bill generated', bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700', showStatus: false };
        } else if (billWasUpdated) {
            return { title: 'Updated Final Amount', displayAmount: totalFinalbill, status: 'Bill Updated', bgColor: 'bg-gradient-to-r from-green-600 to-emerald-600', showStatus: true };
        } else if (hasNewOrders) {
            return { title: 'Updated Final Amount', displayAmount: total_price, status: 'Pending Update', bgColor: 'bg-gradient-to-r from-amber-600 to-orange-600', showStatus: true };
        } else if (hasDeletedOrders) {
            return { title: 'Adjusted Final Amount', displayAmount: total_price, status: 'Auto-adjusted', bgColor: 'bg-gradient-to-r from-green-600 to-emerald-600', showStatus: true };
        } else {
            return { title: 'Final Bill Amount', displayAmount: totalFinalbill, status: billFinalStatus, bgColor: 'bg-gradient-to-r from-indigo-600 to-purple-600', showStatus: true };
        }
    };

    const finalAmountDisplay = getFinalAmountDisplay();

    return (
        <>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100 p-2 sm:p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-800 rounded-lg shadow">
                    <h1 className="text-base sm:text-xl font-bold table-title truncate">{tableTitle} - Orders</h1>
                    <span className="text-gray-400 text-xs sm:text-sm shrink-0 ml-2">{orderbyTableId.length} items</span>
                </div>

                {/* Billing Stepper (collapsed by default, click step icon to expand) */}
                {orderbyTableId && orderbyTableId.length > 0 && (
                    <BillingStepper
                        currentStep={currentStep}
                        onPrintBill={() => setIsPrintOpen(true)}
                        totalPrice={total_price}
                        totalKitchenPrice={totalKitchenPrice}
                        totalBarPrice={totalBarPrice}
                        tablebillId={tablebill_id}
                        hasNewOrders={hasNewOrders}
                        tableId={tableId}
                        onStepAction={() => {}}
                    />
                )}

                {/* Orders List */}
                {!orderbyTableId || orderbyTableId.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-6 text-center mb-4">
                        <div className="text-3xl mb-3">🍽️</div>
                        <h3 className="text-lg font-medium mb-1">No orders found</h3>
                        <p className="text-gray-400 text-sm">This table doesn't have any orders yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">
                        {orderbyTableId.map(order => (
                            <div key={order._id} className="bg-gray-800 rounded-lg p-2 sm:p-3 shadow hover:shadow-md transition-all duration-200 border border-gray-700">
                                <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                                    <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{order.order_title}</h3>
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[0.6rem] sm:text-xs font-medium shrink-0 ${order.order_type === 'kitchen' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                        {order.order_type}
                                    </span>
                                </div>

                                {order.order_description && (
                                    <p className="text-gray-400 text-[0.65rem] sm:text-xs mb-1.5 sm:mb-2 truncate">{order.order_description}</p>
                                )}

                                <div className="flex items-center justify-between mb-1.5 sm:mb-2 flex-wrap gap-1">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => handleQuantityChange(order._id, order.order_quantity, -1)}
                                            disabled={updating === order._id}
                                            className={`p-0.5 sm:p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors ${updating === order._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <FiMinus className="text-xs sm:text-sm" />
                                        </button>

                                        <span className="text-xs sm:text-sm font-bold px-0.5 min-w-[1.2rem] text-center">
                                            {order.order_quantity}
                                        </span>

                                        <button
                                            onClick={() => handleQuantityChange(order._id, order.order_quantity, 1)}
                                            disabled={updating === order._id}
                                            className={`p-0.5 sm:p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors ${updating === order._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <FiPlus className="text-xs sm:text-sm" />
                                        </button>
                                    </div>

                                    <div className="text-xs sm:text-sm font-bold text-white">
                                        NRs. {order.final_price}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-gray-700">
                                    <RemoveOrderBtn id={order._id} />
                                    <span className={`text-[0.6rem] sm:text-xs ${order.order_status === 'completed' ? 'text-green-400' : 'text-gray-500'}`}>{order.order_status}</span>
                                    <Link
                                        href={`/editOrder/${order._id}?order_quantity=${order.order_quantity}`}
                                        className="p-0.5 sm:p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                                    >
                                        <HiPencilAlt size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bill Summary */}
                <div className="bg-gray-800 rounded-lg p-2.5 sm:p-4 shadow">
                    <h2 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 pb-2 border-b border-gray-700">Bill Summary</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div className="bg-gray-900 p-2 sm:p-3 rounded-md">
                            <div className="text-gray-400 text-[0.6rem] sm:text-xs mb-0.5">Current Order Total</div>
                            <div className="text-sm sm:text-xl font-bold text-white">NRs. {total_price}</div>
                        </div>

                        <div className={`p-2 sm:p-3 rounded-md ${finalAmountDisplay.bgColor}`}>
                            <div className="text-[0.6rem] sm:text-xs text-white/80 mb-0.5">
                                {finalAmountDisplay.title}
                            </div>
                            <div className="text-sm sm:text-2xl font-bold text-white">NRs. {finalAmountDisplay.displayAmount}</div>
                            {finalAmountDisplay.showStatus && (
                                <div className="text-white/80 text-[0.6rem] sm:text-xs mt-0.5">
                                    {finalAmountDisplay.status}
                                </div>
                            )}
                        </div>

                        {hasNewOrders && (
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-2 sm:p-3 rounded-md">
                                <div className="text-[0.6rem] sm:text-xs text-amber-100 mb-0.5">Pending Amount</div>
                                <div className="text-sm sm:text-xl font-bold text-white">+NRs. {pendingAmount}</div>
                            </div>
                        )}

                        {noOrderChanges && hasBillGenerated && (
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 sm:p-3 rounded-md">
                                <div className="text-[0.6rem] sm:text-xs text-blue-100 mb-0.5">Discount Applied</div>
                                <div className="text-sm sm:text-xl font-bold text-white">-NRs. {(originalBillTotal || total_price) - totalFinalbill}</div>
                            </div>
                        )}
                    </div>

                    {hasBillGenerated && (
                        <div className="bg-gray-900/50 p-2 sm:p-3 rounded-md border border-gray-700">
                            <div className="text-[0.6rem] sm:text-xs text-gray-400 mb-1.5">Bill Status Summary</div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 text-xs sm:text-sm">
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
                                <div className={`font-semibold ${hasNewOrders ? 'text-amber-400' : 'text-green-400'}`}>
                                    {hasNewOrders ? `+NRs. ${pendingAmount} pending` : 'Bill is finalized'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Print Modal */}
            <Modal isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)}>
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
            </Modal>
        </>
    );
}
