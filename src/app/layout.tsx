import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import BackToTop from "@/components/shared/BackToTop";
import Providers from "@/components/Providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MESKLEY LOCATION — Immobilier de Standing à Montréal",
    template: "%s | MESKLEY LOCATION",
  },
  description:
    "Trouvez votre logement de standing à Montréal. Appartements, condos et studios haut de gamme. Service personnalisé et accompagnement complet.",
  keywords: [
    "location",
    "immobilier",
    "Montréal",
    "Canada",
    "Québec",
    "appartement",
    "condo",
    "studio",
    "MESKLEY",
  ],
  metadataBase: new URL("https://meskley-location.com"),
  openGraph: {
    title: "MESKLEY LOCATION — Immobilier de Standing à Montréal",
    description:
      "Trouvez votre logement de standing à Montréal. Appartements, condos et studios haut de gamme.",
    type: "website",
    locale: "fr_CA",
    siteName: "MESKLEY LOCATION",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
