"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Work } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import {
  CheckIcon,
  CloseIcon,
  LogoutIcon,
  TrashIcon,
  WhatsAppIcon,
} from "@/components/Icons";

type UiState = "checking" | "login" | "ready";

export default function AdminPage() {
  const { lang, setLang } = useI18n();
  const [ui, setUi] = useState<UiState>("checking");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);

  const [works, setWorks] = useState<Work[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [wa, setWa] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/works");
      if (res.status === 401) {
        setUi("login");
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWorks(data.works ?? []);
      setUi("ready");
    } catch {
      setUi("login");
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data.settings) {
        setWa(data.settings.whatsapp ?? "");
        setPhone(data.settings.phone ?? "");
        setEmail(data.settings.email ?? "");
        setLocation(data.settings.location ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- vérification de session au chargement
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement des coordonnées après connexion
    if (ui === "ready") loadSettings();
  }, [ui, loadSettings]);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  };

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Erreur de connexion.");
        setBusy(false);
        return;
      }
      await checkSession();
    } catch {
      setLoginError("Erreur réseau. Réessayez.");
      setBusy(false);
    }
  };

  const doLogout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    setUi("login");
    setWorks([]);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  };

  const doAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      flash("err", "Choisissez une image.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title);
      fd.append("category", category || "Design");
      if (dims) {
        fd.append("width", String(dims.w));
        fd.append("height", String(dims.h));
      }
      const res = await fetch("/api/admin/works", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        flash("err", data.error || "Échec de l'ajout.");
        setBusy(false);
        return;
      }
      setWorks((prev) => [data.work, ...prev]);
      setTitle("");
      setCategory("");
      setFile(null);
      setDims(null);
      setPreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      flash("ok", "Œuvre ajoutée !");
      setBusy(false);
    } catch {
      flash("err", "Erreur réseau. Réessayez.");
      setBusy(false);
    }
  };

  const doDeleteWork = async (id: string) => {
    if (!window.confirm("Supprimer cette œuvre ?")) return;
    const res = await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
    if (res.ok) {
      setWorks((prev) => prev.filter((w) => w.id !== id));
      flash("ok", "Œuvre supprimée.");
    } else {
      flash("err", "Échec de la suppression.");
    }
  };

  const doSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp: wa, phone, email, location }),
    });
    const data = await res.json();
    if (res.ok) {
      flash("ok", "Coordonnées enregistrées.");
    } else {
      flash("err", data.error || "Échec de l'enregistrement.");
    }
    setBusy(false);
  };

  const doChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setBusy(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewPassword("");
      flash("ok", "Mot de passe modifié.");
    } else {
      flash("err", data.error || "Échec de la modification.");
    }
    setBusy(false);
  };

  const inputCls =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";
  const labelCls = "mb-1.5 block text-sm font-medium text-zinc-700";

  if (ui === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-white">
        <p className="text-sm text-white/60">Chargement…</p>
      </div>
    );
  }

  if (ui === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5">
        <form
          onSubmit={doLogin}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-navy-950">Espace admin</h1>
            <button
              type="button"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold uppercase text-zinc-600"
            >
              {lang}
            </button>
          </div>
          <p className="mt-1 text-sm text-zinc-500">Impact Création</p>
          <label htmlFor="pw" className={`mt-6 ${labelCls}`}>
            Mot de passe
          </label>
          <input
            id="pw"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={inputCls}
            autoFocus
          />
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-full bg-navy-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
          >
            {busy ? "Connexion…" : "Se connecter"}
          </button>
          <Link href="/" className="mt-4 block text-center text-sm text-zinc-500 hover:text-orange-600">
            ← Retour au site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-20 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="font-display text-xl font-bold">Dashboard — Impact Création</h1>
            <p className="text-xs text-white/60">Gérez vos œuvres et vos coordonnées</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase text-white hover:border-orange-400 hover:text-orange-400"
            >
              {lang}
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-orange-400 hover:text-orange-400"
            >
              Voir le site
            </Link>
            <button
              onClick={doLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <LogoutIcon className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-5 py-10">
        {message && (
          <div
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ${
              message.type === "ok"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "ok" ? <CheckIcon className="h-4 w-4" /> : <CloseIcon className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={doAddWork}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-bold text-navy-950">Ajouter une œuvre</h2>
            <p className="mt-1 text-xs text-zinc-500">
              JPG, PNG, WebP ou GIF — max 8 Mo. L&apos;image est envoyée sur le serveur (Vercel Blob / Supabase Storage).
            </p>

            <div className="mt-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onPickFile}
                className="w-full rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-600"
              />
              {preview && (
                <div className="mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Aperçu" className="max-h-48 rounded-xl object-contain" />
                  {dims && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {dims.w} × {dims.h} px
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Titre</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Ex : Affiche festival" />
              </div>
              <div>
                <label className={labelCls}>Catégorie</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} placeholder="Ex : Affiche, Carte, Logo…" />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-60"
            >
              {busy ? "Envoi…" : "Ajouter l'œuvre"}
            </button>
          </form>

          <form
            onSubmit={doSaveContacts}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-bold text-navy-950">Coordonnées de contact</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Ces informations apparaissent sur le site public.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <label className={labelCls}>
                  <WhatsAppIcon className="mr-1 inline h-4 w-4 text-[#25D366]" /> WhatsApp
                </label>
                <input value={wa} onChange={(e) => setWa(e.target.value)} className={inputCls} placeholder="+227 74 82 64 86" />
              </div>
              <div>
                <label className={labelCls}>Téléphone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+227 82 39 09 93" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Localisation</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} placeholder="Niamey, Niger" />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full rounded-full bg-navy-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {busy ? "Enregistrement…" : "Enregistrer les coordonnées"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-navy-950">Changer le mot de passe</h2>
          <form onSubmit={doChangePassword} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className={labelCls}>Nouveau mot de passe (min. 6 caractères)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputCls}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !newPassword}
              className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              Mettre à jour
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy-950">
              Mes œuvres ({works.length})
            </h2>
          </div>
          {works.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">Aucune œuvre pour le moment.</p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((w) => (
                <div key={w.id} className="overflow-hidden rounded-2xl border border-zinc-200">
                  <div className="flex items-center justify-center bg-zinc-100 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.image_url}
                      alt={w.title}
                      className="max-h-44 object-contain"
                      style={{ aspectRatio: w.width && w.height ? `${w.width}/${w.height}` : undefined }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">{w.title}</p>
                      {w.category && (
                        <p className="truncate text-xs uppercase tracking-wider text-orange-600">
                          {w.category}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => doDeleteWork(w.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                      aria-label="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
