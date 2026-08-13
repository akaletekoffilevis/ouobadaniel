"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Lang } from "@/lib/types";

const fr = {
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    training: "Formations",
    portfolio: "Portfolio",
    contact: "Contact",
  },
  hero: {
    eyebrow: "Impact Création",
    name: "Ouoba Lamourdjoa Daniel",
    title: "Graphiste · Designer · Formateur en infographie",
    tagline:
      "Je conçois des identités visuelles, affiches publicitaires, flyers et cartes de mariage, et je forme aux outils de l'infographie.",
    ctaPortfolio: "Voir mes créations",
    ctaContact: "Me contacter",
    based: "Basé à Niamey, Niger",
  },
  about: {
    title: "À propos",
    name: "Ouoba Lamourdjoa Daniel",
    lede:
      "Graphiste designer et formateur en infographie, fondateur d'Impact Création.",
    bio1:
      "Je suis passionné par la création visuelle : logos, affiches publicitaires, flyers, cartes de mariage et identités de marque. À travers Impact Création, j'accompagne particuliers et entreprises pour donner vie à leurs idées.",
    bio2:
      "Parallèlement, je transmets mon savoir en formation : infographie (Photoshop, Illustrator, Canva) et bureautique (Word, Excel, PowerPoint, Publisher), du niveau débutant à intermédiaire.",
    experienceTitle: "Expériences",
    experiences: [
      { period: "2021 – 2024", label: "Maçonnerie" },
      { period: "2024 – 2025", label: "Peinture & décoration" },
      { period: "2025 – 2026", label: "Sérigraphie & personnalisation de vêtements" },
    ],
    stats: {
      works: "Créations",
      software: "Logiciels maîtrisés",
      training: "Formations proposées",
    },
    downloadCv: "Télécharger le CV",
  },
  services: {
    title: "Services",
    subtitle:
      "Des prestations créatives complètes, de la conception à la mise en place.",
    items: [
      {
        icon: "pen",
        title: "Graphisme & Design",
        desc: "Logos, identités visuelles et chartes graphiques sur mesure.",
      },
      {
        icon: "poster",
        title: "Affiches publicitaires",
        desc: "Des visuels percutants pour vos campagnes et événements.",
      },
      {
        icon: "flyer",
        title: "Flyers & dépliants",
        desc: "Supports imprimables ou digitaux, prêts à diffuser.",
      },
      {
        icon: "invite",
        title: "Cartes de mariage",
        desc: "Faire-part et cartes élégants pour vos grands événements.",
      },
      {
        icon: "teach",
        title: "Formation en infographie",
        desc: "Cours pratiques : Adobe Photoshop, Illustrator, Canva.",
      },
      {
        icon: "office",
        title: "Formation en informatique",
        desc: "Word, Excel, PowerPoint, Publisher — du débutant à l'intermédiaire.",
      },
      {
        icon: "install",
        title: "Installation de logiciels",
        desc: "Photoshop, suites Office et autres outils installés et configurés.",
      },
      {
        icon: "type",
        title: "Secrétariat",
        desc: "Documents, tableaux, présentations et suivi administratif.",
      },
      {
        icon: "shirt",
        title: "Sérigraphie & personnalisation",
        desc: "Personnalisation de vêtements et impressions sur mesure.",
      },
    ],
  },
  training: {
    title: "Formations & Cours",
    subtitle:
      "Des formations pratiques et accessibles, en présentiel à Niamey ou en ligne.",
    courses: [
      {
        title: "Initiation à l'infographie",
        desc: "Les bases de la création graphique : composition, couleurs, typographie.",
        tools: ["Photoshop", "Illustrator", "Canva"],
        level: "Débutant",
      },
      {
        title: "Photoshop & Illustrator",
        desc: "Création d'affiches, retouche photo, vectorisation et mise en page.",
        tools: ["Photoshop", "Illustrator"],
        level: "Débutant → Intermédiaire",
      },
      {
        title: "Bureautique & Secrétariat",
        desc: "Word, Excel, PowerPoint et Publisher pour le travail de bureau.",
        tools: ["Word", "Excel", "PowerPoint", "Publisher"],
        level: "Intermédiaire",
      },
      {
        title: "Création de designs avec Canva",
        desc: "Flyers, posts réseaux sociaux et visuels professionnels sans complexité.",
        tools: ["Canva"],
        level: "Débutant",
      },
    ],
    noteTitle: "Organisation",
    note:
      "Cours individuels ou en petits groupes. Durée et rythme adaptés à vos objectifs. Contactez-moi pour planifier votre première session.",
    cta: "Réserver une session",
  },
  portfolio: {
    title: "Mes créations",
    subtitle: "Un aperçu de mes réalisations. Mise à jour régulière.",
    all: "Tous",
    empty: "Aucune création pour le moment.",
    loading: "Chargement des créations…",
    loadError: "Impossible de charger les créations. Réessayez.",
  },
  contact: {
    title: "Contactez-moi",
    subtitle:
      "Une idée, un projet ou envie de vous former ? Écrivez-moi, je réponds rapidement.",
    whatsapp: "WhatsApp",
    phone: "Appeler",
    email: "Email",
    location: "Localisation",
    formTitle: "Message rapide",
    formName: "Votre nom",
    formMessage: "Votre message",
    formSend: "Envoyer via WhatsApp",
    formHint: "Ce formulaire ouvre WhatsApp avec votre message pré-rempli.",
  },
  footer: {
    tagline: "Graphiste · Designer · Formateur en infographie",
    madeIn: "Conçu avec passion à Niamey, Niger.",
    admin: "Espace admin",
  },
  common: {
    downloadCv: "Télécharger le CV",
  },
};

const en: typeof fr = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    training: "Training",
    portfolio: "Portfolio",
    contact: "Contact",
  },
  hero: {
    eyebrow: "Impact Création",
    name: "Ouoba Lamourdjoa Daniel",
    title: "Graphic Designer · Designer · Infographics Trainer",
    tagline:
      "I craft visual identities, posters, flyers and wedding invitations, and I teach infographics tools.",
    ctaPortfolio: "See my work",
    ctaContact: "Contact me",
    based: "Based in Niamey, Niger",
  },
  about: {
    title: "About",
    name: "Ouoba Lamourdjoa Daniel",
    lede: "Graphic designer and infographics trainer, founder of Impact Création.",
    bio1:
      "I am passionate about visual creation: logos, posters, flyers, wedding invitations and brand identities. Through Impact Création, I help individuals and businesses bring their ideas to life.",
    bio2:
      "I also share my skills through training: infographics (Photoshop, Illustrator, Canva) and office tools (Word, Excel, PowerPoint, Publisher), from beginner to intermediate level.",
    experienceTitle: "Experience",
    experiences: [
      { period: "2021 – 2024", label: "Bricklaying" },
      { period: "2024 – 2025", label: "Painting & decoration" },
      { period: "2025 – 2026", label: "Screen printing & clothing customization" },
    ],
    stats: {
      works: "Creations",
      software: "Software mastered",
      training: "Courses offered",
    },
    downloadCv: "Download CV",
  },
  services: {
    title: "Services",
    subtitle:
      "Complete creative services, from concept to delivery.",
    items: [
      {
        icon: "pen",
        title: "Graphic Design",
        desc: "Custom logos, visual identities and brand guidelines.",
      },
      {
        icon: "poster",
        title: "Advertising posters",
        desc: "Impactful visuals for your campaigns and events.",
      },
      {
        icon: "flyer",
        title: "Flyers & leaflets",
        desc: "Print or digital materials, ready to share.",
      },
      {
        icon: "invite",
        title: "Wedding invitations",
        desc: "Elegant invitations for your special events.",
      },
      {
        icon: "teach",
        title: "Infographics training",
        desc: "Hands-on courses: Adobe Photoshop, Illustrator, Canva.",
      },
      {
        icon: "office",
        title: "Computer training",
        desc: "Word, Excel, PowerPoint, Publisher — beginner to intermediate.",
      },
      {
        icon: "install",
        title: "Software installation",
        desc: "Photoshop, Office suites and other tools installed and configured.",
      },
      {
        icon: "type",
        title: "Secretarial services",
        desc: "Documents, spreadsheets, presentations and admin follow-up.",
      },
      {
        icon: "shirt",
        title: "Screen printing & customization",
        desc: "Clothing customization and custom printing.",
      },
    ],
  },
  training: {
    title: "Training & Courses",
    subtitle:
      "Practical, accessible training, in person in Niamey or online.",
    courses: [
      {
        title: "Infographics fundamentals",
        desc: "Basics of visual creation: composition, colors, typography.",
        tools: ["Photoshop", "Illustrator", "Canva"],
        level: "Beginner",
      },
      {
        title: "Photoshop & Illustrator",
        desc: "Posters, photo retouching, vector drawing and layout.",
        tools: ["Photoshop", "Illustrator"],
        level: "Beginner → Intermediate",
      },
      {
        title: "Office & Secretarial",
        desc: "Word, Excel, PowerPoint and Publisher for office work.",
        tools: ["Word", "Excel", "PowerPoint", "Publisher"],
        level: "Intermediate",
      },
      {
        title: "Design with Canva",
        desc: "Flyers, social media posts and professional visuals made easy.",
        tools: ["Canva"],
        level: "Beginner",
      },
    ],
    noteTitle: "Organization",
    note:
      "One-on-one lessons or small groups. Duration and pace adapted to your goals. Contact me to plan your first session.",
    cta: "Book a session",
  },
  portfolio: {
    title: "My work",
    subtitle: "A preview of my creations. Regularly updated.",
    all: "All",
    empty: "No creations yet.",
    loading: "Loading creations…",
    loadError: "Could not load creations. Please retry.",
  },
  contact: {
    title: "Contact me",
    subtitle:
      "An idea, a project or want to get trained? Message me, I reply quickly.",
    whatsapp: "WhatsApp",
    phone: "Call",
    email: "Email",
    location: "Location",
    formTitle: "Quick message",
    formName: "Your name",
    formMessage: "Your message",
    formSend: "Send via WhatsApp",
    formHint: "This form opens WhatsApp with your message pre-filled.",
  },
  footer: {
    tagline: "Graphic Designer · Designer · Infographics Trainer",
    madeIn: "Crafted with passion in Niamey, Niger.",
    admin: "Admin area",
  },
  common: {
    downloadCv: "Download CV",
  },
};

const dictionaries: Record<Lang, typeof fr> = { fr, en };

type I18nContextValue = {
  lang: Lang;
  t: typeof fr;
  setLang: (l: Lang) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture localStorage après hydratation (évite le mismatch SSR)
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
