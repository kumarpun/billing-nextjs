// import { NextResponse } from "next/server";
// import { dbConnect } from "../dbConnect";
// import User from "../../../models/user";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { name, email, password, role } = await req.json();
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Create user with role (defaults to "user" if not provided)
//     await User.create({ 
//       name, 
//       email, 
//       password: hashedPassword,
//       role: role || "user" // Use provided role or default to "user"
//     });

//     return NextResponse.json({ message: "User registered." }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "An error occurred while registering the user." },
//       { status: 500 }
//     );
//   }
// }