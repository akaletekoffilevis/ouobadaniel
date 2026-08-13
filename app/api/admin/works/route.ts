import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "work";
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const db = supabase();
  const { data, error } = await db
    .from("works")
    .select("id,title,category,image_url,image_path,width,height,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ works: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const title = String(form.get("title") ?? "").trim();
    const category = String(form.get("category") ?? "Design").trim();
    const width = Number(form.get("width") ?? 0) || null;
    const height = Number(form.get("height") ?? 0) || null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Aucune image fournie." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image trop lourde (max 8 Mo)." },
        { status: 413 }
      );
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté (jpg, png, webp, gif uniquement)." },
        { status: 415 }
      );
    }

    const db = supabase();
    const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const path = `works/${Date.now()}-${slugify(file.name)}.${ext}`;

    const { error: uploadError } = await db.storage
      .from("works")
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const imageUrl = db.storage.from("works").getPublicUrl(path).data.publicUrl;

    const { data, error } = await db
      .from("works")
      .insert({
        title: title || "Sans titre",
        category,
        image_url: imageUrl,
        image_path: path,
        width,
        height,
      })
      .select()
      .single();

    if (error) {
      await db.storage.from("works").remove([path]);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ work: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/works", err);
    return NextResponse.json({ error: "Erreur lors de l'ajout." }, { status: 500 });
  }
}
