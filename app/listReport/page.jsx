import Link from "next/link";

const getFinalSalesReport = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/bill', {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error("Failed to fetch report");
        }
        return res.json();
    } catch (error) {
        console.error("Error loading report:", error);
        return { bill: [], totalFinalPrice: 0 }; // Return an empty array and zero total in case of error
    }
}

export default async function ListReport() {
    const { bill, totalFinalPrice } = await getFinalSalesReport() || { bill: [], totalFinalPrice: 0 }; // Handle undefined case
    return (
        <>
            <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
                <div style={{ flex: 0.25 }}></div>
                <Link className="page-title font-bold" href="/">
                    {Array.from("VIVID CAFE & BOOZE").map((char, index) => (
                        <span key={index} className={`char-${index}`}>{char}</span>
                    ))}
                </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                <Link className="px-6 py-2 mt-3 add-table" href={"/listSales"}>
        Order Report
        </Link>
                    <Link className="px-6 py-2 mt-3 add-table" href="/">
                        Back
                    </Link>
                </div>
            </nav>
            <hr className="separator" />
            <div className="report-bg"></div>
            <div>
                <br/>
                <div>
                        <div>
                        <div className="font-bold text-center">Total Sales this month: NRs. {totalFinalPrice}</div>
                            <div className="sales-body">
                                <main className="table" id="customers_table">
                                    <section className="table-body">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Sn</th>
                                                    <th>Original Bill</th>
                                                    <th>Discount %</th>
                                                    <th>Final Bill</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bill.map((sales, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{sales.originalPrice}</td>
                                                        <td>{sales.discountPercent}</td>
                                                        <td>{sales.finalPrice}</td>
                                                        <td>{sales.remarks}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                </main>
                            </div>
                        </div>


                </div>
            </div>
        </>
    )
}