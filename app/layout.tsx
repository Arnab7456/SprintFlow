import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Provider";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";;
import NavbarServer from "@/components/ServeNav";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";
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
    <ClerkProvider
           appearance={{
            baseTheme: shadesOfPurple,
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#1a202c",
              colorInputBackground: "#2D3748",
              colorInputText: "#F3F4F6",
            },
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
              card: "bg-gray-800",
              headerTitle: "text-blue-400",
              headerSubtitle: "text-gray-400",
            },
          }}
        
        >
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <ThemeProvider
         attribute="class"
         defaultTheme="dark"
         enableSystem
         >
          <NavbarServer />
          <main className="min-h-screen"> 
            {children}</main>
            <Toaster richColors />
          <div className="container mx-auto">
          <Footer />
          </div>
        </ThemeProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}
