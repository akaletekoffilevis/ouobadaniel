"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { CloseIcon, GlobeIcon } from "@/components/Icons";

const sectionIds = ["home", "about", "services", "training", "portfolio", "contact"];

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const labels: Record<string, string> = {
    home: t.nav.home,
    about: t.nav.about,
    services: t.nav.services,
    training: t.nav.training,
    portfolio: t.nav.portfolio,
    contact: t.nav.contact,
  };

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-shadow duration-300 ${
        scrolled
          ? "border-white/10 bg-navy-950 shadow-lg shadow-navy-950/30"
          : "border-white/5 bg-navy-950"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#home" className="flex items-center gap-3">
          <Image
            src="/logo-impact-creation.jpg"
            alt="Impact Création"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-contain bg-white ring-1 ring-white/20"
          />
          <span className="hidden text-sm font-bold uppercase tracking-widest text-white sm:block">
            Impact <span className="text-orange-500">Création</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm font-medium text-white/80 transition-colors hover:text-orange-400"
            >
              {labels[id]}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-orange-500 hover:text-orange-400"
          >
            <GlobeIcon className="h-4 w-4" />
            {lang}
          </button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleLang}
            className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
          >
            {lang}
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg text-white"
          >
            <span className="h-0.5 w-6 bg-current" />
            <span className="h-0.5 w-6 bg-current" />
            <span className="h-0.5 w-6 bg-current" />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer — glisse depuis la gauche */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-xs flex-col bg-navy-950 text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-impact-creation.jpg"
              alt="Impact Création"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-contain bg-white"
            />
            <span className="text-sm font-bold uppercase tracking-widest">
              Impact <span className="text-orange-500">Création</span>
            </span>
          </div>
          <button
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-orange-400"
            >
              {labels[id]}
            </a>
          ))}
        </div>

        <div className="border-t border-white/10 px-5 py-5">
          <button
            onClick={toggleLang}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-orange-500 hover:text-orange-400"
          >
            <GlobeIcon className="h-4 w-4" />
            {lang === "fr" ? "English" : "Français"}
          </button>
          <p className="mt-4 text-center text-[11px] text-white/40">
            Impact Création · Niamey, Niger
          </p>
        </div>
      </div>
    </header>
  );
}
