// app/api/user/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../models/user";
import { dbConnect } from "../dbConnect";

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const token = request.cookies.get("authToken")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Access denied. No token provided." },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    
    // Find user
    const user = await User.findById(decoded._id).select("_id name email role").lean();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data (excluding password)
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}