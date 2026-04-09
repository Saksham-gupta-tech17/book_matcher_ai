"use client";

import { BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">BookMatch AI</h1>
            <p className="text-xs text-muted-foreground">
              Discover your next favorite read
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Explore
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Library
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-card hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-4 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-primary/30 transition-all">
              <Sparkles className="h-4 w-4" />
              Try Premium
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}