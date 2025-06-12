"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const res = await signIn('credentials', {
      //   email,
      //   password,
      //   redirect: false,      
      // });
      // if (res.error) {
      //   setError("Invalid Credentials");
      //   return;
      // }
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            name, email, password
         }),
    })
     if (res.ok) {
      router.replace("/dashReport");
        return;
      }
      setError("Invalid Credentials");
      // router.replace("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return( 
    <div className="body">
        <div className="wrapper">
  {/* <div className="grid place-items-center h-screen"> */}
      {/* <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400"> */}
        {/* <h1 className="text-xl font-bold my-4">Enter the details</h1> */}
        {/* <form onSubmit={handleSubmit} className="flex flex-col gap-3"> */}
        <form onSubmit={handleSubmit}>
        <h2>HYBE Login</h2>
        <div className="input-field">
        <input 
            onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email"/>
            {/* <label>Enter your email</label> */}
      </div>

      <div className="input-field">
        <input 
            onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/>
            {/* <label>Enter your password</label> */}
      </div>

            {/* <input
            onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email"/> */}
            {/* <input
            onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/> */}
            {/* <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2"> */}
            <button className="login-btn">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}  
         {/* <Link className="text-sm mt-3 text-right" href={"/auth/register"}> */}
         {/* <Link className="register" href={"/auth/register"}>
            Dont have an account? <span className="underline">Register</span>
            </Link> */}

        </form>
    </div>
  </div>
// {/* </div> */}
// </div>
  )
}