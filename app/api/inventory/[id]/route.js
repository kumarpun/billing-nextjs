import { Inventory } from "../../../../models/inventory";
import { NextResponse } from "next/server";
import { dbConnect } from "../../dbConnect";

export async function PUT(request, { params }) {
    const { id } = params;
    await dbConnect();
    
    try {
        const updateData = await request.json();
        const { title, isMl, ml, bottle, received, category, threshold, opening, sales, manualOrderAdjustment } = updateData;

        // If any quantity fields are being updated, recalculate closing
        if (opening !== undefined || received !== undefined || sales !== undefined) {
            const item = await Inventory.findById(id);
            
            // Use new values if provided, otherwise use existing values
            const newOpening = opening !== undefined ? opening : item.opening;
            const newReceived = received !== undefined ? received : item.received;
            const newSales = sales !== undefined ? sales : item.sales;
            
            // Calculate new closing: opening + received - sales
            updateData.closing = newOpening + newReceived - newSales;
        }

        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Inventory updated successfully", 
            item: updatedItem 
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json({ error: "Error updating inventory" }, { status: 500 });
    }
}