"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveBtn({ id }) {
    const router = useRouter();

    const removeTable = async () => {
        const confirmed = confirm("Are you sure?");
        if (confirmed) {
            const res = await fetch(`https://billing-nextjs.vercel.app/api/tables?id=${id}`, {
              method: "DELETE",
            });
            if (res.ok) {
                router.refresh();
              }
    }
}
    return (
        <button onClick={removeTable} className="text-red-400">
        <HiOutlineTrash size={24} />
        </button>
        
    )
}