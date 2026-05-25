// components/ui/testimonials-columns-1.tsx
"use client";

import { motion } from "motion/react";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  duration?: number; 
  className?: string;
}

export function TestimonialsColumn({
  testimonials,
  duration = 120, 
  className = "",
}: TestimonialsColumnProps) {
  
  const tripled = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        animate={{ y: ["0%", "-33.33%"] }} // move by exactly 1/3 of total height
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6"
        style={{ willChange: "transform" }} // GPU acceleration
      >
        {tripled.map((t, idx) => (
          <div
            key={idx}
            className="p-6 bg-card border border-border rounded-xl shadow-sm"
          >
            <p className="text-muted-foreground text-base leading-relaxed italic font-light mb-4">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={t.image}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
