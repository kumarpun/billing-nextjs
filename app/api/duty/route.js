import { NextResponse } from "next/server";
import Duty from "../../../models/duty";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect(); // Reused MongoDB connection
    try {
        const duty = await Duty.find().lean();
        return NextResponse.json({duty});
    } catch (error) {
        console.error("Error fetching duty:", error);
        return NextResponse.json({ error: "Error fetching duty" }, { status: 500 });
    }
}

export async function POST(request) {
    const { name, shift, date, designation, leave } = await request.json();
    await dbConnect(); // Reused MongoDB connection
    await Duty.create({name, shift, date, designation, leave});
    return NextResponse.json({ message: "Duty added successfully." }, { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    try {
        const { id, shift, date, leave } = await req.json();
        
        const updatedDuty = await Duty.findByIdAndUpdate(
            id,
            { shift, date, leave },
            { new: true }
        ).lean();

        if (!updatedDuty) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        return NextResponse.json({ duty: updatedDuty });
    } catch (error) {
        console.error("Error updating duty:", error);
        return NextResponse.json({ error: "Error updating duty" }, { status: 500 });
    }
}