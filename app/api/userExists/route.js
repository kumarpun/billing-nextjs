import { NextResponse } from "next/server";
import User from "../../../models/user";
import { dbConnect } from "../dbConnect";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id").lean();
        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: "Error checking user" }, { status: 500 });
    }
}