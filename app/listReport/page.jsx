// import Link from "next/link";

// // const getFinalSalesReport = async () => {
// //     try {
// //         const res = await fetch('http://localhost:3000/api/bill?today=true', {
// //             cache: 'no-store',
// //         });
// //         if (!res.ok) {
// //             throw new Error("Failed to fetch report");
// //         }
// //         return res.json();
// //     } catch (error) {
// //         console.error("Error loading report:", error);
// //         return { bill: [], totalFinalPrice: 0 }; // Return an empty array and zero total in case of error
// //     }
// // }

// const getFinalSalesReport = async (filter) => {
//     try {
//         const res = await fetch(`http://localhost:3000/api/bill?${filter}=true`, {
//             cache: 'no-store',
//         });
//         if (!res.ok) {
//             throw new Error("Failed to fetch report");
//         }
//         return res.json();
//     } catch (error) {
//         console.error("Error loading report:", error);
//         return { bills: [], totalFinalPrice: 0 }; // Return an empty array and zero total in case of error
//     }
// }

// export default async function ListReport() {
//     // const { bill, totalFinalPrice } = await getFinalSalesReport() || { bill: [], totalFinalPrice: 0 }; // Handle undefined case
//     const { bills, totalFinalPrice } = await getFinalSalesReport() || { bill: [], totalFinalPrice: 0 }; // Handle undefined case
//     return (
//         <>
//             <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
//                 <div style={{ flex: 0.25 }}></div>
//                 <Link className="page-title font-bold" href="/">
//                     {Array.from("HYBE Food & Drinks").map((char, index) => (
//                         <span key={index} className={`char-${index}`}>{char}</span>
//                     ))}
//                 </Link>

//                 <div style={{ display: 'flex', gap: '12px' }}>
//                 <Link className="px-6 py-2 mt-3 add-table" href={"/listSales"}>
//         Order Report
//         </Link>
//                     <Link className="px-6 py-2 mt-3 add-table" href="/">
//                         Back
//                     </Link>
//                 </div>
//             </nav>
//             <hr className="separator" />
//             <div className="report-bg"></div>
//             <div>
//                 <br/>
//                 <div>
//                         <div>
//                         <div className="font-bold text-center">Total Sales this month: NRs. {totalFinalPrice}</div>
//                             <div className="sales-body">
//                                 <main className="table" id="customers_table">
//                                     <section className="table-body">
//                                         <table>
//                                             <thead>
//                                                 <tr>
//                                                     <th>Sn</th>
//                                                     <th>Original Bill</th>
//                                                     <th>Discount %</th>
//                                                     <th>Final Bill</th>
//                                                     <th>Remarks</th>
//                                                 </tr>
//                                             </thead>
//                                             {/* <tbody>
//                                                 {bill.map((sales, index) => (
//                                                     <tr key={index}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{sales.originalPrice}</td>
//                                                         <td>{sales.discountPercent}</td>
//                                                         <td>{sales.finalPrice}</td>
//                                                         <td>{sales.remarks}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody> */}
//                                                <tbody>
//                                             {bills.length > 0 ? (
//                                                 bills.map((sales, index) => (
//                                                     <tr key={index}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{sales.originalPrice}</td>
//                                                         <td>{sales.discountPercent}</td>
//                                                         <td>{sales.finalPrice}</td>
//                                                         <td>{sales.remarks}</td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan="5" className="text-center">No sales records available</td>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                         </table>
//                                     </section>
//                                 </main>
//                             </div>
//                         </div>


//                 </div>
//             </div>
//         </>
//     )
// }

import SalesReportFilter from "../components/SalesReportFilter";
import Link from "next/link";

export default function ListReport() {
    return (
        <>
            <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/dashReport"}>
      HYBE Food & Drinks
      </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                 {/* <a
                     className="px-6 py-2 mt-3 add-table"
                href="https://docs.google.com/spreadsheets/d/1LnrugVBIRQ9ZPBkJqHcLTVdJuBnq1O-ovg9xcZJ9M3I/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                >
                Inventory
                </a> */}
                  <a
                        className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button"
                        href="https://docs.google.com/spreadsheets/d/1bsYPfCKZkcrKZrWfRqS4RiKmwOXwLMQ3USFfJ9wiKwg/edit?gid=1009457690#gid=1009457690"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Credit
                    </a>
                 <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/salesCalculation"}>
                        Sales Calc
                    </Link>

                    <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={"/listSales"}>
                        Order Report
                    </Link>
                    <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href="/">
                        Back
                    </Link>
                </div>
            </nav>
            {/* <hr className="separator" /> */}

            {/* Now just render the SalesReportFilter client component */}
            <SalesReportFilter />
        </>
    );
}


