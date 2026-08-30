import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ouoops.com"),
  title: "OUOOPS | Unique Old Stuff",
  description: "A lifetime collection of unique old stuff, related finds, and computers looking for one more good home.",
  openGraph: {
    title: "OUOOPS | Unique Old Stuff",
    description: "Old things, good stories, and one more home.",
    type: "website",
    images: [{ url: "/og.png", width: 1748, height: 909, alt: "OUOOPS — Old things. Good stories. One more home." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OUOOPS | Unique Old Stuff",
    description: "Old things, good stories, and one more home.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
