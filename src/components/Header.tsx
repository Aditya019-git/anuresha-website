import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 w-full z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/logo.png" alt="Anuresha Interiors Logo" width={400} height={120} className="h-32 w-auto object-contain drop-shadow-md cursor-pointer hover:opacity-90 transition-opacity" priority />
          </Link>
        </div>
        
        {/* Unified Floating Glass Nav */}
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
      </div>
    </header>
  );
}
