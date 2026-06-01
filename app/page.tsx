// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { DynamicEvents } from "@/components/dynamic-events";
import { ServiceCarousel } from "@/components/service-carousel";
import { FAQ } from "@/components/faq";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const animatedElements = document.querySelectorAll(
      ".animate-on-scroll, section:not(.hero-no-animate) > div, .grid > div, .carousel-container",
    );

    animatedElements.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(30px)";
      (el as HTMLElement).style.transition =
        "opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)";
      observer.observe(el);
    });

    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains("animate-fadeInUp")) {
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
          }
        }
      }
    };

    const mutationObserver = new MutationObserver(observerCallback);
    animatedElements.forEach((el) => {
      mutationObserver.observe(el, { attributes: true });
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

const testimonialsData = [
  {
    text: "This church has become my spiritual home. The community is so welcoming and the teachings have truly transformed my walk with God.",
    image: "people/jasmin.png",
    name: "Jasmin Dela Luna",
    role: "Sunday School Teacher",
  },
  {
    text: "The worship services are powerful, and the teaching is always rooted in Scripture. I've grown so much spiritually since joining HWVCI.",
    image: "people/irma.png",
    name: "Irma Polonio",
    role: "Church Member",
  },
  {
    text: "The love and support I've received here has been incredible. This is more than just a church; it's a family united in Christ.",
    image: "people/miggy.png",
    name: "Miggy Abad",
    role: "Music Ministry Guitarist",
  },
  {
    text: "I came here looking for community and found so much more. The vision and mission of this church inspire me daily to be a better person.",
    image: "people/jennimae.png",
    name: "Jennimae Panganiban",
    role: "Multimedia Ministry Member",
  },
  {
    text: "The youth ministry has given my children a strong foundation. We are grateful for a church that invests in the next generation.",
    image: "people/raiza.png",
    name: "Raiza Rejuso",
    role: "Youth Leader",
  },
  {
    text: "I found healing and restoration here. The pastoral care team walked with me through difficult times, and I'll never forget their love.",
    image: "people/mitch.png",
    name: "Mitch Villarey",
    role: "Worship Leader",
  },
  {
    text: "Being part of the church's music ministry has allowed me to serve the community through music. It's a blessing to be part of a church that genuinely lives out its faith.",
    image: "people/zanjoe.png",
    name: "Zanjoe Langa",
    role: "Music Ministry Keyboardist",
  },
  {
    text: "Every Sunday feels like a family reunion. The genuine love and care among members is what makes HWVCI special.",
    image: "people/edwin.png",
    name: "Edwin Dagundon",
    role: "Church Pastor",
  },
  {
    text: "The online services and resources have kept me connected even when I couldn't attend in person. Truly a church with a vision for all.",
    image: "people/roseann.png",
    name: "Roseann Mercado",
    role: "Former Youth Leader",
  },
];

const firstColumn = testimonialsData.slice(0, 3);
const secondColumn = testimonialsData.slice(3, 6);
const thirdColumn = testimonialsData.slice(6, 9);

interface Branch {
  id: number;
  name: string;
  location: string;
  address: string;
  serviceTime: string;
  image: string;
}

const branches: Branch[] = [
  {
    id: 1,
    name: "HWVCI Muntinlupa (Main Branch)",
    location: "Philippines",
    address: "92RV+77P, Putatan, Muntinlupa, Metro Manila",
    serviceTime: "Sundays 9:30 AM - 12:00 PM",
    image: "/branches/muntinlupa.png",
  },
  {
    id: 2,
    name: "HWVCI Las Piñas",
    location: "Philippines",
    address: "C2G2+FWR, Las Piñas, 1740 Metro Manila",
    serviceTime: "To be announced",
    image: "/branches/laspinas.png",
  },
  {
    id: 3,
    name: "HWVCI Bicol",
    location: "Philippines",
    address: "2PXV+9R, Legazpi City, Albay",
    serviceTime: "To be announced",
    image: "/branches/bicol.png",
  },
  {
    id: 4,
    name: "HWVCI Batangas",
    location: "Philippines",
    address: "R8HQ+GCV, San Juan, Batangas",
    serviceTime: "To be announced",
    image: "/branches/batangas.png",
  },
  {
    id: 5,
    name: "HWVCI Calamba",
    location: "Philippines",
    address: "To be announced",
    serviceTime: "To be announced",
    image: "/branches/calamba.png",
  },
  {
    id: 6,
    name: "HWVCI Mie",
    location: "Japan",
    address: "3 Chome-2-6 Nomachinaka, Suzuka, Mie 510-0216, Japan",
    serviceTime: "To be announced",
    image: "/branches/mie.png",
  },
  {
    id: 7,
    name: "HWVCI Anjo",
    location: "Japan",
    address: "Ikenishi-69 Ikeuracho, Anjo, Aichi 446-0066, Japan",
    serviceTime: "To be announced",
    image: "/branches/anjo.png",
  },
];

export function BranchesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        next();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  const resetAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        next();
      }, 5000);
    }
  };

  const next = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % branches.length);
    resetAutoPlay();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + branches.length) % branches.length);
    resetAutoPlay();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goTo = (idx: number) => {
    if (isTransitioning || idx === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(idx);
    resetAutoPlay();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart && touchEnd && Math.abs(touchStart - touchEnd) > 50) {
      touchStart > touchEnd ? next() : prev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    isDraggingRef.current = true;
    setTouchStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setTouchEnd(e.clientX);
  };
  const handleMouseUp = () => {
    if (
      isDraggingRef.current &&
      touchStart &&
      touchEnd &&
      Math.abs(touchStart - touchEnd) > 50
    ) {
      touchStart > touchEnd ? next() : prev();
    }
    isDraggingRef.current = false;
    setTouchStart(0);
    setTouchEnd(0);
  };

  const current = branches[currentIndex];

  const openMaps = (address: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank",
    );
  };

  return (
    <div
      className="w-full select-none carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="hidden md:block relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-0">
          <div className="p-8 md:p-12 flex flex-col justify-center transition-all duration-500 ease-in-out">
            <div className="space-y-5">
              <div>
                <h3 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-2">
                  {current.name}
                </h3>
                <p className="text-accent font-medium text-lg">
                  {current.location}
                </p>
              </div>
              <div className="space-y-3">
                <div
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => openMaps(current.address)}
                >
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-foreground font-medium group-hover:text-accent group-hover:underline transition-colors">
                    {current.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-foreground font-medium">
                    {current.serviceTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-full min-h-[320px] bg-muted/20 transition-opacity duration-500">
            <img
              src={current.image}
              alt={current.name}
              className="absolute inset-0 w-full h-full object-cover rounded-r-2xl"
            />
          </div>
        </div>
      </div>

      <div className="md:hidden relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-in-out">
        <div
          className="relative h-[460px] w-full bg-cover bg-center rounded-2xl transition-all duration-500"
          style={{ backgroundImage: `url(${current.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40 rounded-2xl" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <h3 className="text-2xl font-light tracking-tight mb-1">
              {current.name}
            </h3>
            <p className="text-accent-light text-base mb-3">
              {current.location}
            </p>
            <div className="space-y-2 text-sm">
              <div
                className="flex items-start gap-2 cursor-pointer group"
                onClick={() => openMaps(current.address)}
              >
                <MapPin className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-tight group-hover:underline">
                  {current.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-light" />
                <span>{current.serviceTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          aria-label="Previous branch"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        {branches.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-accent w-6"
                : "bg-muted w-2 hover:bg-muted-foreground"
            }`}
            aria-label={`Go to branch ${idx + 1}`}
          />
        ))}
        <button
          onClick={next}
          className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          aria-label="Next branch"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

const VantaCloudsBackground = ({ isDark }: { isDark: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;
    let isActive = true;

    const initVanta = async () => {
      if (typeof window !== "undefined" && !window.THREE) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      if (!window.VANTA || !window.VANTA.CLOUDS) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      if (!isActive || !containerRef.current) return;
      if (vantaEffectRef.current) vantaEffectRef.current.destroy();

      const lightConfig = {
        skyColor: 0x70bedc,
        cloudColor: 0xacc1e1,
        cloudShadowColor: 0x183755,
        sunColor: 0xfc9617,
        sunGlareColor: 0xf76636,
        sunlightColor: 0xf59230,
        speed: 0.5,
      };
      const darkConfig = {
        skyColor: 0x3869,
        cloudColor: 0x9292b1,
        cloudShadowColor: 0xc54a7,
        sunColor: 0x858cff,
        sunGlareColor: 0x552110,
        sunlightColor: 0x20a57,
        speed: 0.4,
      };
      vantaEffectRef.current = window.VANTA.CLOUDS({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        ...(isDark ? darkConfig : lightConfig),
      });
    };
    initVanta();
    return () => {
      isActive = false;
      if (vantaEffectRef.current) vantaEffectRef.current.destroy();
    };
  }, [isMounted, isDark]);

  if (!isMounted) return null;
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useScrollAnimation();

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    if (saved) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    if (newDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      300,
    );
  };
  const scrollToHero = () =>
    heroRef.current?.scrollIntoView({ behavior: "smooth" });

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Events", id: "events" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-light">
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"}`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={scrollToHero}
            className="flex items-center gap-3 z-50 relative focus:outline-none group"
          >
            <img
              src="/hwvci-logo-light-mode.png"
              alt="HWVCI Logo"
              className="w-10 h-10 object-contain rounded-lg dark:hidden transition-transform group-hover:scale-105"
            />
            <img
              src="/hwvci-logo-dark-mode.png"
              alt="HWVCI Logo"
              className="w-10 h-10 object-contain rounded-lg hidden dark:block transition-transform group-hover:scale-105"
            />
            <div className="text-left">
              <span className="text-xl font-medium tracking-tight block">
                HWVCI
              </span>
              <p className="text-xs text-muted-foreground font-light leading-none">
                House of Worship with Vision Church International
              </p>
            </div>
          </button>
          <div className="hidden md:flex items-center justify-end gap-8 flex-1 ml-5 pr-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-light tracking-wide hover:text-accent transition-smooth"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 relative z-50">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            >
              <div className="w-6 h-6 relative flex flex-col justify-center items-center gap-1.5">
                <span className="block h-0.5 w-5 bg-current rounded transition-all duration-300" />
                <span className="block h-0.5 w-5 bg-current rounded transition-all duration-300" />
                <span className="block h-0.5 w-5 bg-current rounded transition-all duration-300" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden flex items-center justify-center transition-all duration-500 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          backdropFilter: isMenuOpen ? "blur(8px)" : "none",
          backgroundColor: isMenuOpen
            ? isDark
              ? "rgba(0,0,0,0.6)"
              : "rgba(0,0,0,0.4)"
            : "transparent",
        }}
      >
        <div
          ref={menuRef}
          className={`w-[85%] max-w-sm rounded-3xl shadow-2xl border transition-all duration-500 ${
            isMenuOpen
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-8 opacity-0"
          } ${isDark ? "bg-black/80 border-white/20" : "bg-white/90 border-black/10"}`}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center py-10 px-6">
            <div className="w-12 h-1 rounded-full bg-accent/50 mb-8" />
            <div className="flex flex-col items-center gap-4 w-full">
              {navLinks.map((link, idx) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="group w-full text-center py-3 rounded-xl text-lg font-light transition-all duration-300 hover:bg-accent/20 hover:scale-105 hover:tracking-wide active:scale-95"
                  style={{
                    transform: isMenuOpen
                      ? "translateY(0)"
                      : "translateY(15px)",
                    opacity: isMenuOpen ? 1 : 0,
                    transition: `transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${idx * 60}ms, opacity 0.3s ease ${idx * 60}ms`,
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center hero-no-animate"
      >
        <VantaCloudsBackground isDark={isDark} />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1
              className={`text-[3.8rem] sm:text-[5.5rem] lg:text-[7.2rem] mb-6 leading-[1.1] font-light tracking-tight ${isDark ? "text-white/100" : "text-black/80 drop-shadow-sm"}`}
              style={{
                fontFamily:
                  "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
              }}
            >
              HWVCI
            </h1>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-8 leading-tight ${isDark ? "text-white/90" : "text-black/80 drop-shadow-sm"}`}
            >
              House of Worship with Vision Church International
            </h2>
          </div>
          <p
            className={`text-base sm:text-lg mb-10 max-w-2xl mx-auto animate-fadeInUp animate-delay-200 font-light leading-relaxed ${isDark ? "text-white/80" : "text-black/70"}`}
          >
            A community united in faith, vision, and purpose. Join us for
            worship, growth, and meaningful fellowship as we journey together in
            Christ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp animate-delay-300">
            <button
              onClick={() => scrollToSection("services")}
              className="inline-flex items-center justify-center w-44 sm:min-w-[200px] px-4 sm:px-8 h-12 bg-accent text-accent-foreground font-medium text-sm sm:text-base rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            >
              Join Us for Service
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`inline-flex items-center justify-center w-44 sm:min-w-[200px] px-4 sm:px-8 h-12 font-medium text-sm sm:text-base rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap ${isDark ? "bg-white/10 backdrop-blur-md border border-white/60 text-white hover:bg-white hover:text-black" : "bg-black/10 backdrop-blur-md border border-black/40 text-black hover:bg-black hover:text-white"}`}
            >
              Get in Touch
            </button>
          </div>
          <div className="animate-bounce flex justify-center">
            <ChevronDown
              className={`w-6 h-6 ${isDark ? "text-white/60" : "text-black/60"}`}
            />
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-stretch">
            <div className="relative md:flex md:items-stretch mb-8 md:mb-0">
              <div className="relative overflow-hidden rounded-2xl group w-full md:flex md:flex-col md:min-h-[520px] animate-on-scroll">
                <img
                  src="/worship.png"
                  alt="Church worship community"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 md:absolute md:inset-0 md:w-full md:h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent md:hidden">
                  <p className="text-gray-300 text-base font-light leading-relaxed mb-3">
                    HWVCI is a dynamic faith community dedicated to spreading
                    the Gospel and transforming lives through the power of Jesus
                    Christ.
                  </p>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">
                    Our mission is to create a welcoming space where people from
                    all walks of life can experience God's love, grow in their
                    faith, and become agents of positive change.
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:flex-col md:justify-start">
              <div className="animate-on-scroll">
                <p className="text-lg text-foreground mb-6 leading-relaxed font-light">
                  HWVCI is a dynamic faith community dedicated to spreading the
                  Gospel and transforming lives through the power of Jesus
                  Christ. We believe in the transformative power of faith, the
                  importance of community, and the call to serve others with
                  love and compassion.
                </p>
                <p className="text-lg text-foreground mb-8 leading-relaxed font-light">
                  Our mission is to create a welcoming space where people from
                  all walks of life can experience God's love, grow in their
                  faith, and become agents of positive change in their
                  communities.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Rooted in Scripture",
                      desc: "Grounded in biblical truth and Christ-centered teaching",
                    },
                    {
                      title: "Community Focused",
                      desc: "Building meaningful relationships and serving together",
                    },
                    {
                      title: "Worship Centered",
                      desc: "Lifting our voices in praise and encountering God's presence",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-medium text-sm">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground font-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Church Life Gallery */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Elegant gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 via-background to-primary/5 dark:from-accent/10 dark:via-background dark:to-primary/10" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              Moments of worship. Memories of fellowship. Where hearts gather,
              serve, and grow together.
            </p>
          </motion.div>

          {/* Mobile: 2 columns, with a full-width landscape image in the middle, 3 rows only */}
          <div className="block md:hidden">
            {/* Row 1: two squares */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src="/church-images/pic1.png"
                  alt="Praise and Worship"
                  className="w-full h-full object-cover gallery-img"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src="/church-images/pic2.png"
                  alt="Preaching"
                  className="w-full h-full object-cover gallery-img"
                />
              </div>
            </div>
            {/* Row 2: full-width landscape */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
              <img
                src="/church-images/pic3.png"
                alt="HWVCI Kids"
                className="w-full h-full object-cover gallery-img"
              />
            </div>
            {/* Row 3: two squares (no 4th row) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src="/church-images/pic5.png"
                  alt="Thanksgiving Day"
                  className="w-full h-full object-cover gallery-img"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src="/church-images/pic4.png"
                  alt="Fellowship"
                  className="w-full h-full object-cover gallery-img"
                />
              </div>
            </div>
          </div>

          {/* Desktop: 3 rows, 4 columns, no empty slots */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 auto-rows-[240px]">
            {/* pic1 - spans 2 columns and 2 rows (top left large) */}
            <div className="relative md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic1.png"
                alt="Praise and Worship"
                className="w-full h-full object-cover gallery-img"
              />
            </div>

            {/* pic2 - top right col 3 */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic2.png"
                alt="Preaching"
                className="w-full h-full object-cover gallery-img"
              />
            </div>

            {/* pic3 - top right col 4 */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic7.png"
                alt="Preaching"
                className="w-full h-full object-cover gallery-img"
              />
            </div>

            {/* pic7 - middle row, spans columns 3-4 (under pic2 and pic3) */}
            <div className="relative md:col-span-2 rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic3.png"
                alt="HWVCI Kids"
                className="w-full h-full object-cover gallery-img"
              />
            </div>

            {/* pic4 - bottom row, spans columns 1-2 (under pic1) */}
            <div className="relative md:col-span-2 rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic4.png"
                alt="Fellowship"
                className="w-full h-full object-cover gallery-img"
              />
            </div>

            {/* pic5 - bottom row, column 3 */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic5.png"
                alt="Thanksgiving Day"
                className="w-full h-full object-cover gallery-img"
              />
            </div>

            {/* pic6 - bottom row, column 4 */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/church-images/pic6.png"
                alt="Lunch Fellowship"
                className="w-full h-full object-cover gallery-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Explore the ministries and services at our main branch
            </p>
          </div>
          <div className="animate-on-scroll">
            <ServiceCarousel />
          </div>
        </div>
      </section>

      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Be part of our vibrant community events
            </p>
          </div>
          <div className="animate-on-scroll">
            <DynamicEvents />
          </div>
        </div>
      </section>

      {/* Testimonials - Infinite scrolling columns */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 dark:bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center max-w-[540px] mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              Testimonials
            </h2>
            <p className="text-lg text-muted-foreground mt-5">
              Stories of transformation and faith from our community.
            </p>
          </motion.div>

          {/* Mobile: Single column with ALL 9 testimonials */}
          <div className="block md:hidden">
            <div className="[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[540px] overflow-hidden">
              <TestimonialsColumn
                testimonials={testimonialsData}
                duration={70}
              />
            </div>
          </div>

          {/* Desktop: 3 columns */}
          <div className="hidden md:flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[540px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={25} />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={35}
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={20}
            />
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 dark:bg-black/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Find answers to common questions about HWVCI
            </p>
          </div>
          <div className="animate-on-scroll">
            <FAQ />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
              Church Branches
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Join us at any of our branches
            </p>
          </div>
          <div className="animate-on-scroll">
            <BranchesCarousel />
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
              Connect With Us
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Follow us on social media for updates, encouragement, and
              community.
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap animate-on-scroll">
            <a
              href="https://www.facebook.com/hwvciph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Facebook className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              </div>
              <span className="font-medium text-foreground text-sm sm:text-base">
                Facebook
              </span>
              <span className="text-xs text-muted-foreground font-light hidden sm:block">
                /hwvciph
              </span>
            </a>
            <a
              href="https://www.instagram.com/hwvci_arrowheads"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Instagram className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              </div>
              <span className="font-medium text-foreground text-sm sm:text-base">
                Instagram
              </span>
              <span className="text-xs text-muted-foreground font-light hidden sm:block">
                @hwvci_arrowheads
              </span>
            </a>
            <a
              href="https://www.messenger.com/t/1444734995826323"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              </div>
              <span className="font-medium text-foreground text-sm sm:text-base">
                Messenger
              </span>
              <span className="text-xs text-muted-foreground font-light hidden sm:block">
                m.me/hwvciph
              </span>
            </a>
          </div>
          <div className="mt-12 pt-8 border-t border-border animate-on-scroll">
            <div className="flex justify-center items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-light">
                Putatan, Muntinlupa, Metro Manila
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start animate-on-scroll">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-2 mb-4">
                <img
                  src="/hwvci-logo-dark-mode.png"
                  alt="HWVCI Logo"
                  className="w-8 h-8 object-contain rounded-lg dark:hidden"
                />
                <img
                  src="/hwvci-logo-light-mode.png"
                  alt="HWVCI Logo"
                  className="w-8 h-8 object-contain rounded-lg hidden dark:block"
                />
                <span className="font-medium">HWVCI</span>
              </div>
              <p className="text-primary-foreground/70 text-sm font-light">
                House of Worship with Vision Church International
              </p>
              <p className="text-primary-foreground/70 text-sm font-light mt-3">
                Putatan, Muntinlupa, Metro Manila
              </p>
            </div>
            <div className="animate-on-scroll">
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70 font-light">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="hover:text-primary-foreground transition-smooth"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-on-scroll">
              <h4 className="font-medium mb-4">Connect With Us</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70 font-light">
                <li>
                  <a
                    href="https://www.facebook.com/hwvciph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/hwvci_arrowheads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.messenger.com/t/1444734995826323"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Messenger
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70 font-light animate-on-scroll">
            <p>
              &copy; {new Date().getFullYear()} House of Worship with Vision
              Church International. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1),
            transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .animate-on-scroll.animate-fadeInUp {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-img {
          filter: brightness(0.9) contrast(1.05) saturate(1);
        }
      `}</style>
    </div>
  );
}
