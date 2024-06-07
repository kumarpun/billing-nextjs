import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import CustomerOrder from "../../../../models/customerOrder";

export async function PUT(request, {params}) {
    const { id } = params;
    const { newCustomerStatus: customer_status } = await request.json();
    await connectMongoDB();
    await CustomerOrder.updateMany(
        {table_id: id},
        {$set: {customer_status} }
    );
    return NextResponse.json({ message: "Customer status updated" }, { status: 200 });
}