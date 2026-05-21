'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Phone, Clock } from 'lucide-react'

interface Branch {
  id: number
  name: string
  location: string
  address: string
  serviceTime: string
  image: string  
}

const branches: Branch[] = [
  {
    id: 1,
    name: 'HWVCI Muntinlupa (Main Branch)',
    location: 'Philippines',
    address: '92RV+77P, Putatan, Muntinlupa, Metro Manila',
    serviceTime: 'Sundays 9:30 AM - 12:00 PM',
    image: '/branches/muntinlupa.png'  
  },
  {
    id: 2,
    name: 'HWVCI Las Piñas',
    location: 'Philippines',
    address: 'C2G2+FWR, Las Piñas, 1740 Metro Manila',
    serviceTime: '...',
    image: '/branches/laspinas.png'  
  },
  {
    id: 3,
    name: 'HWVCI Bicol',
    location: 'Philippines',
    address: '2PXV+9R, Legazpi City, Albay',
    serviceTime: '...',
    image: '/branches/bicol.png'  
  },
  {
    id: 4,
    name: 'HWVCI Batangas',
    location: 'Philippines',
    address: 'R8HQ+GCV, San Juan, Batangas',
    serviceTime: '...',
    image: '/branches/batangas.png'  
  },
   {
    id: 5,
    name: 'HWVCI Mie',
    location: 'Japan',
    address: '3 Chome-2-6 Nomachinaka, Suzuka, Mie 510-0216, Japan',
    serviceTime: '...',
    image: '/branches/mie.png'  
  },
   {
    id: 6,
    name: 'HWVCI Anjo',
    location: 'Japan',
    address: 'Ikenishi-69 Ikeuracho, Anjo, Aichi 446-0066, Japan',
    serviceTime: '...',
    image: '/branches/anjo.png'  
  },
]

export function BranchesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isDraggingRef = useRef(false)

  // Auto-scroll logic
  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % branches.length)
      }, 5000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isAutoPlaying, branches.length])

  const resetAutoPlayTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % branches.length)
      }, 5000)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % branches.length)
    resetAutoPlayTimer()
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + branches.length) % branches.length)
    resetAutoPlayTimer()
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    resetAutoPlayTimer()
  }

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart === 0 || touchEnd === 0) return
    
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    
    isDraggingRef.current = true
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    setTouchEnd(e.clientX)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) {
      isDraggingRef.current = false
      return
    }
    
    if (touchStart !== 0 && touchEnd !== 0) {
      const diff = touchStart - touchEnd
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide()
        } else {
          prevSlide()
        }
      }
    }
    
    isDraggingRef.current = false
    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div 
      className="w-full select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="relative overflow-hidden">
        <div className="relative h-96">
          {branches.map((branch, index) => (
            <div
              key={branch.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: index === currentIndex ? 1 : 0,
              }}
            >
              <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-15 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-8 md:p-20 backdrop-blur-sm animate-fadeInUp">
                <div className="flex flex-col justify-center pr-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {branch.name}
                      </h3>
                      <p className="text-accent font-semibold text-lg">{branch.location}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                        <p className="text-foreground font-semibold">{branch.address}</p>
                      </div>
  
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                        <p className="text-foreground font-semibold">{branch.serviceTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Section - Updated */}
                <div className="hidden md:flex items-center justify-center rounded-xl overflow-hidden">
                  <img 
                    src={branch.image} 
                    alt={branch.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outside arrows + dots */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          aria-label="Previous branch"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {branches.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-smooth ${
              index === currentIndex ? 'bg-accent w-8' : 'bg-muted w-3 hover:bg-muted-foreground'
            }`}
            aria-label={`Go to branch ${index + 1}`}
          />
        ))}

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          aria-label="Next branch"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}