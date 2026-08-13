"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { WhatsAppIcon } from "@/components/Icons";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 pb-10 pt-16 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-impact-creation.jpg"
              alt="Impact Création"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full bg-white object-contain ring-1 ring-white/20"
            />
            <div className="text-left">
              <p className="font-display text-lg font-bold uppercase tracking-widest">
                Impact <span className="text-orange-500">Création</span>
              </p>
              <p className="text-xs text-white/60">© {year}</p>
            </div>
          </div>

          <p className="text-sm uppercase tracking-widest text-orange-400">{t.footer.tagline}</p>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${"22774826486"}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#25D366]"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href="mailto:Kamparlembaouobalamourdjoadani@gmail.com"
              className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              {t.contact.email}
            </a>
          </div>

          <p className="text-xs text-white/40">{t.footer.madeIn}</p>
          <a
            href="/admin"
            className="text-[11px] uppercase tracking-widest text-white/25 transition-colors hover:text-orange-400"
          >
            {t.footer.admin}
          </a>
        </div>
      </div>
    </footer>
  );
}
