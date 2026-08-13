"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { DownloadIcon, CheckIcon } from "@/components/Icons";

export default function About({ workCount }: { workCount: number }) {
  const { t } = useI18n();
  const stats = [
    { value: String(workCount), label: t.about.stats.works },
    { value: "7", label: t.about.stats.software },
    { value: "4", label: t.about.stats.training },
  ];

  return (
    <section id="about" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-navy-950/10 shadow-xl">
            <Image
              src="/photo-daniel-2.jpg"
              alt={t.about.name}
              width={760}
              height={860}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-3 rounded-2xl bg-navy-950 px-6 py-4 text-white shadow-2xl sm:-right-6">
            <p className="font-display text-3xl font-bold text-orange-400">{workCount}+</p>
            <p className="text-xs uppercase tracking-widest text-white/70">{t.about.stats.works}</p>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            {t.about.title}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-950 sm:text-4xl">
            {t.about.lede}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-700">{t.about.bio1}</p>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">{t.about.bio2}</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-navy-950/10 bg-white p-4 text-center shadow-sm"
              >
                <p className="font-display text-2xl font-bold text-navy-950">{s.value}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-navy-950/10 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-display text-lg font-bold text-navy-950">
              {t.about.experienceTitle}
            </h3>
            <ol className="relative mt-6 space-y-6 border-l-2 border-orange-500/40 pl-6">
              {t.about.experiences.map((e) => (
                <li key={e.label} className="relative">
                  <span className="absolute -left-[34px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 ring-4 ring-orange-500/20" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="shrink-0 rounded-full bg-navy-950 px-3 py-1 text-xs font-bold text-orange-400">
                      {e.period}
                    </span>
                    <p className="font-semibold text-navy-950">{e.label}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-navy-950/10 pt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-zinc-700">
                <CheckIcon className="h-3.5 w-3.5 text-orange-600" />
                Photoshop · Illustrator · Canva
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-zinc-700">
                <CheckIcon className="h-3.5 w-3.5 text-orange-600" />
                Word · Excel · PowerPoint · Publisher
              </span>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
              >
                <DownloadIcon className="h-4 w-4" />
                {t.about.downloadCv}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
