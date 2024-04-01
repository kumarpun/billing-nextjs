import EditTableForm from "../../components/EditTableForm";
import Link from "next/link";
import RemoveOrderBtn from "../../components/RemoveOrderBtn";
import EditOrderStatus from  "../../components/EditOrderStatus";
import { HiPencilAlt } from "react-icons/hi";

const getOrdersByTableId = async(id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
            cache: 'no-store',
        });
        if(!res.ok) {
            throw new Error("Failed to fetch orders");
        }
        return res.json();
    } catch (error) {
        console.error("Error loading orders: ", error);
    }
}

export default async function ListOrder({ params }) {
    const { id } = params;
    
    try {
    const { orderbyTableId } = await getOrdersByTableId(id);
    // const { order_title, order_description } = orderbyTableId;
    // if (!orderbyTableId || Object.keys(orderbyTableId).length === 0) {
    //     return <div>No orders found for this table.</div>;
    // }
    const { order_title, order_description } = orderbyTableId;
    return (
        <>
        <div>
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
        <Link className="text-white font-bold" href={"/"}>
      MiZone
      </Link>
        <Link className="bg-white p-2" href={`/addOrder/${id}`}>
        Place Order
      </Link>
        </nav>
   
    {
        !orderbyTableId || Object.keys(orderbyTableId).length === 0 ? 'No orders found for this table.' : ''
    }
        {orderbyTableId.map(order => (


        <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
        <div>
        <h2 className="font-bold text-2xl">{order.order_title}</h2>
        <div>{order.order_description}</div>
        </div>
        <div>
        <RemoveOrderBtn id={order._id} />
        <Link href={`/editOrder/${order._id}`}>
        <HiPencilAlt size={24} />
        </Link>
        </div>
        
    </div> 
    
      ))}

        </div>
        </>
        // <EditTableForm id={id} title={order_title} description={order_description} />
    )
    } catch (error) {
        return <div>Error loading orders. Please try again later.</div>;
    }
    }