import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import CustomerOrder from "../../../../models/customerOrder";

export async function GET(request, {params}) {
    const { id } = params;
    await connectMongoDB();
    const customerorders = await CustomerOrder.findOne({ _id: id });
    return NextResponse.json({ customerorders }, { status: 200 });
}
