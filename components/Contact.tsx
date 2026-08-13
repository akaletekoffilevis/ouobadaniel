"use client";

import { useState } from "react";
import type { PublicSettings } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { WhatsAppIcon, PhoneIcon, MailIcon, PinIcon } from "@/components/Icons";

export default function Contact({ settings }: { settings: PublicSettings | null }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const whatsapp = settings?.whatsapp?.replace(/\D/g, "") || "22774826486";
  const waLink = `https://wa.me/${whatsapp}`;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Bonjour ! ${name ? `Je m'appelle ${name}. ` : ""}${message}`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            {t.contact.title}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-950 sm:text-4xl">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-base text-zinc-600">{t.contact.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-[#25D366] p-5 text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-7 w-7 shrink-0" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  {t.contact.whatsapp}
                </p>
                <p className="text-lg font-bold">{settings?.whatsapp || "+227 74 82 64 86"}</p>
              </div>
            </a>

            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-4 rounded-2xl bg-navy-950 p-5 text-white shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <PhoneIcon className="h-6 w-6 shrink-0 text-orange-400" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                    {t.contact.phone}
                  </p>
                  <p className="text-lg font-bold">{settings.phone}</p>
                </div>
              </a>
            )}

            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-4 rounded-2xl border border-navy-950/10 bg-cream p-5 text-navy-950 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <MailIcon className="h-6 w-6 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {t.contact.email}
                  </p>
                  <p className="text-base font-bold break-all">{settings.email}</p>
                </div>
              </a>
            )}

            {settings?.location && (
              <div className="flex items-center gap-4 rounded-2xl border border-navy-950/10 bg-cream p-5 text-navy-950 shadow-sm">
                <PinIcon className="h-6 w-6 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {t.contact.location}
                  </p>
                  <p className="text-base font-bold">{settings.location}</p>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={send}
            className="rounded-2xl border border-navy-950/10 bg-cream p-6 shadow-md sm:p-8"
          >
            <h3 className="font-display text-xl font-bold text-navy-950">
              {t.contact.formTitle}
            </h3>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  {t.contact.formName}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-navy-950/15 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  {t.contact.formMessage}
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-xl border border-navy-950/15 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-400"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.contact.formSend}
            </button>
            <p className="mt-3 text-center text-xs text-zinc-500">{t.contact.formHint}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
