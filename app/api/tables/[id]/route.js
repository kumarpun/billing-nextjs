import { connectMongoDB } from "../../../../lib/mongodb";
import Table from "../../../../models/table";
import { NextResponse } from "next/server";

export async function PUT(request, {params}) {
    const { id } = params;
    const { newTitle: title, newDescription: description } = await request.json();
    await connectMongoDB();
    await Table.findByIdAndUpdate(id, { title, description });
    return NextResponse.json({ message: "Table updated" }, { status: 200 });
}

export async function GET(request, {params}) {
    const { id } = params;
    await connectMongoDB();
    const table = await Table.findOne({ _id: id });
    return NextResponse.json({ table }, { status: 200 });
}
