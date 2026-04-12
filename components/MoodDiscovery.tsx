"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const moods = [
  { id: "space", icon: "🌌", label: "Deep Space" },
  { id: "mind", icon: "🕵️", label: "Mind-Bending" },
  { id: "heart", icon: "💖", label: "Heartfelt" },
  { id: "cozy", icon: "🌿", label: "Cozy Vibes" },
  { id: "fantasy", icon: "🔮", label: "Epic Fantasy" },
  { id: "mystery", icon: "🔪", label: "Thrilling Mystery" },
  { id: "comedy", icon: "😂", label: "Laugh Out Loud" },
  { id: "history", icon: "📚", label: "Historical Journey" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MoodDiscovery() {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleMoodFilter = (moodId: string, label: string) => {
    setActiveMood(moodId);
    console.log(`Selected mood: ${label} (${moodId})`);

    // Smooth scroll to the main results section
    const resultsSection = document.getElementById("results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full border-t border-white/10 bg-background/80 backdrop-blur-md py-16 text-center select-none">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-medium tracking-tight mb-8 font-sans"
        >
          What are you in the mood for?
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {moods.map((mood) => {
            const isActive = activeMood === mood.id;
            return (
              <motion.button
                key={mood.id}
                variants={pillVariants}
                onClick={() => handleMoodFilter(mood.id, mood.label)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-medium text-sm md:text-base ${
                  isActive 
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
                    : "bg-background/40 border-white/10 text-foreground hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                }`}
              >
                <span className="text-xl">{mood.icon}</span>
                <span>{mood.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}