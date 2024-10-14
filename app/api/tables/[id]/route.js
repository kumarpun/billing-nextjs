import { connectMongoDB } from "../../../../lib/mongodb";
import Table from "../../../../models/table";
import { NextResponse } from "next/server";
import { dbConnect } from "./dbConnect";

export async function PUT(request, {params}) {
    const { id } = params;
    const { newTitle: title, newDescription: description } = await request.json();
    await dbConnect(); // Reused MongoDB connection
    await Table.findByIdAndUpdate(id, { title, description });
    return NextResponse.json({ message: "Table updated" }, { status: 200 });
}

export async function GET(request, {params}) {
    const { id } = params;
    await dbConnect(); // Reused MongoDB connection
    const table = await Table.findOne({ _id: id });
    return NextResponse.json({ table }, { status: 200 });
}
