import { NextResponse } from "next/server";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "../dbConnect";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
      await dbConnect();
     const user = await User.findOne({ email });
     if (!user) {
          throw new Error("User not found");
     }
     const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
            throw new Error("Password is incorrect");
      }
      
    // 3. generate token

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.NEXTAUTH_SECRET
    );

    // 4.create nextresponse-- cookie

    const response = NextResponse.json({
      message: "Login success !!",
      success: true,
      user: user,
      token: token,
    });

    response.cookies.set("authToken", token, {
      expiresIn: "1d",
      httpOnly: true,
    });

    console.log(user);
    console.log(token);

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}