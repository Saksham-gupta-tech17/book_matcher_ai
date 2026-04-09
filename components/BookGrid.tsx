"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, Heart, Share2, Calendar, User } from "lucide-react";
import { useState } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  rating: number;
  cover: string;
  pages: number;
  year: number;
}

interface BookGridProps {
  books: Book[];
  title?: string;
  summary?: string;
}

export default function BookGrid({ books, title, summary }: BookGridProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const genres = ["All", ...new Set(books.map((b) => b.genre))];

  const filteredBooks =
    selectedGenre === "All"
      ? books
      : books.filter((book) => book.genre === selectedGenre);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="px-6 py-20">
      <div className="container mx-auto max-w-7xl">
        {(title || summary) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            {title && (
              <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
            )}
            {summary && (
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                {summary}
              </p>
            )}
          </motion.div>
        )}

        {/* Genre filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 flex flex-wrap justify-center gap-3"
        >
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`rounded-full py-2 px-4 text-sm font-medium transition-all ${
                selectedGenre === genre
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground/80 hover:bg-accent"
              }`}
              suppressHydrationWarning
            >
              {genre}
            </button>
          ))}
        </motion.div>

        {/* Book grid */}
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all"
              >
                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm"
                  aria-label="Toggle favorite"
                  suppressHydrationWarning
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      favorites.includes(book.id)
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                {/* Book cover */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white">
                        {book.genre}
                      </span>
                      <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold line-clamp-1">
                    {book.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{book.author}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-foreground/80">
                    {book.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{book.pages} pages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{book.year}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full p-2 hover:bg-accent"
                        aria-label="Share"
                        suppressHydrationWarning
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        suppressHydrationWarning
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="text-5xl">📚</div>
            <h3 className="mt-6 text-2xl font-bold">No books found</h3>
            <p className="mt-2 text-muted-foreground">
              Try selecting a different genre or search again.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}