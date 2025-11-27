"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
        callbackUrl: redirectTo,
      });

      if (result?.error) {
        setError("Invalid credentials or access denied. US users cannot login. Only India users can access the portal.");
        return;
      }

      // The redirect will be handled by the login page based on user role
      router.push(result?.url ?? redirectTo ?? "/");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-800" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="admin@taxlegit.com"
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-800" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-xs text-zinc-500">
        Use the seeded admin credentials or update them in prisma/seed.ts before running `npm run db:push`.
      </p>
    </form>
  );
}

