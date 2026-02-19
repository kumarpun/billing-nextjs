import { NextResponse } from "next/server";
import Menu from "../../../models/menu";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
        const menuList = await Menu.find().lean();
        return NextResponse.json({ menuList });
    } catch (error) {
        console.error("Error fetching menuList:", error);
        return NextResponse.json({ error: "Error fetching menuList" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { value, label, price, order_type } = await request.json();
        await dbConnect();
        await Menu.create({ value, label, price, order_type });
        return NextResponse.json(
            { message: "Menu saved successfully." },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to save Menu.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const { id, ...updateData } = await request.json();
    await dbConnect();
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (!updatedMenu) {
            return NextResponse.json({ error: "Menu not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Menu updated successfully.", menu: updatedMenu }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error Menu price" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect();
    try {
        const deleted = await Menu.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Menu not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Menu deleted." });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting menu" }, { status: 500 });
    }
}