import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { APIConfigProvider } from "@/context/APIConfigContext";
import { HistoryPanelProvider } from '@/context/HistoryPanelContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KTranslate",
  description: "Fast and accurate translations for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <APIConfigProvider>
            <HistoryPanelProvider>
              {children}
            </HistoryPanelProvider>
          </APIConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
