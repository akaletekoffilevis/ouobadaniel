import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword, isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const db = supabase();
  const { data, error } = await db
    .from("settings")
    .select("whatsapp,phone,email,location")
    .limit(1)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ settings: data ?? null });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const patch: Record<string, string> = {};

    for (const key of ["whatsapp", "phone", "email", "location"] as const) {
      if (typeof body[key] === "string") {
        patch[key] = body[key].trim();
      }
    }

    if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { error: "Le nouveau mot de passe doit faire au moins 6 caractères." },
          { status: 400 }
        );
      }
      patch.password_hash = hashPassword(body.newPassword);
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour." }, { status: 400 });
    }

    const db = supabase();
    const { data, error } = await db
      .from("settings")
      .update(patch)
      .eq("id", 1)
      .select("whatsapp,phone,email,location")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ settings: data });
  } catch (err) {
    console.error("PUT /api/admin/settings", err);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }
}
