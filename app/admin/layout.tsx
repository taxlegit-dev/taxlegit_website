import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

const navItems = [
  { label: "Navigation", href: "/admin/navigation" },
  { label: "Create Hero Section", href: "/admin/hero" },
  { label: "Add FAQ", href: "/admin/faq" },
  { label: "Add Service Pages", href: "/admin/service-pages" },
  { label: "Generic Pages", href: "/admin/generic-pages" },
  { label: "Blog Management", href: "/admin/blog" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 md:flex">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          Taxlegit Admin
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="space-y-1 text-xs text-slate-500">
            <p>{session.user.email}</p>
            <p className="font-semibold text-slate-700">{session.user.role}</p>
          </div>
          <Link
            href="/admin/change-password"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Change Password
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-10">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </main>
    </div>
  );
}
