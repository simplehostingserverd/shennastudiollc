import type { Metadata } from "next"
import { CartProvider } from "@/app/context/CartContext"
import Navbar from "@/app/components/NavBar"
import Footer from "@/app/components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Shenna's Studio - Marine Life & Ocean-Inspired Products",
  description: "Discover beautiful ocean-themed products that celebrate marine life and support ocean conservation. A family business crafting treasures from sea turtle mugs to coral jewelry.",
  keywords: "ocean, marine, sea turtle, coral, jewelry, mugs, ocean conservation, nautical, beach, sea, family business, handcrafted",
  icons: {
    icon: '/ShennasLogo.ico',
    shortcut: '/ShennasLogo.ico',
    apple: '/ShennasLogo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
