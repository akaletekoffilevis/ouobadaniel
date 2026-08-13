import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0a1128",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "graphiste",
    "designer",
    "infographie",
    "formation",
    "Niger",
    "Niamey",
    "logo",
    "affiche",
    "flyer",
    "carte de mariage",
    "Impact Création",
    "graphic designer Niger",
    "webdesigner",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: "Ouoba Lamourdjoa Daniel", url: SITE_URL }],
  creator: "Ouoba Lamourdjoa Daniel",
  publisher: SITE_NAME,
  category: "Portfolio",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ouoba Lamourdjoa Daniel — Impact Création",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/apple-touch-icon.png",
    shortcut: "/apple-touch-icon.png",
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ouoba Lamourdjoa Daniel",
  givenName: "Lamourdjoa Daniel",
  familyName: "Ouoba",
  jobTitle: "Graphiste · Designer · Formateur en infographie",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/photo-daniel-1.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Niamey",
    addressCountry: "NE",
  },
  worksFor: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-impact-creation.jpg`,
  },
  knowsAbout: [
    "Graphisme",
    "Design",
    "Infographie",
    "Logos",
    "Affiches publicitaires",
    "Flyers",
    "Cartes de mariage",
    "Formation Photoshop",
    "Formation Illustrator",
    "Formation Canva",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
