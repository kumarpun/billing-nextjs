import EditTableForm from "../../components/EditTableForm";
import Link from "next/link";
import RemoveOrderBtn from "../../components/RemoveOrderBtn";
import EditOrderStatus from  "../../components/EditOrderStatus";
import { HiPencilAlt } from "react-icons/hi";
import EditCustomerForm from "../../components/EditCustomerForm";
import AddBillForm from  "../../components/AddBillForm";
import OrderListClient from "../../components/OrderListClient";
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const getDataByTableId = async (id) => {
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("authToken")?.value;

        const [ordersRes, billRes, tableRes] = await Promise.all([
            fetch(`${BASE_URL}/api/orders/${id}`, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `authToken=${authToken}`,
                },
            }),
            fetch(`${BASE_URL}/api/bill/${id}`, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `authToken=${authToken}`,
                },
            }),
            fetch(`${BASE_URL}/api/tables/${id}`, {
                cache: 'no-store',
            })
        ]);

        if (!ordersRes.ok || !billRes.ok || !tableRes.ok) {
            throw new Error("Failed to fetch data");
        }

        const [ordersData, billData, tableData] = await Promise.all([
            ordersRes.json(),
            billRes.json(),
            tableRes.json(),
        ]);

        return {
            ...ordersData,
            billById: billData.billById,
            totalFinalbill: billData.totalFinalbill,
            billFinalStatus: billData.billFinalStatus,
            table: tableData.table,
        };
    } catch (error) {
        console.error("Error loading data: ", error);
        return null;
    }
}

export default async function ListOrder({ params }) {
    const { id } = params;

    try {
    const data = await getDataByTableId(id);
    if (!data) throw new Error("Failed to load data");

    const { orderbyTableId, total_price, totalKitchenPrice, totalBarPrice, tablebill_id, billById, totalFinalbill, billFinalStatus, order_type, table } = data;
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
        {/* <div className="table-info">
              <h1 className="font-bold text-3xl table-title">{table.title}</h1>
        </div> */}

        {/* <EditCustomerForm id={id} /> */}
        {totalFinalbill <= 0 && <EditCustomerForm id={id} />}
        <br></br>
        <OrderListClient 
        orderbyTableId={orderbyTableId} 
        total_price={total_price} 
        totalKitchenPrice={totalKitchenPrice}
        totalBarPrice={totalBarPrice}
        tablebill_id={tablebill_id} tableId={id} tableTitle={table.title} billById={billById} 
        totalFinalbill={totalFinalbill}
         billFinalStatus={billFinalStatus} order_type={order_type} />

      </div>
      </div>
        </>
    )
    } catch (error) {
        return <div>Error loading orders. Please try again later.</div>;
    }
    }
