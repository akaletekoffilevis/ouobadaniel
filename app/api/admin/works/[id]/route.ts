import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = RouteContext<"/api/admin/works/[id]">;

export async function DELETE(request: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const db = supabase();

  const { data: work, error: findError } = await db
    .from("works")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  const { error: deleteError } = await db.from("works").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (work?.image_path) {
    await db.storage.from("works").remove([work.image_path]);
  }

  return NextResponse.json({ ok: true });
}
