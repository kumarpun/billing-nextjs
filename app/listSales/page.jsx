import Link from "next/link";

const getSalesReport = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/orders', {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error("Failed to fetch report");
        }
        return res.json();
    } catch (error) {
        console.error("Error loading report:", error);
        return { ordersWithTables: [] }; // Return an empty array in case of error
    }
}

export default async function ListSales() {
    const { ordersWithTables } = await getSalesReport() || { ordersWithTables: [] }; // Handle undefined case

    return (
        <>
            <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
                <div style={{ flex: 0.07 }}></div>
                <Link className="page-title font-bold" href="/">
                    {Array.from("VIVID CAFE & BOOZE").map((char, index) => (
                        <span key={index} className={`char-${index}`}>{char}</span>
                    ))}
                </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link className="px-6 py-2 mt-3 add-table" href="/listReport">
                        Back
                    </Link>
                </div>
            </nav>
            <hr className="separator" />
            <div className="report-bg"></div>
            <div>
                <br />
                <div>
                    {ordersWithTables.map((sales, index) => (
                        <div key={index}>
                            <div className="font-bold text-center">Total Sales this month: NRs. {sales.total_bill}</div>
                            <div className="sales-body">
                                <main className="table" id="customers_table">
                                    <section className="table-body">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Sn</th>
                                                    <th>Order name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Status</th>
                                                    <th>Total price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales.orders.map((order, orderIndex) => (
                                                    <tr key={orderIndex}>
                                                        <td>{orderIndex + 1}</td>
                                                        <td>{order.order_title}</td>
                                                        <td>{order.order_price}</td>
                                                        <td>{order.order_quantity}</td>
                                                        <td>{order.order_status}</td>
                                                        <td>{order.total_price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                </main>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
