// "use client"; // This marks the component as client-side
// import { useState, useEffect } from "react";

// export default function SalesReportFilter() {
//     const [selectedFilter, setSelectedFilter] = useState("today");
//     const [bills, setBills] = useState([]);
//     const [totalFinalPrice, setTotalFinalPrice] = useState(0);
//     const [totalKitchenPrice, setTotalKitchenPrice] = useState(0);
//     const [totalBarPrice, setTotalBarPrice] = useState(0);

//     const handleFilterChange = (event) => {
//         setSelectedFilter(event.target.value);
//     };

//     // Fetch the data whenever the filter changes
//     useEffect(() => {
//         const fetchReport = async () => {
//             try {
//                 const res = await fetch(`/api/bill?${selectedFilter}=true`, { cache: "no-store" });
//                 if (!res.ok) throw new Error("Failed to fetch report");
//                 const data = await res.json();
//                 setBills(data.bills || []);
//                 setTotalFinalPrice(data.totalFinalPrice || 0);
//             } catch (error) {
//                 console.error("Error loading report:", error);
//                 setBills([]);
//                 setTotalFinalPrice(0);
//             }
//         };

//         fetchReport();
//     }, [selectedFilter]); // Trigger fetching when selectedFilter changes

//     return (
//         <>
//              <div className="filter-options">
//                 <label htmlFor="filter">Select Filter: </label>
//                 <select id="filter" value={selectedFilter} onChange={handleFilterChange}>
//                     <option value="today">Today</option>
//                     <option value="lastWeek">Last Week</option>
//                     <option value="lastMonth">Last Month</option>
//                 </select>
//             </div>

//             <div className="font-bold text-center">Total Sales: NRs. {totalFinalPrice}</div>
//             <div className="font-bold text-center">Total Kitchen Sales: NRs. {totalKitchenPrice}</div>
//                 <div className="font-bold text-center">Total Bar Sales: NRs. {totalBarPrice}</div>
//             <div className="sales-body">
//                 <main className="table" id="customers_table">
//                     <section className="table-body">
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Sn</th>
//                                     <th>Date</th>
//                                     <th>Original Bill</th>
//                                     <th>Discount %</th>
//                                     <th>Final Bill</th>
//                                     <th>Payment Mode</th>
//                                     <th>QR Amount</th>
//                                     <th>Cash Amount</th>
//                                     <th>Remarks</th>
//                                     <th>Kitchen</th>
//                                     <th>Bar</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {bills.length > 0 ? (
//                                     bills.map((sales, index) => (
//                                         <tr key={index}>
//                                             <td>{index + 1}</td>
//                                             {/* <td>{sales.createdAt}</td> */}
//                                             <td>{new Date(sales.createdAt).toLocaleDateString()}</td>
//                                             <td>{sales.originalPrice}</td>
//                                             <td>{sales.discountPercent}</td>
//                                             <td>{sales.finalPrice}</td>
//                                             <td>{sales.billPaymentMode}</td>
//                                             <td>{sales.qrAmount}</td>
//                                             <td>{sales.cashAmount}</td>
//                                             <td>{sales.remarks}</td>
//                                             <td>{sales.kitchenPrice}</td>
//                                             <td>{sales.barPrice}</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="5" className="text-center">No sales records available</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </section>
//                 </main>
//             </div>
//         </>
//     );
// }

"use client";
import { useState, useEffect } from "react";

export default function SalesReportFilter() {
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [bills, setBills] = useState([]);
    const [totalFinalPrice, setTotalFinalPrice] = useState(0);
    const [totalKitchenPrice, setTotalKitchenPrice] = useState(0);
    const [totalBarPrice, setTotalBarPrice] = useState(0);

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/bill?${selectedFilter}=true`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch report");
                const data = await res.json();
                setBills(data.bills || []);
                setTotalFinalPrice(data.totalFinalPrice || 0);
                setTotalKitchenPrice(data.totalKitchenPrice || 0); // Update here
                setTotalBarPrice(data.totalBarPrice || 0);         // Update here
            } catch (error) {
                console.error("Error loading report:", error);
                setBills([]);
                setTotalFinalPrice(0);
                setTotalKitchenPrice(0);
                setTotalBarPrice(0);
            }
        };

        fetchReport();
    }, [selectedFilter]);

    return (
        <>
             <div className="filter-options">
                <label htmlFor="filter">Select Filter: </label>
                <select id="filter" value={selectedFilter} onChange={handleFilterChange}>
                    <option value="today">Today</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="lastMonth">Last Month</option>
                </select>
            </div>

            <div className="font-bold text-center">Total Sales: NRs. {totalFinalPrice}</div>
            <div className="font-bold text-center">Total Kitchen Sales: NRs. {totalKitchenPrice}</div>
            <div className="font-bold text-center">Total Bar Sales: NRs. {totalBarPrice}</div>
            <div className="sales-body">
                <main className="table" id="customers_table">
                    <section className="table-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sn</th>
                                    <th>Date</th>
                                    <th>Original Bill</th>
                                    <th>Discount %</th>
                                    <th>Final Bill</th>
                                    <th>Payment Mode</th>
                                    <th>QR Amount</th>
                                    <th>Cash Amount</th>
                                    <th>Remarks</th>
                                    <th>Kitchen</th>
                                    <th>Bar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.length > 0 ? (
                                    bills.map((sales, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{new Date(sales.createdAt).toLocaleDateString()}</td>
                                            <td>{sales.originalPrice}</td>
                                            <td>{sales.discountPercent}</td>
                                            <td>{sales.finalPrice}</td>
                                            <td>{sales.billPaymentMode}</td>
                                            <td>{sales.qrAmount}</td>
                                            <td>{sales.cashAmount}</td>
                                            <td>{sales.remarks}</td>
                                            <td>{sales.kitchenPrice}</td>
                                            <td>{sales.barPrice}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No sales records available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>
    );
}

