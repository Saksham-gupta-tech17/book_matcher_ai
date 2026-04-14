"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ChevronRight, BookOpen, TrendingUp, Star } from "lucide-react";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    
    // Call parent's search handler if provided
    if (onSearch) {
      onSearch(query);
    }
    
    // Reset loading state after a delay (parent should handle actual loading)
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const placeholderExamples = [
    "I loved Harry Potter and want similar fantasy",
    "Suggest sci‑fi books with strong female leads",
    "Books that feel like a warm hug",
    "Thrilling mystery novels with plot twists",
    "Philosophical fiction about meaning of life",
  ];
  const [exampleIndex] = useState(0);

  return (
    <section className="relative overflow-hidden px-6 py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="relative h-16 w-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-4 border-t-primary border-transparent"
              />
              <BookOpen className="absolute inset-0 m-auto h-6 w-6 text-primary" />
            </div>
            <p className="text-lg font-medium">Finding your perfect reads...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Scanning thousands of books for matches
            </p>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/50 px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Powered by AI • 10,000+ books curated
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Discover Your Next{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Favorite Book
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Tell us what you love—or what mood you’re in—and our AI will
            recommend perfectly matched books. No endless scrolling, just
            hand‑picked reads.
          </p>

          {/* Smart input */}
          <motion.form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholderExamples[exampleIndex]}
                className="w-full rounded-2xl border border-white/10 bg-card/80 py-5 pl-12 pr-40 text-lg backdrop-blur-lg placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-70 transition-all"
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      Explore
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Personalized matches</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trending picks</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Community rated</span>
              </div>
            </div>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "50K+", label: "Books in database" },
              { value: "98%", label: "User satisfaction" },
              { value: "2.1M", label: "Recommendations made" },
              { value: "24/7", label: "AI available" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}