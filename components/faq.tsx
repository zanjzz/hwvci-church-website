'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'What time is the Sunday service at the main branch?',
    answer: 'Our Sunday worship service begins at 9:30 AM and ends at 12:00 PM. We encourage you to arrive 15 minutes early for fellowship and preparation.'
  },
  {
    id: 2,
    question: 'Is HWVCI open to everyone?',
    answer: 'Absolutely. HWVCI welcomes everyone regardless of their background, beliefs, or life circumstances. We are a community of faith where all are valued and accepted. Join us at any time.'
  },
  {
    id: 3,
    question: 'Do you have parking available?',
    answer: 'At our main branch, we have ample free parking available in our lot. For those with mobility challenges, designated accessible parking spaces are located near the main entrance.'
  },
  {
    id: 4,
    question: 'Can I attend online services?',
    answer: 'We stream our Sunday services online via Facebook Live for those who are unable to attend in person. Visit our Facebook page to join the livestream.'
  },
  {
    id: 5,
    question: 'Does the church have events?',
    answer: 'Yes, we hold various church events from time to time, and we also participate in community events. Visit our website or social media pages to stay updated on upcoming activities.'
  },
  {
    id: 6,
    question: 'Are there programs for children and youth?',
    answer: 'Yes, we offer age-appropriate programs for children and youth including Sunday school, youth fellowship, and summer camps. We provide a safe and nurturing environment for young people to grow spiritually.'
  },
]

export function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, idx) => (
        <div
          key={faq.id}
          className="animate-fadeInUp border border-border rounded-lg overflow-hidden transition-smooth hover:border-accent"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <button
            onClick={() => toggleFAQ(faq.id)}
            className="w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-card hover:bg-muted/50 transition-smooth text-left"
          >
            <h3 className="text-lg font-bold text-foreground pr-4">{faq.question}</h3>
            <ChevronDown
              className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                expandedId === faq.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedId === faq.id ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 sm:px-8 py-5 bg-muted/30 border-t border-border">
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
