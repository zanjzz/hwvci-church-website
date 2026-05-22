'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// Initialize Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const EVENT_TYPES = [
  { value: 'Service', label: 'Service', color: '#3b82f6' },
  { value: 'Prayer', label: 'Prayer', color: '#8b5cf6' },
  { value: 'Study', label: 'Study', color: '#10b981' },
  { value: 'Fellowship', label: 'Fellowship', color: '#f59e0b' },
  { value: 'Conference', label: 'Conference', color: '#ef4444' },
];

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'Service',
    start_date: '',
    end_date: '',
    location: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    } else {
      setEvents(data || []);
    }
    setIsLoading(false);
  };

  const handleLogin = () => {
    if (!ADMIN_PASSWORD) {
      setMessage({ type: 'error', text: 'Admin password not configured!' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchEvents();
      setMessage({ type: 'success', text: 'Logged in successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Wrong password!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Handle form submit - STORE AS LOCAL STRING (no timezone conversion!)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const duration_minutes = Math.round((end.getTime() - start.getTime()) / 60000);

    // Store exactly as entered - append local timezone indicator
    const eventData = {
      title: formData.title,
      description: formData.description || null,
      event_type: formData.event_type,
      start_date: formData.start_date + ':00+08:00', // Force Philippines timezone
      end_date: formData.end_date + ':00+08:00',
      duration_minutes: duration_minutes > 0 ? duration_minutes : null,
      location: formData.location || null,
      is_featured: false,
    };

    let error;
    if (editingEvent) {
      const { error: updateError } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editingEvent.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('events')
        .insert([eventData]);
      error = insertError;
    }

    if (error) {
      setMessage({ type: 'error', text: `Failed to ${editingEvent ? 'update' : 'create'} event: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: `Event ${editingEvent ? 'updated' : 'created'} successfully!` });
      setShowAddForm(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
      setTimeout(() => setMessage(null), 3000);
    }
    setIsLoading(false);
  };

  const handleDelete = async (event: any) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id);

    if (error) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      fetchEvents();
      setTimeout(() => setMessage(null), 3000);
    }
    setIsLoading(false);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    // Extract just the date and time without timezone
    const startLocal = event.start_date.slice(0, 16);
    const endLocal = event.end_date.slice(0, 16);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      start_date: startLocal,
      end_date: endLocal,
      location: event.location || '',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'Service',
      start_date: '',
      end_date: '',
      location: '',
    });
    setEditingEvent(null);
  };

  // Display date exactly as stored
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila' // Force Philippines timezone for display
    });
  };

  const getEventTypeColor = (type: string) => {
    const eventType = EVENT_TYPES.find(et => et.value === type);
    return eventType?.color || '#3b82f6';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 via-background to-background">
        <div className="bg-card p-8 rounded-2xl shadow-2xl border border-accent/20 w-full max-w-md animate-fadeInUp">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-muted-foreground mt-2">Enter password to manage events</p>
          </div>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 animate-slideIn ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
              {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}
          
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 mb-4"
          />
          
          <button
            onClick={handleLogin}
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">Event Manager</h1>
            <p className="text-muted-foreground mt-1">Manage your church events</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
                setEditingEvent(null);
              }}
              className="bg-accent text-accent-foreground px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/20 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slideIn ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
              <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                    placeholder="Sunday Worship Service"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                    rows={3}
                    placeholder="Join us for worship, prayer, and biblical teaching..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Event Type *</label>
                    <select
                      required
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                    >
                      {EVENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                      placeholder="Main Sanctuary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">End Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-accent text-accent-foreground py-2 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isLoading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="flex-1 bg-muted text-foreground py-2 rounded-xl font-semibold hover:bg-muted/80 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading && !showAddForm ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border animate-fadeInUp">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No events yet. Click "Add Event" to create one.</p>
              </div>
            ) : (
              events.map((event, index) => (
                <div 
                  key={event.id} 
                  className="group bg-card border border-border rounded-xl p-4 hover:border-accent hover:shadow-xl transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span 
                          className="text-xs font-semibold px-2 py-1 rounded-full transition-all duration-200 group-hover:scale-105"
                          style={{ backgroundColor: `${getEventTypeColor(event.event_type)}20`, color: getEventTypeColor(event.event_type) }}
                        >
                          {event.event_type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors duration-200">{event.title}</h3>
                      
                      {event.description && (
                        <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-all duration-200 hover:scale-110"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all duration-200 hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}