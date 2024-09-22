import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import ActionBtn from  "./ActionBtn";

const getTables = async() => {
    try {
      const res =  await fetch('https://billing-nextjs.vercel.app/api/tables', {
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
         <hr className="separator" />
         <div className="bg-page">
        {tables.map(t => (
        // <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
            <div key={t._id} className="dashboard">
                <div className="card color1">
            <div>
                <div className="font-bold text-2xl">{t.title}</div>
                <div>{t.description}</div>
            </div>
        <div>
        {/* <RemoveBtn id={t._id} /> */}
        <Link className="icon" href={`/listOrder/${t._id}`}>
        <ActionBtn />
        </Link>
        {/* <Link className= "icon" href={`/editTable/${t._id}`}>
        <HiPencilAlt size={24} />
        </Link> */}
        </div>
        </div>
        </div>
        ))}
        </div>
        </>
    )
}