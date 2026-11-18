import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccountProvider } from "@/components/auth/AccountProvider";
import { AuthTimeoutHandler } from "@/components/auth/AuthTimeoutHandler";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mridanga Rhythm Library",
  description: "A complete library of Mridanga rhythms and mantras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AccountProvider>
          <AuthTimeoutHandler />
          {children}
          <Toaster />
        </AccountProvider>
      </body>
    </html>
  );
}
