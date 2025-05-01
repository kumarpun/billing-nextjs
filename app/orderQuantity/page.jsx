import Link from "next/link";
import OrderQuantityDetails from "../components/orderDetailsClient";

export default async function OrderQuantity() {
    return (
        <>
             <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/listSales"}>
      HYBE Food & Drinks
      </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href="/listSales">
                        Back
                    </Link>
                </div>
            </nav>
            <div>
                <OrderQuantityDetails /> {/* Use the client component here */}
            </div>
        </>
    )
}