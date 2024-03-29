import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AddTable() {
    return (
        <div>
 <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
      <Link className="text-white font-bold" href={"/"}>
    MiZone
      </Link></nav>
              <form className="flex flex-col gap-3">
            <input className="border border-slate-500 px-8 py-2" type="text" placeholder="Table Name" />
            <input className="border border-slate-500 px-8 py-2" type="text" placeholder="Table description" />
        <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Add table
        </button>
        </form>
        </div>
    )
}