import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Database, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { isAdminAuthed } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | HWSystem",
  },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">Admin panel</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-steel">
            <Database aria-hidden className="size-4" strokeWidth={1.5} />
            Live data only — leads and tickets come from site form
            submissions; orders arrive with the WooCommerce integration.
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink"
          >
            <LogOut aria-hidden className="size-4" strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="mt-8">{children}</div>
    </main>
  );
}
