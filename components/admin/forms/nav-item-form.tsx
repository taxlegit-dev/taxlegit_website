"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNavItemSchema } from "@/lib/validators";

const navFormSchema = createNavItemSchema.extend({
  order: z.preprocess((value) => Number(value ?? 0), z.number().int().min(0)),
  type: z.enum(["LINK", "DROPDOWN"]).default("LINK"),
  isLoginLink: z.boolean().default(false),
});

type NavFormValues = z.infer<typeof navFormSchema>;

type NavItemFormProps = {
  region: "INDIA" | "US";
};

export function NavItemForm({ region }: NavItemFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NavFormValues>({
    resolver: zodResolver(navFormSchema),
    defaultValues: {
      label: "",
      href: "",
      order: 0,
      pageType: "SERVICE",
      type: "LINK",
      isLoginLink: false,
      region,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch("/api/admin/navbar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.error ?? "Unable to save navigation item");
        return;
      }

      reset({
        label: "",
        href: "",
        order: 0,
        pageType: "SERVICE",
        type: "LINK",
        isLoginLink: false,
        region,
      });
      setMessage("Navigation item saved");
      router.refresh();
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Label</label>
        <input
          type="text"
          className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          {...register("label")}
        />
        {errors.label && (
          <p className="text-xs text-red-500">{errors.label.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Href</label>
        <input
          type="text"
          placeholder="/services"
          className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          {...register("href")}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-800">Order</label>
          <input
            type="number"
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register("order")}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-800">
            Page Type
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register("pageType")}
          >
            <option value="SERVICE">Service</option>
            <option value="GENERIC">Generic</option>
          </select>
        </div>
      </div>
      <input type="hidden" value={region} {...register("region")} />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Add navigation link"}
      </button>
      {message && (
        <p className="text-center text-xs text-slate-500">{message}</p>
      )}
    </form>
  );
}
