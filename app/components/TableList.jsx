import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import ActionBtn from  "./ActionBtn";

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
            return { ...table, orders };
        }));

        return tablesWithOrders;
    } catch (error) {
        console.error("Error loading tables: ", error);
        return []; // Ensure we return an empty array in case of an error
    }
};


export default async function TableList() {
    const tables = await getTables();

    // Log the tables to debug
    console.log("Fetched tables:", tables);

    if (!Array.isArray(tables)) {
        return <div>Error: Expected tables to be an array.</div>; // Handle unexpected format
    }

    if (tables.length === 0) {
        return <div>No tables available.</div>; // Message when no tables are found
    }
    
    return (
        <>
            <hr className="separator" />
            <div className="bg-page">

                {tables.map(t => (
                    <div key={t._id} className="dashboard">
                        <div className="card color1">
                            <div>
                                <div className="font-bold text-2xl">{t.title}</div>
                                <div>{t.description}</div>
                                
                                {/* Check the orders array to display the appropriate message */}
                                {t.orders.orderbyTableId.length > 0 ? (
                                    <div className="text-green-600">Table running</div>
                                ) : (
                                    <div className="text-red-600">Empty table</div>
                                )}
                            </div>
                            <div>
                                <Link className="icon" href={`/listOrder/${t._id}`}>
                                    <ActionBtn />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


