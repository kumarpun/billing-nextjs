import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import CustomerOrder from "../../../../models/customerOrder";

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();

    try {
        // Fetch the customer order using table_id
        const orderbyTableId = await CustomerOrder.find({ 
            table_id: id,
            customer_status: ["Customer accepted", "Bill paid"]
        })
        // .populate('table_id');

        if (!orderbyTableId) {
            // return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            return NextResponse.json({ message: 'No order placed for this table' }, { status: 200 });       
        }

        const ordersWithFinalPrice = orderbyTableId.map(order => ({
            ...order._doc,
            final_price: order.order_price * order.order_quantity
        }));

        // const totalPrice = orderbyTableId.reduce((total, order) => total + order.order_price, 0);
        const totalPrice = ordersWithFinalPrice.reduce((total, order) => total + order.final_price, 0);
        
        const response = {
            orderbyTableId: ordersWithFinalPrice,
            total_price: totalPrice,
            tablebill_id: id, // Adding the new field with table_id
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
    }
}

// export async function PUT(request, {params}) {
//     const { id } = params;
//     const { newOrderTitle: order_title, newOrderDescription: order_description, newOrderStatus: order_status } = await request.json();
//     await connectMongoDB();
//     await CustomerOrder.findByIdAndUpdate(id, { order_title, order_description, order_status });
//     return NextResponse.json({ message: "Order status updated" }, { status: 200 });
// }

export async function PUT(request, { params }) {
    const { id } = params;
    const {
        newOrderTitle,
        newOrderDescription,
        newOrderStatus,
        newCustomerStatus
    } = await request.json();
    await connectMongoDB();

    try {
        if (newOrderTitle || newOrderDescription || newOrderStatus) {
            // Update specific order by ID
            const updateData = {};
            if (newOrderTitle) updateData.order_title = newOrderTitle;
            if (newOrderDescription) updateData.order_description = newOrderDescription;
            if (newOrderStatus) updateData.order_status = newOrderStatus;

            const updatedOrder = await CustomerOrder.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedOrder) {
                return NextResponse.json({ message: 'Order not found' }, { status: 404 });
            }

            return NextResponse.json({ message: "Order updated successfully", updatedOrder }, { status: 200 });
        }

        if (newCustomerStatus) {
            // const orders = await CustomerOrder.find({ table_id: id });
            const invalidStatusOrder = await CustomerOrder.find({ table_id: id, customer_status: "Customer left" });
            console.log("Checking for invalid status 'Customer left':", invalidStatusOrder);
            console.log("Table ID of orders checked for 'Customer left' status:", invalidStatusOrder.table_id);
            if (invalidStatusOrder && invalidStatusOrder.table_id) {
                console.log("Checking for invalid status 'Customer left':", invalidStatusOrder);
                console.log("Table ID of orders checked for 'Customer left' status:", invalidStatusOrder.table_id);
                return NextResponse.json({ message: 'Order(s) cannot be updated as they are in the final state' }, { status: 400 });
            }
            // Update customer status for all orders with the given table_id
            const updateResult = await CustomerOrder.updateMany(
                { table_id: id, customer_status: { $in: ["Customer accepted", "Bill paid"] } },
                { $set: { customer_status: newCustomerStatus } }
            );

            if (updateResult.matchedCount === 0) {
                return NextResponse.json({ message: 'No orders found for this table' }, { status: 404 });
            }

            return NextResponse.json({ message: "Customer status updated successfully", updateResult }, { status: 200 });
        }

        return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
    }
}