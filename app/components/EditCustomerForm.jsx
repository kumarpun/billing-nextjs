"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select';

export default function EditCustomerForm({ id, customer_status }) {
    const [newCustomerStatus, setNewCustomerStatus] = useState(customer_status);
    const [touched, setTouched] = useState(false); // To track if the select has been touched

    const options = [
        { value: 'Customer left', label: 'Customer left' }
    ];

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true); // Mark the select as touched on submit

        // Check if a valid option is selected
        if (!newCustomerStatus) {
            // If no selection is made, simply return and display the required message
            return; // Stop form submission
        }

        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ newCustomerStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update customer status");
            }
            // On successful update, refresh the router
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    const Dropdown = (selectedOption) => {
        console.log('Selected:', selectedOption);
        setNewCustomerStatus(selectedOption ? selectedOption.value : null); // Handle when no option is selected
    };

    // Custom styles for react-select
    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 400,
            borderColor: touched && !newCustomerStatus ? 'green' : provided.borderColor, // Change border color if required
            boxShadow: 'none',
            '&:hover': {
                borderColor: touched && !newCustomerStatus ? 'green' : provided.borderColor, // Change border color on hover if required
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: touched && !newCustomerStatus ? 'green' : provided.color, // Change placeholder color if required
        }),
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-[#283141]">
                <br />
                <label className="customer-label ml-4">Select If Customer Left:</label>
                <div className="flex items-center gap-3 ml-4">
                    <Select
                        options={options}
                        onChange={Dropdown}
                        value={options.find(option => option.value === newCustomerStatus) || null} // Handle value for react-select
                        styles={customStyles} // Apply custom styles
                        className="text-black"
                        placeholder={touched && !newCustomerStatus ? "Please select customer left (Click here)" : "Select an option"} // Change placeholder if required
                    />
                    <button className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button">
                        Update Customer
                    </button>
                </div>
            </form>
        </>
    );
}
