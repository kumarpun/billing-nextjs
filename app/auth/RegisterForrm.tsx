"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("All fields are required.");
            return;
        }
        try {
            const resUserExists = await fetch("/api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const { user } = await resUserExists.json();
            if (user) {
                setError("User already exists.");
                return;
            }

            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name, email, password, role
                }),
            });
            if (res.ok) {
                const form = e.currentTarget;
                form.reset();
                router.push("/");
            } else {
                console.log("User registration failed.");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value);
    };

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
                <h1 className="text-xl font-bold my-4">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        onChange={handleNameChange}
                        type="text"
                        placeholder="Full name"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    <input
                        onChange={handleEmailChange}
                        type="text"
                        placeholder="Email"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    <input
                        onChange={handlePasswordChange}
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    
                    {/* Role Selection Dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Role</label>
                        <select
                            value={role}
                            onChange={handleRoleChange}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md">
                        Register
                    </button>
                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                    <Link className="text-sm mt-3 text-right" href={"/"}>
                        Already have an account? <span className="underline">Login</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}