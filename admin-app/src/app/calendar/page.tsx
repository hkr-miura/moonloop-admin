import { getReservations, getEvents } from "@/lib/google/sheets";
import { MonthView } from "@/components/calendar/MonthView";

export const revalidate = 60;

export default async function CalendarPage() {
    const reservations = await getReservations();
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground mt-1">Schedule overview.</p>
            </div>

            <MonthView reservations={reservations} events={events} />
        </div>
    );
}
