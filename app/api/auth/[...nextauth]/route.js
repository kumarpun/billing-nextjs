// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectMongoDB } from "../../../../lib/mongodb";
// import bcrypt from "bcryptjs";
// import User from "../../../../models/user";

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {},

//           async authorize(credentials) {
//             const { email, password } = credentials;
//             try {
//                 await connectMongoDB();
//                const user = await User.findOne({ email });
//                if (!user) {
//                     return null;
//                }
//                const passwordsMatch = await bcrypt.compare(password, user.password);
//                 if (!passwordsMatch) {
//                       return null;
//                 }
//                 return user;
//             } catch (error) {
//                 console.log("Error: ", error);
//             }
//           }  
//         })
//     ],
//     session: {
//         strategy: "jwt",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     pages: {
//         signIn: "/",
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user._id;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             session.user.id = token.id;
//             session.token = token; // Add the token to the session object
//             return session;
//         }
//     }
// }

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST }
