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
          <Link href="/" className="flex items-center gap-3 md:gap-4 group cursor-pointer">
            {/* Borderless Transparent Ganesha Emblem Icon */}
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/images/logo_icon_transparent.png" 
                alt="Anuresha Interior Icon" 
                fill
                unoptimized={true}
                className="object-contain drop-shadow-[0_4px_16px_rgba(249,115,22,0.5)]" 
                priority 
              />
            </div>
            
            {/* Brand Name Typography - Red ANURESHA, Orange INTERIOR, Ultra-Bright White PRIVATE LIMITED */}
            <div className="flex flex-col justify-center select-none">
              <span className="font-outfit font-black text-2xl sm:text-3xl md:text-4xl tracking-tight uppercase leading-none text-red-600 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                ANURESHA
              </span>
              <span className="font-outfit font-extrabold text-xs sm:text-base md:text-lg tracking-wider uppercase leading-tight text-orange-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-0.5">
                INTERIOR
              </span>
              <span className="font-outfit font-black text-[9px] sm:text-xs md:text-sm tracking-[0.25em] uppercase leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)] mt-1">
                PRIVATE LIMITED
              </span>
            </div>
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
