"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Training from "@/components/Training";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import type { PublicSettings, Work } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();
  const [works, setWorks] = useState<Work[]>([]);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public")
      .then((res) => {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setWorks(Array.isArray(data.works) ? data.works : []);
        setSettings(data.settings ?? null);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About workCount={works.length} />
        <Services />
        <Training />
        {state === "loading" && (
          <div className="flex items-center justify-center bg-cream py-24 text-sm text-zinc-500">
            {t.portfolio.loading}
          </div>
        )}
        {state === "error" && (
          <div className="flex items-center justify-center bg-cream py-24 text-sm text-zinc-500">
            {t.portfolio.loadError}
          </div>
        )}
        <Gallery works={works} />
        <Contact settings={settings} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
