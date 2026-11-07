import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SAM CODES // Engineering & AI Systems",
  description:
    "Production platform showcasing high-performance AI engines, autonomous agents, WebGL 3D graphics, and modern software architectures.",
  metadataBase: new URL("https://sam-codes.vercel.app"),
  openGraph: {
    title: "SAM CODES // Engineering & AI Systems",
    description: "Production platform showcasing high-performance AI engines and WebGL 3D graphics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-[#101216] text-[#E8EAF0] antialiased selection:bg-[#4D7CFE]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
