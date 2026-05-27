import type { Reminder } from '@/types'

/** Returns demo entries with dates computed relative to today,
 *  so the "days until" labels always look realistic. */
export function getDemoReminders(): Reminder[] {
  function date(daysFromNow: number, year: number): string {
    const d = new Date()
    d.setDate(d.getDate() + daysFromNow)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${m}-${day}`
  }

  return [
    { id: 'demo-1',  name: "Sarah's Birthday",          icon: '🎂', date: date(0,   1990), tags: ['Family', 'Friends'], createdAt: 0 },
    { id: 'demo-2',  name: 'Marcus & Priya Anniversary', icon: '💍', date: date(1,   2015), tags: ['Family'],            createdAt: 0 },
    { id: 'demo-3',  name: "Emma's Graduation",          icon: '🎓', date: date(4,   2002), tags: ['Friends', 'College'],createdAt: 0 },
    { id: 'demo-4',  name: "Dad's Dentist Appointment",  icon: '🦷', date: date(10,  1960), tags: ['Family'],            createdAt: 0 },
    { id: 'demo-5',  name: "Liam's Birthday",            icon: '🥳', date: date(18,  1988), tags: ['Friends'],           createdAt: 0 },
    { id: 'demo-6',  name: 'Europe Trip Departure',      icon: '✈️', date: date(32,  2026), tags: ['Friends'],           createdAt: 0 },
    { id: 'demo-7',  name: "Sophia's Work Anniversary",  icon: '🏆', date: date(75,  2019), tags: ['Work'],              createdAt: 0 },
    { id: 'demo-8',  name: 'Jake & Mia Anniversary',     icon: '❤️', date: date(120, 2018), tags: ['Family'],            createdAt: 0 },
    { id: 'demo-9',  name: "Isabella's Birthday",        icon: '🎈', date: date(200, 1983), tags: ['Friends'],           createdAt: 0 },
    { id: 'demo-10', name: 'Family Christmas Dinner',    icon: '🎆', date: date(310, 2026), tags: ['Family'],            createdAt: 0 },
  ]
}
