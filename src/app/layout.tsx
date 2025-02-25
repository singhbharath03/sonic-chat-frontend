import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/services/providers";
import { Sidebar } from "@/components/Sidebar";
import { PointsCard } from "@/components/PointsCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonic Chat",
  description: "Chat interface for Sonic Chain",
};

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
          <div className="flex h-screen overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-1/4 h-full border-r border-gray-200 bg-white shadow-sm flex flex-col">
              <div className="p-5 flex-grow overflow-y-auto">
                <Sidebar heading="Assets" />
              </div>
              <div className="p-5 border-t border-gray-200">
                <PointsCard />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-3/4 h-full flex flex-col">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}