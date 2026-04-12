"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import MoodDiscovery from "./MoodDiscovery";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="mt-20">
        <MoodDiscovery />
      </div>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-card/50"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} BookMatch AI. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by
              the BookMatch team.
            </p>
          </div>
        </div>
      </motion.footer>
    </>
  );
}