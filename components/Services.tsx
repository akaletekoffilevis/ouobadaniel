"use client";

import { useI18n } from "@/lib/i18n";
import { serviceIcons } from "@/components/Icons";

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            {t.services.title}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-950 sm:text-4xl">
            {t.services.title}
          </h2>
          <p className="mt-4 text-base text-zinc-600">{t.services.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item) => {
            const Icon = serviceIcons[item.icon] ?? serviceIcons.pen;
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-navy-950/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
