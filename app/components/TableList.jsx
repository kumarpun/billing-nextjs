import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import ActionBtn from  "./ActionBtn";
import dynamic from "next/dynamic";
import ToastMessage from "./ToastMessage";
import InventoryWarning from "./InventoryWarning";

const ChecklistWrapper = dynamic(() => import("./ChecklistWrapper"), {
    ssr: false,
    loading: () => null // Don't show loading state
  });

const getTables = async () => {
    try {
        const res = await fetch('https://billing-nextjs.vercel.app/api/tables', {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error("Failed to fetch tables");
        }

        const data = await res.json(); // Get the response object

        // Extract the tables array from the response object
        const tables = data.tables;

        // Ensure tables is an array
        if (!Array.isArray(tables)) {
            console.error("Expected tables to be an array, but got:", tables);
            return []; // Return an empty array if not an array
        }

        // Fetch order data for each table
        const tablesWithOrders = await Promise.all(tables.map(async (table) => {
            const orderRes = await fetch(`https://billing-nextjs.vercel.app/api/orders/${table._id}`, {
                cache: 'no-store',
            });

            const orders = await orderRes.json();
            const totalPrice = orders.orderbyTableId?.reduce((sum, order) => {
                return sum + (order.final_price || 0);
            }, 0) || 0;

            return { ...table, 
                        orders,
                        totalPrice
             };
        }));

        return tablesWithOrders;
    } catch (error) {
        console.error("Error loading tables: ", error);
        return []; // Ensure we return an empty array in case of an error
    }
};


// export default async function TableList() {
//     const tables = await getTables();

//     // Log the tables to debug
//     console.log("Fetched tables:", tables);

//     if (!Array.isArray(tables)) {
//         return <div>Error: Expected tables to be an array.</div>; // Handle unexpected format
//     }

//     if (tables.length === 0) {
//         return <div>No tables available.</div>; // Message when no tables are found
//     }
    
//     return (
//         <>
//             <hr className="separator" />
//             <div className="bg-page">

//                 {tables.map(t => (
//                     <div key={t._id} className="dashboard">
//                         <div className="card color1">
//                             <div>
//                                 <div className="font-bold text-2xl">{t.title}</div>
//                                 <div>{t.description}</div>
                                
//                                 {/* Check the orders array to display the appropriate message */}
//                                 {t.orders.orderbyTableId.length > 0 ? (
//                                     <div className="text-green-600">Table running</div>
//                                 ) : (
//                                     <div className="text-red-600">Empty table</div>
//                                 )}
//                             </div>
//                             <div>
//                                 <Link className="icon" href={`/listOrder/${t._id}`}>
//                                     <ActionBtn />
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }

export default async function TableList() {
    const tables = await getTables();

    if (!Array.isArray(tables)) {
        return <div>Error: Expected tables to be an array.</div>;
    }

    if (tables.length === 0) {
        return <div>No tables available.</div>;
    }

    // Split the tables into three sections for top, center, and bottom
    const topTables = tables.slice(0, 4);  // Tables 0, 1, 2, 3
    const centerTable = tables.slice(4, 6);  // Table 4
    const bottomTables = tables.slice(6, 10);  // Tables 5, 6, 7, 8
    // const bottomTables = tables.slice(5, 9).reverse();  // Reverse the order of tables 5, 6, 7, 8
    const terrraceTables = tables.slice(10)

    return (
        <>
            {/* <InventoryWarning /> */}
            {/* <hr className="separator" /> */}
            <div className="bg-page">
            <ToastMessage />

            <ChecklistWrapper />

            <div className="flex items-start gap-4">
                
                {/* Bar section */}
                {/* <div className="card color1 bar-card">
                    <div>
                        <div className="font-bold text-2xl">bar</div>
                        <div>bar</div>
                    </div>
                </div> */}

                {/* Top tables section */}
                <div className="flex gap-4 tables-row">
                {/* Top section */}
                    {topTables.map(t => (
                        <div key={t._id} className="dashboard">
                            <div className="card color1">
                                <div>
                                    <div className="font-bold text-2xl card-text">{t.title}</div>
                                    <div className="card-text">{t.description}</div>
                                    {t.orders.orderbyTableId.length > 0 ? (
                                        <div className="text-green-600 card-text">Table running</div>
                                    ) : (
                                        <div className="text-red-600 card-text">Empty table</div>
                                    )}
                                    {/* Display total bill if orders exist */}
                                {t.orders.orderbyTableId.length > 0 && (
                                    <div className="font-bold mt-2 card-bill card-text">
                                        रू {t.totalPrice}
                                    </div>
                                )}
                                </div>
                                <div className="flex flex-col gap-2 -ml-2">
                                    <Link className="icon" href={`/listOrder/${t._id}`}>
                                        <ActionBtn />
                                    </Link>
                                    <Link className="icon" href={`/editTable/${t._id}`}>
                                        <HiPencilAlt className="icon-color" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Center section */}
                <div className="flex justify-center table-reverse">
                    {centerTable.map(t => (
                        <div key={t._id} className="dashboard">
                            <div className="card color1">
                                <div>
                                    <div className="font-bold text-2xl card-text">{t.title}</div>
                                    <div className="card-text">{t.description}</div>
                                    {t.orders.orderbyTableId.length > 0 ? (
                                        <div className="text-green-600 card-text">Table running</div>
                                    ) : (
                                        <div className="text-red-600 card-text">Empty table</div>
                                    )}
                                       {t.orders.orderbyTableId.length > 0 && (
                                    <div className="font-bold mt-2 card-bill card-text">
                                        रू {t.totalPrice}
                                    </div>
                                )}
                                </div>
                                <div>
                                    <Link className="icon" href={`/listOrder/${t._id}`}>
                                        <ActionBtn />
                                    </Link>
                                    <Link className="icon" href={`/editTable/${t._id}`}>
                                    <HiPencilAlt className="icon-color" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                {/* <div className="flex gap-4 tables-row table-reverse"> */}
                <div className="flex gap-4 justify-center table-reverse">
                    {bottomTables.map(t => (
                        <div key={t._id} className="dashboard">
                            <div className="card color1">
                                <div>
                                    <div className="font-bold text-2xl card-text">{t.title}</div>
                                    <div className="card-text">{t.description}</div>
                                    {t.orders.orderbyTableId.length > 0 ? (
                                        <div className="text-green-600 card-text">Table running</div>
                                    ) : (
                                        <div className="text-red-600 card-text">Empty table</div>
                                    )}
                                       {t.orders.orderbyTableId.length > 0 && (
                                    <div className="font-bold mt-2 card-bill card-text">
                                        रू {t.totalPrice}
                                    </div>
                                )}
                                </div>
                                <div>
                                    <Link className="icon" href={`/listOrder/${t._id}`}>
                                        <ActionBtn />
                                    </Link>
                                    <Link className="icon" href={`/editTable/${t._id}`}>
                                    <HiPencilAlt className="icon-color" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


        {/* Terrace section */}
            <div className="flex gap-4 tables-row">
                    {terrraceTables.map(t => (
                        <div key={t._id} className="dashboard">
                            <div className="card card-terrace color1">
                                <div>
                                    <div className="font-bold text-2xl card-text">{t.title}</div>
                                    <div className="card-text">{t.description}</div>
                                    {t.orders.orderbyTableId.length > 0 ? (
                                        <div className="text-green-600 card-text">Table running</div>
                                    ) : (
                                        <div className="text-red-600 card-text">Empty table</div>
                                    )}
                                       {t.orders.orderbyTableId.length > 0 && (
                                    <div className="font-bold mt-2 card-bill card-text">
                                        रू {t.totalPrice}
                                    </div>
                                )}
                                </div>
                                <div>
                                    <Link className="icon" href={`/listOrder/${t._id}`}>
                                        <ActionBtn />
                                    </Link>
                                    <Link className="icon" href={`/editTable/${t._id}`}>
                                    <HiPencilAlt className="icon-color" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}
