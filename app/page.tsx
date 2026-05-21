'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, ChevronDown, MapPin } from 'lucide-react';
import { DynamicEvents } from '@/components/dynamic-events';
import { ServiceCarousel } from '@/components/service-carousel';
import { FAQ } from '@/components/faq';
import { BranchesCarousel } from '@/components/branches-carousel';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Dark mode
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
              aria-label="Toggle menu"
            >
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
      <div
        className={`fixed inset-0 z-40 md:hidden flex items-center justify-center transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: isMenuOpen ? (isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)') : 'transparent' }}
      >
        <div
          ref={menuRef}
          className={`relative w-[85%] max-w-sm mx-auto rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
            isMenuOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
          } ${
            isDark
              ? 'bg-black/60 border-white/20'
              : 'bg-white/70 border-black/10'
          }`}
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
                  className="group w-full text-center py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-accent/20 hover:scale-105 hover:tracking-wide active:scale-95"
                  style={{
                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(15px)',
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-10 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-section-background.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1
              className="text-[3.8rem] sm:text-[5.5rem] lg:text-[7.2rem] mb-6 leading-tight 
                        text-white/90 [-webkit-text-stroke:2px_white] [paint-order:stroke_fill] 
                        tracking-wide"
              style={{ fontFamily: 'var(--font-permanent-marker), cursive' }}
            >
              HWVCI
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 mb-8 leading-tight">
              House of Worship with Vision Church International
            </h2>
          </div>
          <p className="text-base sm:text-lg text-white/80 mb-10 max-w-2xl mx-auto animate-fadeInUp animate-delay-200 font-semibold">
            A community united in faith, vision, and purpose. Join us for worship, growth, and meaningful fellowship as we journey together in Christ.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp animate-delay-300">
            <button
              onClick={() => scrollToSection('services')}
              className="inline-flex items-center justify-center w-44 sm:min-w-[200px] px-4 sm:px-8 h-12 bg-accent text-accent-foreground font-bold text-sm sm:text-base rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            >
              Join Us for Service
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center justify-center w-44 sm:min-w-[200px] px-4 sm:px-8 h-12 bg-white/10 backdrop-blur-md border border-white/60 text-white font-bold text-sm sm:text-base rounded-xl hover:bg-white hover:text-black hover:border-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            >
              Get in Touch
            </button>
          </div>

          <div className="animate-bounce flex justify-center">
            <ChevronDown className="w-6 h-6 text-white/60" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-stretch">
            <div className="relative md:flex md:items-stretch mb-8 md:mb-0 animate-slideInLeft">
              <div className="relative overflow-hidden rounded-2xl group w-full md:flex md:flex-col md:min-h-[520px]">
                <img src="/worship.png" alt="Church worship community" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 md:absolute md:inset-0 md:w-full md:h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent md:hidden">
                  <p className="text-gray-300 hover:text-white active:text-white text-base font-semibold leading-relaxed mb-3">HWVCI is a dynamic faith community dedicated to spreading the Gospel and transforming lives through the power of Jesus Christ.</p>
                  <p className="text-gray-300 hover:text-white active:text-white text-sm leading-relaxed">Our mission is to create a welcoming space where people from all walks of life can experience God's love, grow in their faith, and become agents of positive change.</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex md:flex-col md:justify-start animate-slideInRight">
              <p className="text-lg text-foreground mb-6 leading-relaxed font-semibold">HWVCI is a dynamic faith community dedicated to spreading the Gospel and transforming lives through the power of Jesus Christ. We believe in the transformative power of faith, the importance of community, and the call to serve others with love and compassion.</p>
              <p className="text-lg text-foreground mb-8 leading-relaxed font-semibold">Our mission is to create a welcoming space where people from all walks of life can experience God's love, grow in their faith, and become agents of positive change in their communities.</p>
              <div className="space-y-4">
                {[
                  { title: 'Rooted in Scripture', desc: 'Grounded in biblical truth and Christ-centered teaching' },
                  { title: 'Community Focused', desc: 'Building meaningful relationships and serving together' },
                  { title: 'Worship Centered', desc: "Lifting our voices in praise and encountering God's presence" },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">Explore the ministries and services we offer in our main branch</p>
          </div>
          <ServiceCarousel />
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground">Be part of our vibrant community events</p>
          </div>
          <DynamicEvents />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Member Testimonies</h2>
            <p className="text-lg text-muted-foreground">Stories of transformation and faith</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Jasmine Dela Luna', quote: 'This church has become my spiritual home. The community is so welcoming and the teachings have truly transformed my walk with God.', role: 'Sunday School Teacher' },
              { name: 'Jennimae Panganiban', quote: 'I came here looking for community and found so much more. The vision and mission of this church inspire me daily to be a better person.', role: 'Member since 2020' },
              { name: 'Miggy Abad', quote: "The love and support I've received here has been incredible. This is more than just a church; it's a family united in Christ.", role: 'Worship Guitarist' },
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-smooth animate-scaleIn flex flex-col" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <span key={i} className="text-accent text-lg">★</span>)}</div>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed italic flex-grow">"{t.quote}"</p>
                <div className="border-t border-border/50 pt-6 mt-auto">
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Find answers to common questions about HWVCI</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Branches */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Church Branches</h2>
            <p className="text-lg text-muted-foreground">Visit us at any of our locations</p>
          </div>
          <BranchesCarousel />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Connect With Us</h2>
            <p className="text-lg text-muted-foreground">Follow us on social media for updates, encouragement, and community.</p>
          </div>
          <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap animate-fadeInUp">
            <a href="https://www.facebook.com/hwvciph" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base">Facebook</span>
              <span className="text-xs text-muted-foreground hidden sm:block">/hwvciph</span>
            </a>
            <a href="https://www.instagram.com/hwvci_arrowheads" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base">Instagram</span>
              <span className="text-xs text-muted-foreground hidden sm:block">@hwvci_arrowheads</span>
            </a>
            <a href="https://www.messenger.com/t/1444734995826323" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-accent/50 transition-all duration-300 min-w-[90px] sm:min-w-[120px]">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.262 2 11.5c0 2.838 1.354 5.384 3.478 7.043L5 22l3.591-1.428c.979.273 2.016.428 3.107.428 5.514 0 10-4.262 10-9.5S17.514 2 12 2z"/></svg>
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base">Messenger</span>
              <span className="text-xs text-muted-foreground hidden sm:block">m.me/hwvciph</span>
            </a>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-center items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Putatan, Muntinlupa, Metro Manila</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-2 mb-4">
                <img src="/hwvci-logo-dark-mode.png" alt="HWVCI Logo" className="w-8 h-8 object-contain rounded-lg dark:hidden" />
                <img src="/hwvci-logo-light-mode.png" alt="HWVCI Logo" className="w-8 h-8 object-contain rounded-lg hidden dark:block" />
                <span className="font-bold">HWVCI</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">House of Worship with Vision Church International</p>
              <p className="text-primary-foreground/70 text-sm mt-3">Putatan, Muntinlupa, Metro Manila</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                {navLinks.map(link => (
                  <li key={link.id}><a href={`#${link.id}`} className="hover:text-primary-foreground transition-smooth">{link.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="https://www.facebook.com/hwvciph" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg> Facebook</a></li>
                <li><a href="https://www.instagram.com/hwvci_arrowheads" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg> Instagram</a></li>
                <li><a href="https://www.messenger.com/t/1444734995826323" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-smooth inline-flex items-center gap-2"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.262 2 11.5c0 2.838 1.354 5.384 3.478 7.043L5 22l3.591-1.428c.979.273 2.016.428 3.107.428 5.514 0 10-4.262 10-9.5S17.514 2 12 2z"/></svg> Messenger</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70">
            <p>&copy; {new Date().getFullYear()} House of Worship with Vision Church International. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}