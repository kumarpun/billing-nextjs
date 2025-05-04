import Inventory from "../../../../models/inventory";
import { NextResponse } from "next/server";
import { dbConnect } from "../../dbConnect";

export async function PUT(request, {params}) {
    const { id } = params;
    const { newTitle: title, newQuantity: quantity, newMl: ml } = await request.json();
    await dbConnect(); // Reused MongoDB connection
    await Inventory.findByIdAndUpdate(id, { title, quantity, ml });
    return NextResponse.json({ message: "Inventory updated" }, { status: 200 });
}
