import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import ActionBtn from  "./ActionBtn";

const getTables = async() => {
    try {
      const res =  await fetch('http://localhost:3000/api/tables', {
            cache: 'no-store',
        });
        if(!res.ok) {
            throw new Error("Failed to fetch tables");
        }
        return res.json();
    } catch (error) {
        console.error("Error loading tables: ", error);
    }
}

export default async function TableList() {
    const { tables } = await getTables();
    return (
        <>
        {tables.map(t => (
        <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
            <div>
                <h2 className="font-bold text-2xl">{t.title}</h2>
                <div>{t.description}</div>
            </div>
        <div>
        {/* <RemoveBtn id={t._id} /> */}
        <Link href={`/listOrder/${t._id}`}>
        <ActionBtn />
        </Link>
        <Link href={`/editTable/${t._id}`}>
        <HiPencilAlt size={24} />
        </Link>
        </div>
        </div>
        ))}
        </>
    )
}