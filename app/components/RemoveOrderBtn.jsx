"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveOrderBtn({ id }) {
    const router = useRouter();

    const removeOrder = async () => {
        const confirmed = confirm("Are you sure?");
        if (confirmed) {
            const res = await fetch(`http://localhost:3000/api/orders?id=${id}`, {
              method: "DELETE",
            });
            if (res.ok) {
                router.refresh();
              }
    }
}
    return (
        <button onClick={removeOrder} className="text-red-500">
        <HiOutlineTrash size={24} />
        </button>
    )
}