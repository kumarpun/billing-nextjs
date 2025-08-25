import { NextResponse } from "next/server";
import Credit from "../../../models/credit";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
  
        const creditlist = await Credit.find();
        return NextResponse.json({creditlist});
    } catch (error) {
        console.error("Error fetching creditlist:", error);
        return NextResponse.json({ error: "Error fetching creditlist" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, date, amount, paid, remarks } = await request.json();
        await dbConnect();
        await Credit.create({ name, date, amount, paid, remarks });
        return NextResponse.json(
            { message: "Credit saved successfully." },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to save Credit.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const { id, ...updateData } = await request.json();
    await dbConnect();
    try {
        const updatedCredit = await Credit.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCredit) {
            return NextResponse.json({ error: "credit not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "credit updated successfully.", credit: updatedCredit }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error credit price" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect(); // Reused MongoDB connection
    await Credit.findByIdAndDelete(id);
    return NextResponse.json({ message: "credit deleted." });
}