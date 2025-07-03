import { NextResponse } from "next/server";
import Price from "../../../models/pricelist";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
        const price = await Price.find();
        return NextResponse.json({price});
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: "Error fetching price" }, { status: 500 });
    }
}

export async function POST(request) {
    const { title, quantity, price } = await request.json();
    await dbConnect();
    const newPrice = await Price.create({ title, quantity, price });
    return NextResponse.json({ message: "Price added successfully.", price: newPrice }, { status: 201 });
}

export async function PUT(request) {
    const { id, ...updateData } = await request.json();
    await dbConnect();
    try {
        const updatedPrice = await Price.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPrice) {
            return NextResponse.json({ error: "Price not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Price updated successfully.", price: updatedPrice }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error updating price" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { id } = await request.json();
    await dbConnect();
    try {
        const deletedPrice = await Price.findByIdAndDelete(id);
        if (!deletedPrice) {
            return NextResponse.json({ error: "Price not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Price deleted successfully." }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting price" }, { status: 500 });
    }
}