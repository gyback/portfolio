import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { SiteHeader } from "~/components/site/site-header";
import { site } from "~/site";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
