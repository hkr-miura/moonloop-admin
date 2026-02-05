import { getReservations } from "@/lib/google/sheets";
import { ReservationList } from "@/components/reservations/ReservationList";

export const dynamic = 'force-dynamic';

export default async function ReservationsPage() {
    const reservations = await getReservations();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
                <p className="text-muted-foreground mt-1">Manage and view all reservation requests.</p>
            </div>

            <ReservationList reservations={reservations} />
        </div>
    );
}
