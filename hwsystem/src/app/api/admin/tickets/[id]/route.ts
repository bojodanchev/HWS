import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthed } from "@/lib/adminAuth";
import { updateTicket } from "@/lib/adminOps";

const schema = z
  .object({
    status: z.enum(["open", "pending", "resolved"]).optional(),
    priority: z.enum(["low", "normal", "high"]).optional(),
  })
  .refine((data) => data.status !== undefined || data.priority !== undefined, {
    message: "Nothing to update",
  });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  const { id } = await params;
  const found = await updateTicket(id, parsed.data);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
