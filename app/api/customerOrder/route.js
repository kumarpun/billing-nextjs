import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import CustomerOrder from "../../../models/customerOrder";

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await CustomerOrder.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted." });
}