import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from '@/components/TopNavbar'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Momentum',
  description: 'Make progress, one day at a time.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
