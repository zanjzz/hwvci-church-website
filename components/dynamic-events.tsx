"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock, MapPin } from "lucide-react";

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  duration_minutes: number;
  location: string;
  is_featured: boolean;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  Service: { bg: "bg-accent/10", text: "text-accent" },
  Prayer: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
  },
  Study: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
  },
  Fellowship: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  Conference: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
  },
};

export function DynamicEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("start_date", { ascending: true });

        if (error) {
          console.error("[v0] Error fetching events:", error);
          setError(error.message);
          return;
        }

        console.log("[v0] Events fetched:", data);
        setEvents(data || []);
      } catch (err) {
        console.error("[v0] Unexpected error:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Format date & time with Philippines timezone
  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Manila",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      }),
    };
  };

  // Compare two dates (ignoring time) to see if they are the same day
  const isSameDay = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg text-destructive">
        <p className="font-semibold">Error loading events</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No events scheduled at the moment.</p>
        <p className="text-sm mt-2">Check back soon for upcoming events!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const start = formatEventDateTime(event.start_date);
        const end = formatEventDateTime(event.end_date);
        const sameDate = isSameDay(event.start_date, event.end_date);

        // Date range display: single date or start - end
        const dateDisplay = sameDate
          ? start.date
          : `${start.date} - ${end.date}`;

        return (
          <div
            key={event.id}
            className="group p-6 sm:p-8 bg-card border border-border rounded-xl hover:border-accent hover:shadow-xl transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-full space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-bold text-foreground">
                  {event.title}
                </h3>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                    typeColors[event.event_type]?.bg || "bg-muted"
                  } ${typeColors[event.event_type]?.text || "text-muted-foreground"}`}
                >
                  {event.event_type}
                </span>
              </div>

              {event.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                {/* Date column (shows range if needed) */}
                <div className="flex items-center gap-3 group/item">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {sameDate ? "Date" : "Date Range"}
                    </p>
                    <p className="text-foreground font-medium">{dateDisplay}</p>
                  </div>
                </div>

                {/* Start Time */}
                <div className="flex items-center gap-3 group/item">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Start Time
                    </p>
                    <p className="text-foreground font-medium">{start.time}</p>
                  </div>
                </div>

                {/* End Time */}
                <div className="flex items-center gap-3 group/item">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      End Time
                    </p>
                    <p className="text-foreground font-medium">{end.time}</p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Location
                      </p>
                      <p className="text-foreground font-medium break-words">
                        {event.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
