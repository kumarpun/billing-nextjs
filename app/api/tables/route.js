import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Table from "../../../models/table";

export async function POST(request) {
    const { title, description } = await request.json();
    await connectMongoDB();
    await Table.create({ title, description });
    return NextResponse.json({ message: "Table created." }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const tables = await Table.find();
    return NextResponse.json({tables});
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Table.findByIdAndDelete(id);
    return NextResponse.json({ message: "Table deleted." });
}