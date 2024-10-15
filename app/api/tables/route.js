import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Table from "../../../models/table";
import { dbConnect } from "../dbConnect";

export async function POST(request) {
    const { title, description } = await request.json();
    // await connectMongoDB();
    await dbConnect(); // Reused MongoDB connection
    await Table.create({ title, description });
    return NextResponse.json({ message: "Table created." }, { status: 201 });
}

export async function GET() {
    await dbConnect(); // Reused MongoDB connection
    try {
  
        const tables = await Table.find();
        return NextResponse.json({tables});
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: "Error fetching tables" }, { status: 500 });
    }

}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect(); // Reused MongoDB connection
    await Table.findByIdAndDelete(id);
    return NextResponse.json({ message: "Table deleted." });
}