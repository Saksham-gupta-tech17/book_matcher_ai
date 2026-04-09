"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function LoadingSpinner({ message = "Thinking..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative h-24 w-24"
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-4 rounded-full border-4 border-t-primary border-transparent" />
        <div className="absolute inset-8 rounded-full border-4 border-b-primary border-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold">{message}</h3>
        <p className="mt-2 text-muted-foreground">
          Our AI is scanning thousands of books to find your perfect matches.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}