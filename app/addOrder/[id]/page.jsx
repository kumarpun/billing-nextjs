

export default function AddOrder() {
    return (
        <form className="flex flex-col gap-3">
             <input
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Order name" />
             <input
            className="border border-slate-500 px-8 py-2" type="text" placeholder="Order description" />
             <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Add Order
        </button>
        </form>
    )
}