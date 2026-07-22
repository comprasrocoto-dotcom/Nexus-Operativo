import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nexus Operativo | Portal Corporativo",
  description: "Portal corporativo inteligente para la gestion del conocimiento de la empresa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable + " font-sans antialiased bg-background dark:bg-slate-950"}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen">
            <Sidebar />
            <div className="flex min-h-screen flex-col lg:pl-72">
              <Topbar />
              <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
