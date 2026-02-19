"use client";

import PageNav from "../components/PageNav";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTable() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("Title and description are required.");
            return;
          }

          try {
            const res = await fetch("/api/tables", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ title, description }),
            });

            if (res.ok) {
              router.push("/");
              router.refresh();
            } else {
              throw new Error("Failed to create a topic");
            }
          } catch (error) {
            console.log(error);
          }
        };

        const handleBack = () => {
          router.back();
      };

    return (
        <div>
      <PageNav
        titleHref="/tables"
        centerTitle
        buttons={[{ label: "Back", onClick: handleBack }]}
      />
                    <br/>
                    <div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="border border-slate-500 px-8 py-2 text-black" type="text" placeholder="Table Name" />
            <input
             onChange={(e) => setDescription(e.target.value)}
             value={description}
            className="border border-slate-500 px-8 py-2 text-black" type="text" placeholder="Table description" />
        <button type="submit" className="hover:text-gray-300 font-medium transition-colors duration-200 nav-button py-3 px-6 w-fit">
        Add table
        </button>
        </form>
           </div>
        </div>
    )
}
