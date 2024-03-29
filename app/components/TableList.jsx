import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";

export default function TableList() {
    return (
        <>
        <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
            <div>
                <h2 className="font-bold text-2xl">Table list</h2>
                <div>Description</div>
            </div>
        <div>
        <RemoveBtn />
        <Link href={'/editTable/1'}>
        <HiPencilAlt size={24} />
        </Link>
        </div>
        </div>
        </>
    )
}