import { NextResponse } from "next/server";
import Note from "../../../models/note";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
  
        const noteList = await Note.find();
        return NextResponse.json({noteList});
    } catch (error) {
        console.error("Error fetching noteList:", error);
        return NextResponse.json({ error: "Error fetching noteList" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { remarks, date } = await request.json();
        await dbConnect();
        await Note.create({ remarks, date });
        return NextResponse.json(
            { message: "Note saved successfully." },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to save Note.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const { id, ...updateData } = await request.json();
    await dbConnect();
    try {
        const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Note updated successfully.", credit: updatedNote }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error Note price" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect(); // Reused MongoDB connection
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted." });
}