import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { PublicSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = supabase();
    const [worksRes, settingsRes] = await Promise.all([
      db.from("works").select("id,title,category,image_url,width,height,created_at").order("created_at", { ascending: false }),
      db.from("settings").select("whatsapp,phone,email,location").limit(1).maybeSingle(),
    ]);

    if (worksRes.error) throw worksRes.error;

    const settings: PublicSettings | null = settingsRes.data as PublicSettings | null;

    return NextResponse.json({
      works: worksRes.data ?? [],
      settings,
    });
  } catch (err) {
    console.error("GET /api/public", err);
    return NextResponse.json(
      { error: "Impossible de charger les données du portfolio." },
      { status: 500 }
    );
  }
}
