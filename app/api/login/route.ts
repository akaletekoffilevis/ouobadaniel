import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ADMIN_COOKIE, createToken, verifyPassword } from "@/lib/auth";
import { clientIp, recordFailedAttempt, tooManyAttempts } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (tooManyAttempts(ip)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Mot de passe requis." }, { status: 400 });
    }

    const db = supabase();
    const { data, error } = await db
      .from("settings")
      .select("password_hash")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data?.password_hash) {
      return NextResponse.json(
        { error: "Compte admin non initialisé. Lancer le script de seed." },
        { status: 500 }
      );
    }

    if (!verifyPassword(password, data.password_hash)) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, createToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("POST /api/login", err);
    return NextResponse.json({ error: "Erreur de connexion." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
