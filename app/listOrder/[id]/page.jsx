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
            fetch(`http://localhost:3000/api/orders/${id}`, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `authToken=${authToken}`, // Manually set the Cookie header
                },              
                 }),
            fetch(`http://localhost:3000/api/bill/${id}`, {
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
             billFinalStatus: billData.billFinalStatus};
    } catch (error) {
        console.error("Error loading orders: ", error);
    }
}

export default async function ListOrder({ params }) {
    const { id } = params;

    try {
    const { orderbyTableId, total_price, tablebill_id, billById, totalFinalbill, billFinalStatus } = await getOrdersByTableId(id);
 
    const { order_title, order_description } = orderbyTableId;
    return (
        <>
        <div>
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
        <div style={{ flex: 0 }}></div>
        <Link className="page-title font-bold" href={"/"}>
        {Array.from("HYBE Food & Drinks").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}
      </Link>
        <Link className="bg-white px-6 py-2 mt-3 add-table" href={`/addOrder/${id}`}>
        Place Order
      </Link>
        </nav>
  
        <div>
        <hr className="separator" />
        <EditCustomerForm id={id} />
        <OrderListClient orderbyTableId={orderbyTableId} total_price={total_price} tablebill_id={tablebill_id} tableId={id} billById={billById} totalFinalbill={totalFinalbill} billFinalStatus={billFinalStatus} />

      </div>
      </div>
        </>
    )
    } catch (error) {
        return <div>Error loading orders. Please try again later.</div>;
    }
    }