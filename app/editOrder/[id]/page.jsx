import EditOrderStatus from "../../components/EditOrderStatus";
import Link from "next/link";

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const getOrderById = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch topic");
      }
  
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

export default async function EditOrder({ params }) {
    const { id } = params;
    const { orderbyTableId } = await getOrderById(id);
    const { table_id, order_title, order_description, order_quantity } = orderbyTableId;

  return (
    <>
    <EditOrderStatus id={id} order_title={order_title} order_description={order_description} order_quantity={order_quantity} />
    </>
  );
}