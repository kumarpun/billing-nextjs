"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiFileText, FiDollarSign, FiCheckCircle, FiPrinter } from 'react-icons/fi';
import Modal from './ModalForm';
import AddBillForm from './AddBillForm';
import EditBillForm from './EditBillForm';

const STEPS = [
    { number: 1, label: 'Generate Bill', icon: FiFileText },
    { number: 2, label: 'Pay Bill', icon: FiDollarSign },
    { number: 3, label: 'Customer Left', icon: FiCheckCircle },
];

function StepIndicator({ step, status, onClick, onDisabledClick }) {
    const Icon = step.icon;
    const isClickable = status === 'current' || status === 'completed';

    const styles = {
        completed: {
            circle: 'bg-green-500 border-green-500 text-white',
            label: 'text-green-400 font-medium',
        },
        current: {
            circle: 'bg-indigo-500 border-indigo-500 text-white ring-4 ring-indigo-500/30',
            label: 'text-indigo-300 font-semibold',
        },
        future: {
            circle: 'bg-gray-700 border-gray-600 text-gray-500',
            label: 'text-gray-500',
        },
    };

    const s = styles[status];

    const handleClick = () => {
        if (isClickable) {
            onClick();
        } else {
            onDisabledClick();
        }
    };

    return (
        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <button
                type="button"
                onClick={handleClick}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${s.circle} ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}`}
            >
                {status === 'completed' ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <Icon className="text-sm sm:text-lg" />
                )}
            </button>
            <span className={`mt-1 sm:mt-1.5 text-[0.6rem] sm:text-xs text-center leading-tight ${s.label}`}>{step.label}</span>
        </div>
    );
}

function StepConnector({ completed }) {
    return (
        <div className={`flex-1 h-0.5 mx-0.5 sm:mx-1 mt-4 sm:mt-5 transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-gray-700'}`} />
    );
}

export default function BillingStepper({
    currentStep,
    onPrintBill,
    // Step 1 props
    totalPrice,
    totalKitchenPrice,
    totalBarPrice,
    tablebillId,
    // Step 2 props
    hasNewOrders,
    // Step 3 props
    tableId,
    // Callback
    onStepAction,
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [modalStep, setModalStep] = useState(null);

    const getStepStatus = (stepNumber) => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'current';
        return 'future';
    };

    const handleBillAdded = () => {
        setModalStep(null);
        router.refresh();
        if (onStepAction) onStepAction();
    };

    const handleCustomerLeft = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${tableId}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ newCustomerStatus: "Customer left" }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success("Customer marked as left!");
            setModalStep(null);
            router.refresh();
            if (onStepAction) onStepAction();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update customer status");
        } finally {
            setLoading(false);
        }
    };

    const handleDisabledClick = () => {
        const currentLabel = STEPS[currentStep - 1]?.label;
        toast.error(`Please complete "${currentLabel}" first`);
    };

    return (
        <>
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-2.5 sm:p-4 mb-3 sm:mb-4">
                {/* Header with Print button */}
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <h2 className="text-xs sm:text-sm font-semibold text-gray-300">Billing</h2>
                    <button
                        onClick={onPrintBill}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-md font-medium text-xs transition-all duration-200 shadow hover:shadow-md"
                    >
                        <FiPrinter className="text-sm" />
                        Print
                    </button>
                </div>

                {/* Step indicators bar */}
                <div className="flex items-start justify-center px-0 sm:px-2">
                    {STEPS.map((step, index) => (
                        <div key={step.number} className="contents">
                            <StepIndicator
                                step={step}
                                status={getStepStatus(step.number)}
                                onClick={() => setModalStep(step.number)}
                                onDisabledClick={handleDisabledClick}
                            />
                            {index < STEPS.length - 1 && (
                                <StepConnector completed={currentStep > step.number} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for step action */}
            <Modal isOpen={modalStep !== null} onClose={() => setModalStep(null)}>
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                        {modalStep && STEPS[modalStep - 1]?.label}
                    </h2>

                    {modalStep === 1 && (
                        <AddBillForm
                            initialOriginalPrice={totalPrice}
                            initialKitchenPrice={totalKitchenPrice}
                            initialBarPrice={totalBarPrice}
                            initialBillId={tablebillId}
                            onBillAdded={handleBillAdded}
                        />
                    )}

                    {modalStep === 2 && (
                        <div>
                            {hasNewOrders && (
                                <div className="mb-3 px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-800 text-xs text-center">
                                    New orders added — update bill before paying.
                                </div>
                            )}
                            <EditBillForm
                                id={tablebillId}
                                bill={totalPrice}
                                finalPrice={totalPrice}
                                onBillAdded={handleBillAdded}
                            />
                        </div>
                    )}

                    {modalStep === 3 && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-black mb-1">Bill Paid Successfully</h3>
                            <p className="text-gray-500 text-sm mb-6">Confirm when the customer has left the table.</p>
                            <button
                                onClick={handleCustomerLeft}
                                disabled={loading}
                                className={`w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 shadow hover:shadow-md ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Updating...' : 'Customer Left'}
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
