import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import {
  Inter,
  Libre_Baskerville,
  Playfair_Display,
  Roboto_Mono,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-display",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-readout",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  weight: ["400", "700"],
  variable: "--font-nav",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "La Puta Política",
  description:
    "La actualidad política argentina del día, clara, visual y sin vueltas.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "La Puta Política",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${playfairDisplay.variable} ${libreBaskerville.variable} ${inter.variable} ${spaceMono.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
