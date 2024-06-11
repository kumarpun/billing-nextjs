import EditTableForm from "../../components/EditTableForm";
import Link from "next/link";
import RemoveOrderBtn from "../../components/RemoveOrderBtn";
import EditOrderStatus from  "../../components/EditOrderStatus";
import { HiPencilAlt } from "react-icons/hi";
import EditCustomerForm from "../../components/EditCustomerForm";
import AddBillForm from  "../../components/AddBillForm";

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
    const { orderbyTableId, total_price } = await getOrdersByTableId(id);
    // const { order_title, order_description } = orderbyTableId;
    // if (!orderbyTableId || Object.keys(orderbyTableId).length === 0) {
    //     return <div>No orders found for this table.</div>;
    // }
    const { order_title, order_description } = orderbyTableId;
    return (
        <>
        <div>
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
        <div style={{ flex: 0 }}></div>
        <Link className="page-title font-bold" href={"/"}>
        {Array.from("VIVID CAFE & BOOZE").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}
      </Link>
        <Link className="bg-white px-6 py-2 mt-3 add-table" href={`/addOrder/${id}`}>
        Place Order
      </Link>
        </nav>
        {/* <form>
        <input
         className="border border-slate-500 px-8 py-2" type="text" placeholder="Customer status" />
        <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
                        Update Customer
                    </button>
        </form> */}
        <div>
        <hr className="separator" />
        {/* <div className="report-bg"></div> */}
        <EditCustomerForm id={id} />

    {
        !orderbyTableId || Object.keys(orderbyTableId).length === 0 ? 'No orders found for this table.' : ''
    }
        {orderbyTableId.map(order => (


        <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
        <div>
        <h3 className="font-bold text-2xl">{order.order_title}</h3>
        <div>{order.order_description}</div>
        <div>{order.order_status}</div>
        <div>{order.customer_status}</div>
        <div>Order price: NRs. {order.order_price}</div>
        <div>Order quantity: {order.order_quantity}</div>
        <div>Sum: NRs. {order.final_price}</div>
        </div>
        <div>
        <RemoveOrderBtn id={order._id} />
        <Link href={`/editOrder/${order._id}`}>
        <HiPencilAlt className="edit-icon" size={24} />
        </Link>
        </div>
    </div> 
    
      ))}
      <p className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start font-bold">Total bill: NRs. {total_price}</p>

      <AddBillForm initialOriginalPrice={total_price} />
      </div>
      </div>
        </>
        // <EditTableForm id={id} title={order_title} description={order_description} />
    )
    } catch (error) {
        return <div>Error loading orders. Please try again later.</div>;
    }
    }