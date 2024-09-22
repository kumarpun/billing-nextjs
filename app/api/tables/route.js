import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Table from "../../../models/table";
import jwt from "jsonwebtoken";

export async function POST(request) {
    const { title, description } = await request.json();
    await connectMongoDB();
    await Table.create({ title, description });
    return NextResponse.json({ message: "Table created." }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
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
    await connectMongoDB();
    await Table.findByIdAndDelete(id);
    return NextResponse.json({ message: "Table deleted." });
}