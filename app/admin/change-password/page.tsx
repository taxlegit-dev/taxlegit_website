import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-900">
            Change Password
          </p>
          <p className="text-xs text-slate-500">
            Update the admin account password for this panel.
          </p>
        </div>
        <ChangePasswordForm initialEmail={session.user.email ?? ""} />
      </div>
    </section>
  );
}
