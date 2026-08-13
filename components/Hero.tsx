"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { WhatsAppIcon } from "@/components/Icons";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy-950 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/4 translate-y-1/4 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-32 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-44">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
            {t.hero.eyebrow}
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t.hero.name}
          </h1>

          <p className="mt-4 inline-flex items-center gap-2 text-base font-semibold uppercase tracking-widest text-orange-500 sm:text-lg">
            <span className="h-px w-8 bg-orange-500" />
            {t.hero.title}
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {t.hero.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-transform hover:-translate-y-0.5 hover:bg-orange-400"
            >
              {t.hero.ctaPortfolio}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-orange-500 hover:text-orange-400"
            >
              {t.hero.ctaContact}
            </a>
          </div>

          <p className="mt-8 text-sm text-white/50">{t.hero.based}</p>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-orange-500/40 to-transparent blur-xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
              <Image
                src="/photo-daniel-1.jpg"
                alt="Ouoba Lamourdjoa Daniel"
                width={720}
                height={820}
                className="h-auto w-72 object-cover sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 text-orange-400">
                <WhatsAppIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Impact Création
                </p>
                <p className="text-sm font-bold text-navy-900">+227 74 82 64 86</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
