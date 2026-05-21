'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Event {
  id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date: string
  duration_minutes: number
  location: string
  is_featured: boolean
}

const typeColors: Record<string, { bg: string; text: string }> = {
  Service: { bg: 'bg-accent/10', text: 'text-accent' },
  Prayer: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  Study: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
  Fellowship: { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
  Conference: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
}

export function DynamicEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start_date', { ascending: true })

        if (error) {
          console.error('[v0] Error fetching events:', error)
          setError(error.message)
          return
        }

        console.log('[v0] Events fetched:', data)
        setEvents(data || [])
      } catch (err) {
        console.error('[v0] Unexpected error:', err)
        setError('Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg text-destructive">
        <p className="font-semibold">Error loading events</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No events scheduled at the moment.</p>
        <p className="text-sm mt-2">Check back soon for upcoming events!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="p-6 sm:p-8 bg-card border border-border rounded-xl hover:border-accent hover:shadow-lg transition-smooth animate-fadeInUp"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-full space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{event.title}</h3>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                  typeColors[event.event_type]?.bg || 'bg-muted'
                } ${typeColors[event.event_type]?.text || 'text-muted-foreground'}`}
              >
                {event.event_type}
              </span>
            </div>
            
            {event.description && (
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Date & Time</p>
                <p className="text-foreground font-semibold">
                  {new Date(event.start_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-foreground font-semibold">
                  {new Date(event.start_date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {event.duration_minutes && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Duration</p>
                  <p className="text-foreground font-semibold">
                    {event.duration_minutes < 60
                      ? `${event.duration_minutes} minutes`
                      : `${Math.floor(event.duration_minutes / 60)}h ${event.duration_minutes % 60}m`}
                  </p>
                </div>
              )}
              {event.location && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Location</p>
                  <p className="text-foreground font-semibold break-words">{event.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
