import type { Metadata } from "next";
import { Caveat, Geist_Mono, Poppins, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["700", "800"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Desktop",
  description: "A cozy retro macOS-inspired desktop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${pressStart.variable} ${caveat.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
