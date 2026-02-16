import { NextResponse } from "next/server";
import Checklist from "../../../models/checklist";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
  
        const checklist = await Checklist.find().lean();
        return NextResponse.json({checklist});
    } catch (error) {
        console.error("Error fetching checklist:", error);
        return NextResponse.json({ error: "Error fetching checklist" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, isChecked } = await request.json();
        await dbConnect();
        await Checklist.create({ name, isChecked });
        return NextResponse.json(
            { message: "Checklist saved successfully." },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to save checklist.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    await dbConnect();
    
    try {
        // Update all checked items (isChecked: true) to false
        const result = await Checklist.updateMany(
            { isChecked: true }, // Only find checked items
            { 
                $set: { 
                    isChecked: false,
                    updatedAt: new Date() 
                } 
            }
        );

        return NextResponse.json({
            success: true,
            message: `All checked items (${result.modifiedCount}) have been unchecked`,
            updatedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("Error unchecking all items:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}