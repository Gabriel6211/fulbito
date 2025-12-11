import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "tubilletera | Home",
};

// styles & fonts
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/global.scss";
import "@/styles/colors.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import TopBar from "@/components/Basic/TopBar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeCookie = (await cookies()).get("theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;
  const initialTheme = theme as "dark" | "light" | undefined;

  return (
    <html lang="en" className={theme}>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TopBar initialTheme={initialTheme} />
        {children}
      </body>
    </html>
  );
}
