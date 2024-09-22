import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../../models/user";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;
                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });
                    if (!user) {
                        return null;
                    }
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (!passwordsMatch) {
                        return null;
                    }
                    return user;
                } catch (error) {
                    console.log("Error: ", error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.token = token;
            return session;
        }
    }
});

// Use Next.js's new `NextResponse` to handle GET and POST methods in the app directory.
export { handler as GET, handler as POST };