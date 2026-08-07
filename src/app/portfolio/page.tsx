"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getPortfolioItems } from "../actions";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  cover_image: string;
  pre_execution_images: string[];
  post_execution_images: string[];
  client_review: string;
  client_rating: number;
};

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox Modal State
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      const res = await getPortfolioItems();
      if (res.success && res.data) {
        setPortfolioItems(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Helper to compile all photos of a project into one list with no duplicates
  const getAllProjectPhotos = useCallback((item: PortfolioItem): string[] => {
    const photos: string[] = [];
    if (item.cover_image) photos.push(item.cover_image);
    if (item.post_execution_images && item.post_execution_images.length > 0) {
      item.post_execution_images.forEach(img => {
        if (!photos.includes(img)) photos.push(img);
      });
    }
    if (item.pre_execution_images && item.pre_execution_images.length > 0) {
      item.pre_execution_images.forEach(img => {
        if (!photos.includes(img)) photos.push(img);
      });
    }
    return photos;
  }, []);

  const openLightbox = (item: PortfolioItem, photoUrl?: string) => {
    const allPhotos = getAllProjectPhotos(item);
    let initialIndex = 0;
    if (photoUrl) {
      const foundIdx = allPhotos.indexOf(photoUrl);
      if (foundIdx !== -1) initialIndex = foundIdx;
    }
    setActiveProject(item);
    setActiveImageIndex(initialIndex);
  };

  const closeLightbox = () => {
    setActiveProject(null);
    setActiveImageIndex(0);
  };

  const prevImage = useCallback(() => {
    if (!activeProject) return;
    const photos = getAllProjectPhotos(activeProject);
    setActiveImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [activeProject, getAllProjectPhotos]);

  const nextImage = useCallback(() => {
    if (!activeProject) return;
    const photos = getAllProjectPhotos(activeProject);
    setActiveImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [activeProject, getAllProjectPhotos]);

  // Keyboard Navigation (Escape, Left Arrow, Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject, prevImage, nextImage]);

  const activePhotos = activeProject ? getAllProjectPhotos(activeProject) : [];
  const currentPhotoUrl = activePhotos[activeImageIndex] || activeProject?.cover_image || "/images/about_bg.png";

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-stone-50">
      <div className="bg-stone-900 pb-8">
        <Header />
        <div className="pt-40 pb-12 container mx-auto px-6 text-center">
          <h1 className="font-outfit text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-amber-500">Portfolio</span>
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            A comprehensive look at our recent transformations across residential, commercial, and industrial spaces. Click any project to view full-size photos.
          </p>
        </div>
      </div>

      <section className="py-24 bg-white flex-1">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-stone-500 font-medium">Loading portfolio...</p>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p>No projects found in the portfolio yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col group hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  onClick={() => openLightbox(item)}
                >
                  
                  {/* Cover Image - compact height with zoom icon overlay */}
                  <div className="relative h-56 w-full bg-stone-200 overflow-hidden shrink-0">
                    <Image 
                      src={item.cover_image || '/images/about_bg.png'} 
                      alt={item.title} 
                      fill 
                      unoptimized={true} 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10">
                      <span className="text-amber-600 font-bold text-[10px] uppercase tracking-wider">{item.category}</span>
                    </div>

                    {/* Hover Zoom Prompt */}
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
                      <ZoomIn className="w-5 h-5 text-amber-400" />
                      <span>Click to View Full Size</span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-outfit text-stone-900 text-lg font-bold mb-2 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                    
                    {item.client_review && (
                      <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-1">{item.client_review}</p>
                    )}

                    {/* Thumbnail strip */}
                    {item.post_execution_images && item.post_execution_images.length > 0 && (
                      <div className="flex gap-1.5 mt-4 pt-3 border-t border-stone-100" onClick={(e) => e.stopPropagation()}>
                        {item.post_execution_images.slice(0, 4).map((url, i) => (
                          <div 
                            key={i} 
                            onClick={() => openLightbox(item, url)}
                            className="relative h-10 w-12 rounded overflow-hidden shrink-0 border border-stone-200 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer shadow-sm"
                          >
                            <Image src={url} alt={`Photo ${i + 1}`} fill unoptimized={true} className="object-cover" />
                          </div>
                        ))}
                        {item.post_execution_images.length > 4 && (
                          <div 
                            onClick={() => openLightbox(item, item.post_execution_images[4])}
                            className="h-10 w-12 rounded bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer"
                          >
                            <span className="text-stone-600 text-[10px] font-bold">+{item.post_execution_images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeProject && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Lightbox Header */}
          <div className="p-4 md:px-8 flex justify-between items-center text-white border-b border-stone-800/60 bg-stone-900/60 shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                  {activeProject.category}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Photo {activeImageIndex + 1} of {activePhotos.length}
                </span>
              </div>
              <h2 className="font-outfit text-xl md:text-2xl font-bold text-white mt-1">{activeProject.title}</h2>
            </div>
            
            <button 
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-stone-800/80 hover:bg-amber-600 text-stone-300 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Viewer Stage */}
          <div className="relative flex-1 flex items-center justify-center p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
            {/* Previous Button */}
            {activePhotos.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-amber-600 text-white transition-all hover:scale-110 shadow-2xl border border-stone-700"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* High-Res Main Image */}
            <div className="relative w-full h-full max-h-[75vh] max-w-5xl flex items-center justify-center">
              <Image 
                src={currentPhotoUrl} 
                alt={activeProject.title} 
                fill 
                unoptimized={true} 
                className="object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
              />
            </div>

            {/* Next Button */}
            {activePhotos.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-amber-600 text-white transition-all hover:scale-110 shadow-2xl border border-stone-700"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Lightbox Footer & Thumbnail Bar */}
          <div className="p-4 md:px-8 bg-stone-900/80 border-t border-stone-800/60 shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
            {activeProject.client_review && (
              <p className="text-stone-300 text-sm max-w-3xl mx-auto text-center mb-3 line-clamp-2">
                {activeProject.client_review}
              </p>
            )}
            
            {/* Horizontal Thumbnail Slider */}
            {activePhotos.length > 1 && (
              <div className="flex gap-2 justify-center overflow-x-auto max-w-2xl mx-auto py-1 px-2">
                {activePhotos.map((url, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-12 w-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                      index === activeImageIndex 
                        ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/30 opacity-100' 
                        : 'border-stone-700 opacity-50 hover:opacity-100 hover:border-stone-400'
                    }`}
                  >
                    <Image src={url} alt={`Thumbnail ${index + 1}`} fill unoptimized={true} className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
