import RegisterForm from "../RegisterForrm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// import { authOptions } from "../../api/auth/[...nextauth]/route";
import { cookies } from "next/headers"; // Import cookie handling in Next.js
import jwt from "jsonwebtoken";

export default async function Register() {
    // const session = await getServerSession(authOptions);
    
    // if (session) redirect("/dashboard");
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;

    if (authToken) {
        try {
            // Verify the token using the secret
            const decodedToken = jwt.verify(authToken, process.env.NEXTAUTH_SECRET);
            if (decodedToken) {
                // If the token is valid, redirect to the dashboard
                redirect("/dashboard");
            }
        } catch (error) {
            console.log("Invalid or expired token", error);
            // If the token is invalid or expired, allow registration
        }
    }

    return <RegisterForm />;
}