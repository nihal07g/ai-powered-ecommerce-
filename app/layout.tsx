import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { CartProvider } from "@/context/cart-context"
import { Toaster } from "@/components/ui/toaster"
import ChatbotButton from "@/components/chatbot-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stampylotta - AI-Powered E-commerce",
  description: "An AI-powered e-commerce platform with product recommendations and smart search",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 md:py-8">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2025 Stampylotta. All rights reserved.
                  </p>
                </div>
              </footer>
              <ChatbotButton />
              <Toaster />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
