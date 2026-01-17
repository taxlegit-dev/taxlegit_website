"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Page not found</h1>
        <p className="text-slate-600">
          The page you are looking for does not exist. You will be redirected to
          the home page in 10 seconds.
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-2 text-white font-semibold hover:bg-purple-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
