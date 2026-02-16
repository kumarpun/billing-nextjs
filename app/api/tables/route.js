import { NextResponse } from "next/server";
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
  
        const tables = await Table.find().lean();
        return NextResponse.json({tables});
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: "Error fetching tables" }, { status: 500 });
    }

}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect();
    try {
        const deleted = await Table.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Table not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Table deleted." });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting table" }, { status: 500 });
    }
}