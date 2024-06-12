import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Bill from "../../../models/bill";

export async function POST(request) {
    const { originalPrice, finalPrice } = await request.json();
    await connectMongoDB();
    await Bill.create({ originalPrice, discountPercent, remarks, finalPrice});
    return NextResponse.json({ message: "Bill created successfully." }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const bill = await Bill.find();
    const totalFinalPrice = bill.reduce((sum, sale) => {
        return sum + (sale.finalPrice || 0);
    }, 0);
    return NextResponse.json({bill, totalFinalPrice});
}