"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <div className="rounded-3xl text-white">
      <form
        className=" space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          // 👉 yahan API / action connect karna
          console.log("Subscribed:", email);
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/70"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-indigo-600 transition hover:bg-slate-100 active:scale-[0.98]"
        >
          Subscribe Now
        </button>
      </form>
    </div>
  );
}
