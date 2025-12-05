import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import Link from "next/link";
export default async function UserDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "USER") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">
              User Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">My Profile</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Manage your account settings and preferences
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium text-zinc-700">Email:</span>{" "}
                {session.user.email}
              </p>
              <p>
                <span className="font-medium text-zinc-700">Region:</span> India
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Services</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Browse and access tax services
            </p>
            <Link
              href="/services"
              className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View Services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
