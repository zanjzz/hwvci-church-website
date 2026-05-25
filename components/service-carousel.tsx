"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface Service {
  id: number;
  title: string;
  time: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Sunday Service",
    time: "Sundays at 9:30 AM to 12:00 PM",
    description:
      "Experience powerful worship through music, prayer, and biblical teaching every Sunday morning.",
    image: "/services/sunday-service.jpg",
  },
  {
    id: 2,
    title: "Youth Fellowship",
    time: "Every 2nd and 4th Sunday of the month at 2:00 PM to 4:00 PM",
    description:
      "Join us for Youth Fellowship – where young people come as they are, grow in faith together, build friendships that matter, and encounter God in fresh, relevant ways.",
    image: "/services/youth-fellowship.jpg",
  },
  {
    id: 3,
    title: "Koinonia",
    time: "After every last Sunday service of the month at 12:00 PM to 2:00 PM",
    description:
      "Come and be part of our Koinonia — a time to gather, share meals, build meaningful relationships, and grow together in fellowship. Everyone is welcome!",
    image: "/services/koinonia.jpg",
  },
  {
    id: 4,
    title: "Morning Prayer",
    time: "Everyday at 6:00 AM (Online)",
    description:
      "Join our Morning Prayer Online as we start the day together in prayer, reflection, and encouragement in God’s presence.",
    image: "/services/morning-prayer.png",
  },
  {
    id: 5,
    title: "Sunday School",
    time: "Sundays at 10:00 AM to 12:00 PM",
    description:
      "For kids to hear Bible stories, do some crafts, play games, and hang out with friends.",
    image: "/services/sunday-school.jpg",
  },
];

export function ServiceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDarkOverlay, setIsDarkOverlay] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlaying, services.length]);

  const resetAutoPlayTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
      }, 5000);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
    resetAutoPlayTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    resetAutoPlayTimer();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetAutoPlayTimer();
  };

  // Handle dark overlay - ONLY on the image area
  const handleImageMouseEnter = () => {
    setIsAutoPlaying(false);
    setIsDarkOverlay(true);
  };

  const handleImageMouseLeave = () => {
    setIsAutoPlaying(true);
    setIsDarkOverlay(false);
  };

  // Handle click outside for mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        imageContainerRef.current &&
        !imageContainerRef.current.contains(event.target as Node)
      ) {
        setIsDarkOverlay(false);
        setIsAutoPlaying(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDarkOverlay(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === 0 || touchEnd === 0) return;

    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse drag handlers (desktop swipe)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;

    isDraggingRef.current = true;
    setTouchStart(e.clientX);
    setIsDarkOverlay(true);
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    if (touchStart !== 0 && touchEnd !== 0) {
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    isDraggingRef.current = false;
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="w-full select-none">
      {/* Image container with hover effect ONLY here */}
      <div
        ref={imageContainerRef}
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="relative h-[400px] sm:h-[450px] md:h-[500px]">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: index === currentIndex ? 1 : 0,
              }}
            >
              {/* Background Image */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />

              {/* Base gradient overlay (always present) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Dark overlay that fades in/out with opacity */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50 transition-opacity duration-500 ease-in-out ${
                  isDarkOverlay ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))}

          {/* Text content - always visible with clean typography */}
          <div className="relative z-10 w-full h-full flex flex-col justify-end text-left px-6 sm:px-12 pb-8 sm:pb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-2 sm:mb-3">
              {services[currentIndex].title}
            </h3>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Clock className="w-5 h-5 text-white/80" />
              <p className="text-base sm:text-lg text-white/80 font-light tracking-wide">
                {services[currentIndex].time}
              </p>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl">
              {services[currentIndex].description}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation arrows and dots - OUTSIDE the hover area */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80 transition-all duration-200"
          aria-label="Previous service"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-accent w-6"
                : "bg-muted w-2 hover:bg-muted-foreground active:bg-muted-foreground/70"
            }`}
            aria-label={`Go to service ${index + 1}`}
          />
        ))}

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80 transition-all duration-200"
          aria-label="Next service"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
