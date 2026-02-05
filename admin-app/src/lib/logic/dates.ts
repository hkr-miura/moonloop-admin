import { startOfWeek, addWeeks, format, addDays } from 'date-fns';
import { getEvents } from '../google/sheets';

// Generate Mondays for the next N weeks
export async function generateAvailableDates(weeksAhead: number = 8): Promise<string[]> {
    const today = new Date();
    const availableDates: string[] = [];

    // Start from next Monday if today is Monday? Or just upcoming Mondays.
    // Let's say we look for Mondays starting from today.
    let current = startOfWeek(today, { weekStartsOn: 1 }); // This Monday

    // If this Monday is in the past (e.g. today is Tuesday), move to next
    if (current < today) {
        // Actually startOfWeek returns the Monday of current week. 
        // If today is Tuesday, the Monday was yesterday.
        // We probably want "Upcoming Mondays" including today if it's Monday?
        // Let's just generate N Mondays starting from "Next Monday" relative to Today just to be safe, 
        // or inclusive if today is Monday and it's early? 
        // Simplest: Generate Mondays for next N weeks starting from "This Week's Monday" 
        // and filter out those in the past.
    }

    // Let's generate 12 weeks of Mondays to be safe, pick valid ones
    for (let i = 0; i < weeksAhead + 2; i++) {
        const monday = addWeeks(current, i);
        // Format as YYYY-MM-DD for comparison, or whatever the form uses.
        // Form likely uses "YYYY/MM/DD" or "MM/DD (Mon)"? 
        // Admin spec says "YYYY-MM-DD" for internal, but form might be prettier.
        // Let's assume the form uses "YYYY-MM-DD" for now based on specification examples, 
        // OR standard Japanese format.
        // Let's use "YYYY-MM-DD" to match the Event Date format.
        const dateStr = format(monday, 'yyyy-MM-dd');

        // Filter out past dates (allow today)
        const dateObj = new Date(dateStr);
        // Just compare strings for safe future check?
        // Or simplified: Just ensure it's >= today's date string
        if (dateStr >= format(today, 'yyyy-MM-dd')) {
            availableDates.push(dateStr);
        }
    }

    // Limit to requested count
    const candidates = availableDates.slice(0, weeksAhead);

    // Fetch Events to exclude
    const events = await getEvents();
    const eventDates = new Set(events.map(e => e.date));

    // Filter
    const finalDates = candidates.filter(date => !eventDates.has(date));

    return finalDates;
}
