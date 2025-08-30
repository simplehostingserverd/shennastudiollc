import Link from "next/link"
import { HeartIcon } from "@heroicons/react/24/solid"

export default function Footer() {
  return (
    <footer className="w-full ocean-gradient text-white mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-3xl animate-float">🐢</div>
              <span className="text-2xl font-display font-bold">Shenna's Studio</span>
            </div>
            <p className="text-ocean-100 max-w-md mb-6">
              A family business bringing the beauty and wonder of the ocean to your everyday life through 
              carefully curated products that celebrate marine life and conservation.
            </p>
            <div className="text-ocean-100 text-sm space-y-1">
              <p className="font-semibold">Visit Our Studio:</p>
              <p>2436 Pablo Kisel Boulevard</p>
              <p>Brownsville, Texas 78526</p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-ocean-200 hover:text-white transition-colors p-2 rounded-full hover:bg-ocean-700"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 8.025.044 6.979.207 5.934.37 5.226.586 4.61.922c-.631.335-1.166.78-1.5 1.5-.337.616-.553 1.325-.716 2.37C2.23 5.84 2.187 6.21 2.187 9.831c0 3.622.044 3.991.207 5.037.163 1.045.379 1.754.716 2.37.335.631.78 1.166 1.5 1.5.616.337 1.325.553 2.37.716 1.046.163 1.416.207 5.037.207 3.622 0 3.991-.044 5.037-.207 1.045-.163 1.754-.379 2.37-.716.631-.335 1.166-.78 1.5-1.5.337-.616.553-1.325.716-2.37.163-1.046.207-1.416.207-5.037 0-3.622-.044-3.991-.207-5.037-.163-1.045-.379-1.754-.716-2.37-.335-.631-.78-1.166-1.5-1.5-.616-.337-1.325-.553-2.37-.716C15.991.044 15.622 0 12.017 0zM12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-ocean-200 hover:text-white transition-colors p-2 rounded-full hover:bg-ocean-700"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-ocean-200 hover:text-white transition-colors p-2 rounded-full hover:bg-ocean-700"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4">Quick Links</h3>
            <ul className="space-y-2 text-ocean-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4">Customer Care</h3>
            <ul className="space-y-2 text-ocean-100">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ocean Conservation Message */}
        <div className="mt-12 pt-8 border-t border-ocean-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">🌊</span>
              <p className="text-ocean-100 text-sm">
                10% of all proceeds support ocean conservation efforts
              </p>
            </div>
            <div className="flex items-center space-x-1 text-ocean-100">
              <span className="text-sm">Made with</span>
              <HeartIcon className="h-4 w-4 text-coral-400" />
              <span className="text-sm">for our oceans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-ocean-900 border-t border-ocean-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-ocean-200">
            <p>© {new Date().getFullYear()} Shenna's Studio. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
