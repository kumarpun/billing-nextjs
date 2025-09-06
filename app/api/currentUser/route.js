// app/api/user/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../models/user";
import { connectMongoDB } from "../../../lib/mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();
    
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
    const user = await User.findById(decoded._id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data (excluding password)
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}