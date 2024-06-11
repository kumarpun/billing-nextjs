import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Bill from "../../../models/bill";

export async function POST(request) {
    const { originalPrice, finalPrice } = await request.json();
    await connectMongoDB();
    await Bill.create({ originalPrice, finalPrice});
    return NextResponse.json({ message: "Bill created successfully." }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const bill = await Bill.find();
    return NextResponse.json({bill});
}