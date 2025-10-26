'use client'

import Link from 'next/link'
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Button from './ui/Button'
import { useCart } from '@/app/context/CartContext'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full glass-effect border-b border-ocean-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/ShennasLogo.png"
              alt="Shenna's Studio Logo"
              width={150}
              height={150}
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              style={{ width: 'auto', height: '2.5rem' }}
            />
            <span className="text-xl font-display font-bold text-white">
              Shenna&apos;s Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium"
            >
              Products
            </Link>

            {/* Custom Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCustomDropdownOpen(true)}
              onMouseLeave={() => setIsCustomDropdownOpen(false)}
            >
              <button className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium flex items-center">
                Custom
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCustomDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-ocean-200 py-2">
                    <Link
                      href="/custom-design"
                      className="block px-4 py-3 text-ocean-700 hover:bg-ocean-50 hover:text-ocean-900 transition-colors"
                    >
                      <div className="font-semibold">Jewelry Design</div>
                      <div className="text-sm text-ocean-500">Bracelets & Necklaces</div>
                    </Link>
                    <Link
                      href="/custom-tshirt"
                      className="block px-4 py-3 text-ocean-700 hover:bg-ocean-50 hover:text-ocean-900 transition-colors"
                    >
                      <div className="font-semibold">T-Shirt Design</div>
                      <div className="text-sm text-ocean-500">Upload Your Design</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-ocean-600 hover:text-ocean-800 transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Cart Icon with Badge */}
            <Link href="/cart" className="relative group">
              <div className="p-2 text-ocean-600 hover:text-ocean-800 transition-colors group-hover:scale-105">
                <ShoppingCartIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* CTA Button */}
            <Link href="/products">
              <Button
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Shop Now
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-ocean-600 hover:text-ocean-800 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-ocean-200/20 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {/* Mobile Custom Submenu */}
              <div className="py-2">
                <div className="text-ocean-700 font-semibold mb-2">Custom</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/custom-design"
                    className="block text-ocean-600 hover:text-ocean-900 transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Jewelry Design
                  </Link>
                  <Link
                    href="/custom-tshirt"
                    className="block text-ocean-600 hover:text-ocean-900 transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    T-Shirt Design
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-ocean-700 hover:text-ocean-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link href="/products">
                <Button variant="primary" size="sm" className="w-full mt-4">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
