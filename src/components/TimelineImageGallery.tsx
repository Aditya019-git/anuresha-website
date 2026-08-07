"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function TimelineImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  
  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <>
      {/* Grid View */}
      <div className={`mt-4 grid gap-2 ${images.length > 1 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {images.map((img: string, i: number) => (
          <div 
            key={i} 
            onClick={() => openLightbox(i)}
            className={`relative rounded-xl overflow-hidden shadow-sm group cursor-pointer ${images.length === 1 ? 'h-48 sm:h-64' : 'h-32 sm:h-40'}`}
          >
            <Image 
              src={img} 
              alt={`Site Update ${i + 1}`} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
              unoptimized
            />
            {i === 0 && (
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center gap-1.5 z-10">
                <Camera className="w-3.5 h-3.5" />
                {images.length > 1 ? `${images.length} Photos` : 'Site Photo'}
              </div>
            )}
            
            {/* Hover overlay for affordance */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows (if multiple images) */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all"
                onClick={showPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all"
                onClick={showNext}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center pointer-events-none">
            <Image 
              src={images[selectedIndex]} 
              alt={`Fullscreen Site Update ${selectedIndex + 1}`} 
              fill 
              className="object-contain pointer-events-auto drop-shadow-2xl" 
              unoptimized
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
