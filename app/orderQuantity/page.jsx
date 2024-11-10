import Link from "next/link";
import OrderQuantityDetails from "../components/orderDetailsClient";

export default async function OrderQuantity() {
    return (
        <>
            <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
                <div style={{ flex: 0.07 }}></div>
                <Link className="page-title font-bold" href="/">
                    {Array.from("HYBE Food & Drinks").map((char, index) => (
                        <span key={index} className={`char-${index}`}>{char}</span>
                    ))}
                </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link className="px-6 py-2 mt-3 add-table" href="/">
                        Back
                    </Link>
                </div>
            </nav>
            <hr className="separator" />
            <div>
                <OrderQuantityDetails /> {/* Use the client component here */}
            </div>
        </>
    )
}