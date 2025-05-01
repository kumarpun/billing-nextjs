import EditTableForm from "../../components/EditTableForm";
import Link from "next/link";
import RemoveOrderBtn from "../../components/RemoveOrderBtn";
import EditOrderStatus from  "../../components/EditOrderStatus";
import { HiPencilAlt } from "react-icons/hi";
import EditCustomerForm from "../../components/EditCustomerForm";
import AddBillForm from  "../../components/AddBillForm";
import OrderListClient from "../../components/OrderListClient";
import { cookies } from 'next/headers';

const getOrdersByTableId = async(id) => {
    try {
        // const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        //     cache: 'no-store',
        // });
        // const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjA1MDI5MmQ4MWZmYjQ0YjU4OTI2ZmEiLCJuYW1lIjoia3VtYXIgcHVuIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTcyNjk4Njg2OH0.BApSb0f4wdBm6RQLMasmIfWQk14BSuUq2AZIavl47ik';
        const cookieStore = cookies(); // Access the cookie store

        const authToken = cookieStore.get("authToken")?.value; 
        console.log('Auth token:', authToken);

        const [ordersRes, billRes] = await Promise.all([
            fetch(`https://billing-nextjs.vercel.app/api/orders/${id}`, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `authToken=${authToken}`, // Manually set the Cookie header
                },              
                 }),
            fetch(`https://billing-nextjs.vercel.app/api/bill/${id}`, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `authToken=${authToken}`, // Manually set the Cookie header
                },
            })
        ]);

        const ordersData = await ordersRes.json();
        const billData = await billRes.json();

        if(!ordersRes.ok || !billRes.ok) {
            throw new Error("Failed to fetch orders");
        }
        return { ...ordersData, billById: billData.billById,
             totalFinalbill:billData.totalFinalbill, 
             billFinalStatus: billData.billFinalStatus,
            };
             
    } catch (error) {
        console.error("Error loading orders: ", error);
    }
}

const getTableById = async (id) => {
    try {
        const res = await fetch(`https://billing-nextjs.vercel.app/api/tables/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error("Failed to fetch table");
        }

        const data = await res.json();
        return data.table; // Assuming the response structure has a 'table' field
    } catch (error) {
        console.error("Error fetching table: ", error);
        return null;
    }
}

export default async function ListOrder({ params }) {
    const { id } = params;

    try {
    const table = await getTableById(id);

    const { orderbyTableId, total_price, totalKitchenPrice, totalBarPrice, tablebill_id, billById, totalFinalbill, billFinalStatus, order_type } = await getOrdersByTableId(id);
 
    const { order_title, order_description } = orderbyTableId;
    return (
        <>
        <div className="min-h-screen bg-[#283141] flex flex-col">
        <nav className="flex justify-between items-center px-8 py-3 navbar" style={{ backgroundColor: "#232b38" }}>
            <div style={{ flex: 0.4 }}></div>
      <Link className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title" href={"/tables"}>
      HYBE Food & Drinks
      </Link>
        <Link className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button" href={`/addOrder/${id}`}>
        Place Order
      </Link>
        </nav>
  
        <div>
        {/* <hr className="separator" /> */}
        <div className="table-info">
              <h1 className="font-bold text-3xl table-title">{table.title}</h1>
        </div>

        {/* <EditCustomerForm id={id} /> */}
        {totalFinalbill <= 0 && <EditCustomerForm id={id} />}
        <br></br>
        <OrderListClient 
        orderbyTableId={orderbyTableId} 
        total_price={total_price} 
        totalKitchenPrice={totalKitchenPrice}
        totalBarPrice={totalBarPrice}
        tablebill_id={tablebill_id} tableId={id} tableTitle={table.title} billById={billById} totalFinalbill={totalFinalbill} billFinalStatus={billFinalStatus} order_type={order_type} />

      </div>
      </div>
        </>
    )
    } catch (error) {
        return <div>Error loading orders. Please try again later.</div>;
    }
    }
