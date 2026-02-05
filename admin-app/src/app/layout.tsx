import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MOON LOOP Reservation Admin",
  description: "Advanced Reservation Management System",
};

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-transparent">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1 text-primary" />
              <div className="mr-4 hidden md:flex h-5 w-[1px] bg-white/10" />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6 md:gap-8 md:p-10">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
