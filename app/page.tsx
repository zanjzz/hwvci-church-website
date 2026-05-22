'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, ChevronDown, MapPin, ChevronLeft, ChevronRight, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { DynamicEvents } from '@/components/dynamic-events';
import { ServiceCarousel } from '@/components/service-carousel';
import { FAQ } from '@/components/faq';

// ========== CUSTOM HOOK FOR SCROLL ANIMATIONS ==========
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' } // Trigger slightly before element enters viewport
    );

    // Select all sections and other elements you want to animate
    const animatedElements = document.querySelectorAll(
      '.animate-on-scroll, section:not(.hero-no-animate) > div, .grid > div, .carousel-container'
    );
    
    animatedElements.forEach((el) => {
      // Set initial opacity to 0
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      (el as HTMLElement).style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
      observer.observe(el);
    });

    // Add animation class when element becomes visible
    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('animate-fadeInUp')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
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

// ========== BRANCHES CAROUSEL ==========
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
    name: 'HWVCI Muntinlupa (Main Branch)',
    location: 'Philippines',
    address: '92RV+77P, Putatan, Muntinlupa, Metro Manila',
    serviceTime: 'Sundays 9:30 AM - 12:00 PM',
    image: '/branches/muntinlupa.png',
  },
  {
    id: 2,
    name: 'HWVCI Las Piñas',
    location: 'Philippines',
    address: 'C2G2+FWR, Las Piñas, 1740 Metro Manila',
    serviceTime: 'To be announced',
    image: '/branches/laspinas.png',
  },
  {
    id: 3,
    name: 'HWVCI Bicol',
    location: 'Philippines',
    address: '2PXV+9R, Legazpi City, Albay',
    serviceTime: 'To be announced',
    image: '/branches/bicol.png',
  },
  {
    id: 4,
    name: 'HWVCI Batangas',
    location: 'Philippines',
    address: 'R8HQ+GCV, San Juan, Batangas',
    serviceTime: 'To be announced',
    image: '/branches/batangas.png',
  },
  {
    id: 5,
    name: 'HWVCI Mie',
    location: 'Japan',
    address: '3 Chome-2-6 Nomachinaka, Suzuka, Mie 510-0216, Japan',
    serviceTime: 'To be announced',
    image: '/branches/mie.png',
  },
  {
    id: 6,
    name: 'HWVCI Anjo',
    location: 'Japan',
    address: 'Ikenishi-69 Ikeuracho, Anjo, Aichi 446-0066, Japan',
    serviceTime: 'To be announced',
    image: '/branches/anjo.png',
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

  // Auto-scroll
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

  // Touch / mouse drag handlers
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart && touchEnd && Math.abs(touchStart - touchEnd) > 50) {
      touchStart > touchEnd ? next() : prev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    setTouchStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setTouchEnd(e.clientX);
  };
  const handleMouseUp = () => {
    if (isDraggingRef.current && touchStart && touchEnd && Math.abs(touchStart - touchEnd) > 50) {
      touchStart > touchEnd ? next() : prev();
    }
    isDraggingRef.current = false;
    setTouchStart(0);
    setTouchEnd(0);
  };

  const current = branches[currentIndex];

  const openMaps = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
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
      {/* Desktop layout (image side by side) */}
      <div className="hidden md:block relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-0">
          {/* Left side: text with fade transition */}
          <div className="p-8 md:p-12 flex flex-col justify-center transition-all duration-500 ease-in-out">
            <div className="space-y-5">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{current.name}</h3>
                <p className="text-accent font-semibold text-lg">{current.location}</p>
              </div>
              <div className="space-y-3">
                <div 
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => openMaps(current.address)}
                >
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-foreground font-semibold group-hover:text-accent group-hover:underline transition-colors">
                    {current.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-foreground font-semibold">{current.serviceTime}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right side: image with fade transition */}
          <div className="relative h-full min-h-[320px] bg-muted/20 transition-opacity duration-500">
            <img
              src={current.image}
              alt={current.name}
              className="absolute inset-0 w-full h-full object-cover rounded-r-2xl"
            />
          </div>
        </div>
      </div>

      {/* Mobile layout: image as full background with text overlay */}
      <div className="md:hidden relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-in-out">
        <div
          className="relative h-[460px] w-full bg-cover bg-center rounded-2xl transition-all duration-500"
          style={{ backgroundImage: `url(${current.image})` }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40 rounded-2xl" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <h3 className="text-2xl font-bold mb-1">{current.name}</h3>
            <p className="text-accent-light text-base mb-3">{current.location}</p>
            <div className="space-y-2 text-sm">
              <div 
                className="flex items-start gap-2 cursor-pointer group"
                onClick={() => openMaps(current.address)}
              >
                <MapPin className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-tight group-hover:underline">{current.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-light" />
                <span>{current.serviceTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots + arrows */}
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
            className={`h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-accent w-8' : 'bg-muted w-3 hover:bg-muted-foreground'
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

// ========== VANTA CLOUDS BACKGROUND ==========
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
      if (typeof window !== 'undefined' && !window.THREE) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      if (!window.VANTA || !window.VANTA.CLOUDS) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js';
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
  return <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
};

// ========== MAIN HOME COMPONENT ==========
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Enable scroll animations
  useScrollAnimation();

  // Dark mode
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved || prefers) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('darkMode', String(newDark));
    if (newDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
  };
  const scrollToHero = () => heroRef.current?.scrollIntoView({ behavior: 'smooth' });

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Events', id: 'events' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={scrollToHero} className="flex items-center gap-3 z-50 relative focus:outline-none group">
            <img src="/hwvci-logo-light-mode.png" alt="HWVCI Logo" className="w-10 h-10 object-contain rounded-lg dark:hidden transition-transform group-hover:scale-105" />
            <img src="/hwvci-logo-dark-mode.png" alt="HWVCI Logo" className="w-10 h-10 object-contain rounded-lg hidden dark:block transition-transform group-hover:scale-105" />
            <div className="text-left">
              <span className="text-xl font-bold block">HWVCI</span>
              <p className="text-xs text-muted-foreground leading-none">House of Worship with Vision Church International</p>
            </div>
          </button>
          <div className="hidden md:flex items-center justify-end gap-8 flex-1 ml-5 pr-10">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-sm font-medium hover:text-accent transition-smooth">
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 relative z-50">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-muted transition-smooth" aria-label="Toggle dark mode">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth">
              <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                <span className={`block absolute h-0.5 w-5 bg-current rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
                <span className={`block absolute h-0.5 w-5 bg-current rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                <span className={`block absolute h-0.5 w-5 bg-current rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden flex items-center justify-center transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ backgroundColor: isMenuOpen ? (isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)') : 'transparent' }}>
        <div ref={menuRef} className={`relative w-[85%] max-w-sm mx-auto rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${isMenuOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'} ${isDark ? 'bg-black/60 border-white/20' : 'bg-white/70 border-black/10'}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
          <div className="flex flex-col items-center py-10 px-6">
            <div className="w-12 h-1 rounded-full bg-accent/50 mb-8" />
            <div className="flex flex-col items-center gap-4 w-full">
              {navLinks.map((link, idx) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="group w-full text-center py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-accent/20 hover:scale-105 hover:tracking-wide active:scale-95" style={{ transform: isMenuOpen ? 'translateY(0)' : 'translateY(15px)', opacity: isMenuOpen ? 1 : 0, transition: `transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${idx * 60}ms, opacity 0.3s ease ${idx * 60}ms` }}>{link.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center hero-no-animate">
        <VantaCloudsBackground isDark={isDark} />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1 className={`text-[3.8rem] sm:text-[5.5rem] lg:text-[7.2rem] mb-6 leading-tight font-bold tracking-wide ${isDark ? 'text-white/100 [-webkit-text-stroke:2px_white] [paint-order:stroke_fill]' : 'text-black/80 [-webkit-text-stroke:1px_white] [paint-order:stroke_fill] drop-shadow-md'}`} style={{ fontFamily: 'var(--font-permanent-marker), cursive' }}>HWVCI</h1>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-tight ${isDark ? 'text-white/90' : 'text-black/80 drop-shadow-md'}`}>House of Worship with Vision Church International</h2>
          </div>
          <p className={`text-base sm:text-lg mb-10 max-w-2xl mx-auto animate-fadeInUp animate-delay-200 font-semibold ${isDark ? 'text-white/90' : 'text-black/80'}`}>A community united in faith, vision, and purpose. Join us for worship, growth, and meaningful fellowship as we journey together in Christ.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp animate-delay-300">
            <button onClick={() => scrollToSection('services')} className="inline-flex items-center justify-center w-44 sm:min-w-[200px] px-4 sm:px-8 h-12 bg-accent text-accent-foreground font-bold text-sm sm:text-base rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap">Join Us for Service</button>
            <button onClick={() => scrollToSection('contact')} className={`inline-flex items-center justify-center w-44 sm:min-w-[200px] px-4 sm:px-8 h-12 font-bold text-sm sm:text-base rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap ${isDark ? 'bg-white/10 backdrop-blur-md border border-white/60 text-white hover:bg-white hover:text-black' : 'bg-black/10 backdrop-blur-md border border-black/40 text-black hover:bg-black hover:text-white'}`}>Get in Touch</button>
          </div>
          <div className="animate-bounce flex justify-center"><ChevronDown className={`w-6 h-6 ${isDark ? 'text-white/60' : 'text-black/60'}`} /></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-stretch">
            <div className="relative md:flex md:items-stretch mb-8 md:mb-0">
              <div className="relative overflow-hidden rounded-2xl group w-full md:flex md:flex-col md:min-h-[520px] animate-on-scroll">
                <img src="/worship.png" alt="Church worship community" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 md:absolute md:inset-0 md:w-full md:h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent md:hidden">
                  <p className="text-gray-300 text-base font-semibold leading-relaxed mb-3">HWVCI is a dynamic faith community dedicated to spreading the Gospel and transforming lives through the power of Jesus Christ.</p>
                  <p className="text-gray-300 text-sm leading-relaxed">Our mission is to create a welcoming space where people from all walks of life can experience God's love, grow in their faith, and become agents of positive change.</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:flex-col md:justify-start">
              <div className="animate-on-scroll">
                <p className="text-lg text-foreground mb-6 leading-relaxed font-semibold">HWVCI is a dynamic faith community dedicated to spreading the Gospel and transforming lives through the power of Jesus Christ. We believe in the transformative power of faith, the importance of community, and the call to serve others with love and compassion.</p>
                <p className="text-lg text-foreground mb-8 leading-relaxed font-semibold">Our mission is to create a welcoming space where people from all walks of life can experience God's love, grow in their faith, and become agents of positive change in their communities.</p>
                <div className="space-y-4">
                  {[
                    { title: 'Rooted in Scripture', desc: 'Grounded in biblical truth and Christ-centered teaching' },
                    { title: 'Community Focused', desc: 'Building meaningful relationships and serving together' },
                    { title: 'Worship Centered', desc: "Lifting our voices in praise and encountering God's presence" },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1"><span className="text-white font-bold text-sm">✓</span></div>
                      <div><h3 className="font-bold text-foreground mb-1">{item.title}</h3><p className="text-muted-foreground">{item.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll"><h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h2><p className="text-lg text-muted-foreground">Explore the ministries and services we offer in our main branch</p></div>
          <div className="animate-on-scroll"><ServiceCarousel /></div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll"><h2 className="text-4xl sm:text-5xl font-bold mb-4">Upcoming Events</h2><p className="text-lg text-muted-foreground">Be part of our vibrant community events</p></div>
          <div className="animate-on-scroll"><DynamicEvents /></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 dark:bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll"><h2 className="text-4xl sm:text-5xl font-bold mb-4">Member Testimonies</h2><p className="text-lg text-muted-foreground">Stories of transformation and faith</p></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Jasmine Dela Luna', quote: 'This church has become my spiritual home. The community is so welcoming and the teachings have truly transformed my walk with God.', role: 'Sunday School Teacher' },
              { name: 'Jennimae Panganiban', quote: 'I came here looking for community and found so much more. The vision and mission of this church inspire me daily to be a better person.', role: 'Member since 2020' },
              { name: 'Miggy Abad', quote: "The love and support I've received here has been incredible. This is more than just a church; it's a family united in Christ.", role: 'Worship Guitarist' },
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-smooth animate-on-scroll flex flex-col" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <span key={i} className="text-accent text-lg">★</span>)}</div>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed italic flex-grow">"{t.quote}"</p>
                <div className="border-t border-border/50 pt-6 mt-auto"><p className="font-bold text-foreground">{t.name}</p><p className="text-sm text-muted-foreground">{t.role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 dark:bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll"><h2 className="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h2><p className="text-lg text-muted-foreground">Find answers to common questions about HWVCI</p></div>
          <div className="animate-on-scroll"><FAQ /></div>
        </div>
      </section>

      {/* Branches Carousel */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll"><h2 className="text-4xl sm:text-5xl font-bold mb-4">Church Branches</h2><p className="text-lg text-muted-foreground">Visit us at any of our locations</p></div>
          <div className="animate-on-scroll"><BranchesCarousel /></div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16 animate-on-scroll"><h2 className="text-4xl sm:text-5xl font-bold mb-4">Connect With Us</h2><p className="text-lg text-muted-foreground">Follow us on social media for updates, encouragement, and community.</p></div>
          <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap animate-on-scroll">
            <a href="https://www.facebook.com/hwvciph" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center"><Facebook className="w-5 h-5 sm:w-7 sm:h-7 text-accent" /></div>
              <span className="font-semibold text-foreground text-sm sm:text-base">Facebook</span>
              <span className="text-xs text-muted-foreground hidden sm:block">/hwvciph</span>
            </a>
            <a href="https://www.instagram.com/hwvci_arrowheads" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center"><Instagram className="w-5 h-5 sm:w-7 sm:h-7 text-accent" /></div>
              <span className="font-semibold text-foreground text-sm sm:text-base">Instagram</span>
              <span className="text-xs text-muted-foreground hidden sm:block">@hwvci_arrowheads</span>
            </a>
            <a href="https://www.messenger.com/t/1444734995826323" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center"><MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 text-accent" /></div>
              <span className="font-semibold text-foreground text-sm sm:text-base">Messenger</span>
              <span className="text-xs text-muted-foreground hidden sm:block">m.me/hwvciph</span>
            </a>
          </div>
          <div className="mt-12 pt-8 border-t border-border animate-on-scroll">
            <div className="flex justify-center items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span className="text-sm">Putatan, Muntinlupa, Metro Manila</span></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start animate-on-scroll">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-2 mb-4">
                <img src="/hwvci-logo-dark-mode.png" alt="HWVCI Logo" className="w-8 h-8 object-contain rounded-lg dark:hidden" />
                <img src="/hwvci-logo-light-mode.png" alt="HWVCI Logo" className="w-8 h-8 object-contain rounded-lg hidden dark:block" />
                <span className="font-bold">HWVCI</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">House of Worship with Vision Church International</p>
              <p className="text-primary-foreground/70 text-sm mt-3">Putatan, Muntinlupa, Metro Manila</p>
            </div>
            <div className="animate-on-scroll"><h4 className="font-bold mb-4">Quick Links</h4><ul className="space-y-2 text-sm text-primary-foreground/70">{navLinks.map(link => (<li key={link.id}><a href={`#${link.id}`} className="hover:text-primary-foreground transition-smooth">{link.label}</a></li>))}</ul></div>
            <div className="animate-on-scroll"><h4 className="font-bold mb-4">Connect With Us</h4><ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="https://www.facebook.com/hwvciph" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook</a></li>
              <li><a href="https://www.instagram.com/hwvci_arrowheads" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href="https://www.messenger.com/t/1444734995826323" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Messenger</a></li>
            </ul></div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70 animate-on-scroll">
            <p>&copy; {new Date().getFullYear()} House of Worship with Vision Church International. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add global styles for animations */}
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
          transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .animate-on-scroll.animate-fadeInUp {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

