'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/services/providers";
import { Sidebar } from "@/components/Sidebar";
import { PointsCard } from "@/components/PointsCard";
import { usePrivy } from '@privy-io/react-auth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Layout({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <div className="flex h-screen overflow-hidden">
      {authenticated && (
        <div className="w-1/4 h-full border-r border-gray-200 bg-white shadow-sm flex flex-col">
          <div className="p-5 flex-grow overflow-y-auto">
            <Sidebar heading="Assets" />
          </div>
          <div className="p-5 border-t border-gray-200">
            <PointsCard />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={authenticated ? "w-3/4 h-full flex flex-col" : "w-full h-full flex flex-col"}>
        {children}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}