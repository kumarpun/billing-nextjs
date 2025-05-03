import { NextResponse } from "next/server";
import Employee from "../../../models/employee";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect(); // Reused MongoDB connection
    try {
  
        const employee = await Employee.find();
        return NextResponse.json({employee});
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: "Error fetching employee" }, { status: 500 });
    }
}

export async function POST(request) {
    const {name, phone, dob, designation, image } = await request.json();
    await dbConnect(); // Reused MongoDB connection
    await Employee.create({name, phone, dob, designation, image});
    return NextResponse.json({ message: "Employee added successfully." }, { status: 201 });
}