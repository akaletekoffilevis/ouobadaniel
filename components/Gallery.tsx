"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Work } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { CloseIcon, ChevronIcon } from "@/components/Icons";

export default function Gallery({ works }: { works: Work[] }) {
  const { t } = useI18n();
  const [category, setCategory] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(works.map((w) => w.category).filter(Boolean))).sort(),
    [works]
  );

  const filtered = useMemo(
    () =>
      category === "all" ? works : works.filter((w) => w.category === category),
    [works, category]
  );

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + filtered.length - 1) % filtered.length)),
    [filtered.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, prev, next]);

  return (
    <section id="portfolio" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            {t.portfolio.title}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-950 sm:text-4xl">
            {t.portfolio.title}
          </h2>
          <p className="mt-4 text-base text-zinc-600">{t.portfolio.subtitle}</p>
        </div>

        {categories.length > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === "all"
                  ? "bg-navy-950 text-white"
                  : "bg-white text-navy-950 hover:bg-navy-950/10"
              }`}
            >
              {t.portfolio.all}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  category === c
                    ? "bg-navy-950 text-white"
                    : "bg-white text-navy-950 hover:bg-navy-950/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {works.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500">{t.portfolio.empty}</p>
        ) : (
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {filtered.map((work, idx) => (
              <figure
                key={work.id}
                className="group mb-6 break-inside-avoid cursor-zoom-in"
                onClick={() => setLightbox(idx)}
              >
                <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow group-hover:shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={work.image_url}
                    alt={work.title}
                    loading="lazy"
                    className="h-auto w-full object-contain"
                    style={{ aspectRatio: work.width && work.height ? `${work.width}/${work.height}` : undefined }}
                  />
                </div>
                <figcaption className="mt-2 px-1">
                  <p className="text-sm font-semibold text-navy-950">{work.title}</p>
                  {work.category && (
                    <p className="text-xs uppercase tracking-wider text-orange-600">
                      {work.category}
                    </p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 p-4"
          onClick={close}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={close}
          >
            <CloseIcon />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronIcon className="rotate-180" />
              </button>
              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
              >
                <ChevronIcon />
              </button>
            </>
          )}

          <div
            className="flex max-h-full max-w-5xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filtered[lightbox].image_url}
              alt={filtered[lightbox].title}
              className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
            />
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{filtered[lightbox].title}</p>
              {filtered[lightbox].category && (
                <p className="text-xs uppercase tracking-widest text-orange-400">
                  {filtered[lightbox].category}
                </p>
              )}
              <p className="mt-1 text-xs text-white/50">
                {lightbox + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
