import { NextResponse } from "next/server";
import Inventory from "../../../models/inventory";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect(); // Reused MongoDB connection
    try {
  
        const inventory = await Inventory.find();
        return NextResponse.json({inventory});
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: "Error fetching inventory" }, { status: 500 });
    }
}

export async function POST(request) {
    const { title,quantity} = await request.json();
    await dbConnect(); // Reused MongoDB connection
    await Inventory.create({title,quantity});
    return NextResponse.json({ message: "Inventory added successfully." }, { status: 201 });
}