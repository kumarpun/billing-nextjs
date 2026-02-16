import { NextResponse } from "next/server";
import CustomerOrder from "../../../../models/customerOrder";
import { dbConnect } from "../../dbConnect";

export async function GET(request, {params}) {
    const { id } = params;
    await dbConnect(); // Reused MongoDB connection
    const customerorders = await CustomerOrder.findOne({ _id: id });
    return NextResponse.json({ customerorders }, { status: 200 });
}
