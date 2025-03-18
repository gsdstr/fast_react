import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Events Manager",
  description: "A modern events management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-gray-600 font-medium"
                  >
                    Events List
                  </Link>
                  <Link
                    href="/calendar"
                    className="text-gray-800 hover:text-gray-600 font-medium"
                  >
                    Calendar
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <div className="container mx-auto py-8 px-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
