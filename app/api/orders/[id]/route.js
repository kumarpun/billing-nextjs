import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import CustomerOrder from "../../../../models/customerOrder";

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();

    try {
        // Fetch the customer order using table_id
        const orderbyTableId = await CustomerOrder.find({ table_id: id })
        // .populate('table_id');

        if (!orderbyTableId) {
            // return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            return NextResponse.json({ message: 'No order placed for this table' }, { status: 200 });
        }

        return NextResponse.json({ orderbyTableId }, { status: 200 });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
    }
}

export async function PUT(request, {params}) {
    const { id } = params;
    const { newOrderTitle: order_title, newOrderDescription: order_description } = await request.json();
    await connectMongoDB();
    await CustomerOrder.findByIdAndUpdate(id, { order_title, order_description });
    return NextResponse.json({ message: "Order status updated" }, { status: 200 });
}