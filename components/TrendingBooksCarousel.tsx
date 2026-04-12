"use client";

import React, { useState } from "react";

const trendingBooks = [
  {
    id: 1,
    title: "The Midnight Echo",
    author: "Sarah J. Maas",
    match: 98,
    cover:
      "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&h=450&fit=crop",
  },
  {
    id: 2,
    title: "Quantum Skies",
    author: "Andy Weir",
    match: 95,
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop",
  },
  {
    id: 3,
    title: "City of Brass",
    author: "S.A. Chakraborty",
    match: 94,
    cover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop",
  },
  {
    id: 4,
    title: "Neural Weaver",
    author: "T.K. Miller",
    match: 91,
    cover:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
  },
  {
    id: 5,
    title: "Ocean's Song",
    author: "Lira Belacqua",
    match: 88,
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=450&fit=crop",
  },
  {
    id: 6,
    title: "The Silent Stars",
    author: "C.X. Wong",
    match: 85,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
  },
];

// Duplicate to create a seamless infinite loop
const carouselItems = [...trendingBooks, ...trendingBooks];

export default function TrendingBooksCarousel() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setStartX(e.pageX - dragOffset);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragOffset(e.pageX - startX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <section className="w-full border-t border-white/10 bg-background/80 backdrop-blur-md py-12 overflow-hidden select-none">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8 flex items-center gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Trending Discoveries
        </h3>
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.75rem)); } /* 0.75rem is exactly half the 1.5rem (gap-6) to ensure a seamless loop */
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .carousel-wrapper:hover .animate-marquee,
        .carousel-wrapper:active .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* Carousel Track */}
      <div
        className="carousel-wrapper relative w-full cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          style={{ transform: `translateX(${dragOffset}px)` }}
          className="transition-transform ease-out duration-75"
        >
          <div className="flex gap-6 animate-marquee w-max px-6">
            {carouselItems.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="group relative flex-shrink-0 w-36 sm:w-44 transition-all duration-300 hover:-translate-y-3"
              >
                {/* Glow Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] z-10 pointer-events-none" />

                {/* Book Cover */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-card border border-white/5">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Match Percentage Badge */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-primary border border-white/10 shadow-sm">
                    {book.match}% Match
                  </div>
                </div>

                {/* Book Info */}
                <div className="mt-4 px-1">
                  <h4 className="text-sm font-bold line-clamp-1 text-foreground">
                    {book.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}