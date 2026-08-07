"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 w-full z-50 py-4 md:py-6">
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/images/logo.png" 
              alt="Anuresha Interiors Logo" 
              width={300} 
              height={90} 
              unoptimized={true}
              className="h-14 sm:h-16 md:h-28 w-auto min-w-[150px] sm:min-w-[180px] object-contain drop-shadow-md cursor-pointer hover:opacity-90 transition-opacity shrink-0" 
              priority 
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center p-1.5 bg-stone-900/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
          <Link href="/#services" className="px-6 py-2.5 text-stone-200 hover:text-white hover:bg-white/10 rounded-full font-medium text-sm transition-all tracking-wide">
            Services
          </Link>
          <Link href="/portfolio" className="px-6 py-2.5 text-stone-200 hover:text-white hover:bg-white/10 rounded-full font-medium text-sm transition-all tracking-wide">
            Portfolio
          </Link>
          <Link href="/#about" className="px-6 py-2.5 text-stone-200 hover:text-white hover:bg-white/10 rounded-full font-medium text-sm transition-all tracking-wide">
            About Us
          </Link>
          <Link href="/#contact" className="ml-2 px-7 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-amber-600/30">
            Contact Us
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-3 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 hover:text-white border border-white/10 shadow-lg"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-Down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-24 z-50 bg-stone-900/95 backdrop-blur-xl border border-stone-800 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3">
            <Link 
              href="/#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-3 text-stone-200 hover:text-white hover:bg-stone-800/80 rounded-2xl font-medium text-base transition-all"
            >
              Services
            </Link>
            <Link 
              href="/portfolio" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-3 text-stone-200 hover:text-white hover:bg-stone-800/80 rounded-2xl font-medium text-base transition-all flex items-center justify-between"
            >
              <span>Portfolio</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">Work Gallery</span>
            </Link>
            <Link 
              href="/#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-3 text-stone-200 hover:text-white hover:bg-stone-800/80 rounded-2xl font-medium text-base transition-all"
            >
              About Us
            </Link>
            <Link 
              href="/#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-5 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-center text-base shadow-lg transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
