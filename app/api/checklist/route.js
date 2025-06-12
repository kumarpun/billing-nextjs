import { NextResponse } from "next/server";
import Checklist from "../../../models/checklist";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
  
        const checklist = await Checklist.find();
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