"use client";

import { useI18n } from "@/lib/i18n";
import { TeachIcon, CheckIcon } from "@/components/Icons";

export default function Training() {
  const { t } = useI18n();

  return (
    <section id="training" className="bg-navy-950 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
            <TeachIcon className="h-4 w-4" />
            {t.training.title}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            {t.training.title}
          </h2>
          <p className="mt-4 text-base text-white/70">{t.training.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {t.training.courses.map((course) => (
            <div
              key={course.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-orange-500/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-400">
                  {course.level}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{course.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
                  >
                    <CheckIcon className="h-3.5 w-3.5 text-orange-400" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-transparent p-6 text-center sm:p-8">
          <h3 className="font-display text-xl font-bold text-orange-400">
            {t.training.noteTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            {t.training.note}
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-400"
          >
            {t.training.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
