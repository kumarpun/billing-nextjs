// import RegisterForm from "../RegisterForrm";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "../../api/auth/[...nextauth]/route";

// export default async function Register() {
//     const session = await getServerSession(authOptions);
    
//     if (session) redirect("/dashboard");

//     return <RegisterForm />;
// }
import RegisterForm from "../RegisterForrm";
import { cookies } from "next/headers"; // Import cookie handling in Next.js
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function Register() {
    // Get cookies from the request
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
