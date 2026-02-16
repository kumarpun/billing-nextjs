import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect();
    try {
        const deleted = await CustomerOrder.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order deleted." });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting order" }, { status: 500 });
    }
}