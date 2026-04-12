"use client";

import { useState, useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import BookGrid from "@/components/BookGrid";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp, Users, ChevronUp } from "lucide-react";

// Mock data for initial display
const initialBooks = [
  {
    id: "1",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A lone astronaut must save humanity from an extinction-level event using only his wits and science.",
    genre: "Science Fiction",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    pages: 476,
    year: 2021,
  },
  {
    id: "2",
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library where every book provides a chance to try another life.",
    genre: "Fantasy",
    rating: 4.3,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pages: 304,
    year: 2020,
  },
  {
    id: "3",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description: "An AI friend observes human behavior and searches for meaning in a changing world.",
    genre: "Literary Fiction",
    rating: 4.2,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    pages: 320,
    year: 2021,
  },
  {
    id: "4",
    title: "Dune",
    author: "Frank Herbert",
    description: "Epic tale of politics, religion, and power on the desert planet of Arrakis.",
    genre: "Science Fiction",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    pages: 412,
    year: 1965,
  },
  {
    id: "5",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman who shoots her husband and then stops speaking.",
    genre: "Thriller",
    rating: 4.5,
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    pages: 336,
    year: 2019,
  },
  {
    id: "6",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "A coming-of-age murder mystery set in the marshes of North Carolina.",
    genre: "Mystery",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    pages: 384,
    year: 2018,
  },
  {
    id: "7",
    title: "Atomic Habits",
    author: "James Clear",
    description: "A guide to building good habits and breaking bad ones with tiny changes.",
    genre: "Self-Help",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    pages: 320,
    year: 2018,
  },
  {
    id: "8",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description: "A legendary film star reveals the truth behind her glamorous life and seven marriages.",
    genre: "Historical Fiction",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
    pages: 389,
    year: 2017,
  },
  {
    id: "9",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "Bilbo Baggins embarks on an unexpected adventure with a group of dwarves to reclaim their mountain home.",
    genre: "Fantasy",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    pages: 310,
    year: 1937,
  },
  {
    id: "10",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel about totalitarianism, mass surveillance, and repressive regimentation.",
    genre: "Dystopian",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    pages: 328,
    year: 1949,
  },
  {
    id: "11",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.",
    genre: "Classic",
    rating: 4.5,
    cover: "https://images.unsplash.com/photo-1544716278-e41617661cd1?w=400&h=600&fit=crop",
    pages: 432,
    year: 1813,
  },
  {
    id: "12",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical book that follows a young Andalusian shepherd on his journey to the pyramids of Egypt.",
    genre: "Philosophical Fiction",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pages: 208,
    year: 1988,
  },
];

export default function Home() {
  const [recommendations, setRecommendations] = useState(initialBooks);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiSummary, setApiSummary] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("mock");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when recommendations change
  useEffect(() => {
    if (hasSearched && !loading && resultsRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [recommendations, hasSearched, loading]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch recommendations from API
  const fetchRecommendations = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    setError(null);
    setApiSummary("");
    setDataSource("mock");
    
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.books) {
        setRecommendations(data.books);
        setApiSummary(data.summary || "");
        setDataSource(data.source || "mock");
        
        // Show warning if API returned a warning
        if (data.warning) {
          console.warn("API warning:", data.warning);
        }
      } else {
        throw new Error("No books data received from API");
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch recommendations. Please try again.");
      // Keep previous recommendations on error
    } finally {
      setLoading(false);
    }
  };

  // Handle search from Hero component
  const handleSearch = (query: string) => {
    if (query.trim()) {
      fetchRecommendations(query);
    }
  };

  // Example features
  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI‑Powered Matching",
      description: "Our algorithm learns your taste and suggests books you'll love.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Personalized Library",
      description: "Save favorites, track reading progress, and get reminders.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Trending & Popular",
      description: "Discover what's hot in the reading community right now.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Reviews",
      description: "See what other readers think before you dive in.",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col" ref={heroRef}>
      <Hero onSearch={handleSearch} />

      {/* Features section - reduced spacing */}
      <section className="px-6 py-12 md:py-16 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Why Readers Love{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                BookMatch AI
              </span>
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-3xl mx-auto">
              We combine cutting‑edge AI with deep literary knowledge to
              deliver recommendations that feel human‑curated.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {feat.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations section - with ref for auto-scroll */}
      <section id="results-section" ref={resultsRef} className="px-6 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-20"
              >
                <LoadingSpinner message="Finding your perfect reads..." />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold md:text-4xl">
                    {hasSearched
                      ? "Your Personalized Recommendations"
                      : "Curated Picks You Might Love"}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    {hasSearched
                      ? "Based on your search, here are hand‑picked books that match your taste."
                      : "Explore these popular titles to get started."}
                  </p>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center"
                  >
                    <div className="text-red-400 font-medium">Error: {error}</div>
                    <p className="mt-2 text-sm text-red-400/80">
                      Please try again or use a different search term.
                    </p>
                  </motion.div>
                )}

                {/* Data source badge */}
                {hasSearched && dataSource && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex justify-center"
                  >
                    <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                      dataSource === "google-books"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : dataSource === "cache"
                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                        : dataSource === "ai-simulation"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : dataSource === "ai-google-hybrid"
                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                        : dataSource === "mock-data"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : dataSource === "mock-fallback"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : dataSource === "mock-no-key"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      <span className="mr-2">•</span>
                      {dataSource === "google-books"
                        ? "Powered by Google Books API"
                        : dataSource === "cache"
                        ? "Served from cache (5 min TTL)"
                        : dataSource === "ai-simulation"
                        ? "AI-Powered Recommendations"
                        : dataSource === "ai-google-hybrid"
                        ? "AI + Google Books Hybrid"
                        : dataSource === "mock-data"
                        ? "Using sample data (API unavailable)"
                        : dataSource === "mock-fallback"
                        ? "Using sample data (API unavailable)"
                        : dataSource === "mock-no-key"
                        ? "Using sample data (API key needed)"
                        : "Using sample data"}
                    </div>
                  </motion.div>
                )}

                <BookGrid
                  books={recommendations}
                  summary={apiSummary || (hasSearched
                    ? "Each recommendation is tailored to your preferences, considering genre, mood, and reading style."
                    : "A selection of highly‑rated books across genres to inspire your next read.")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA - reduced spacing */}
      <section className="px-6 py-16 md:py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-3xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-white/10 p-8 md:p-12 backdrop-blur-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to discover your next favorite book?
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              Join thousands of readers who found their perfect match with
              BookMatch AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleSearch("fantasy adventure")}
                className="rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                suppressHydrationWarning
              >
                Try Fantasy Adventure
              </button>
              <button
                onClick={() => handleSearch("mystery thriller")}
                className="rounded-full border border-white/20 bg-card px-6 py-3 font-semibold hover:bg-accent transition-colors"
                suppressHydrationWarning
              >
                Explore Mystery
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
