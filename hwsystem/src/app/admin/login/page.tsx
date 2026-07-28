import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthed } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthed()) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-16">
      <div className="mx-auto max-w-sm rounded-md border border-line bg-white p-8">
        <Lock aria-hidden className="size-5 text-ink" strokeWidth={1.5} />
        <h1 className="mt-3 text-h3 text-ink">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-steel">
          Internal dashboard for the HWSystem team.
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
