import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Provider";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";;
import NavbarServer from "@/components/ServeNav";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "scrum-app",
  description: "scrum-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
        <ThemeProvider
         attribute="class"
         defaultTheme="dark"
         enableSystem
         >
          <NavbarServer />
          <main className="min-h-screen"> 
            {children}</main>
          <div className="container mx-auto">
          <Footer />
          </div>
        </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
