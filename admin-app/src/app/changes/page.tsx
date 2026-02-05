import { getChangeRequests, getReservations } from "@/lib/google/sheets";
import { ChangeRequestCard } from "@/components/changes/ChangeRequestCard";

export const revalidate = 60;

export default async function ChangesPage() {
    const requests = await getChangeRequests();
    const reservations = await getReservations();

    // Helper to find original reservation
    // Logic: Match Name AND Date (since we store Original Date in request)
    // Or Match Name + Email if we had it. Name + Date is distinct enough for MVP.
    const findOriginal = (name: string, date: string) => {
        return reservations.find(r =>
            r.name === name || // Loose match for MVP
            r.date === date
        );
        // Better logic: Match exact name
        return reservations.find(r => r.name === name && r.date === date);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Change Requests</h1>
                <p className="text-muted-foreground mt-1">Review and approve reservation change requests.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests.length > 0 ? (
                    requests.map((req) => {
                        const original = findOriginal(req.originalName, req.originalDate);
                        return (
                            <ChangeRequestCard
                                key={req.rowId}
                                request={req}
                                originalReservation={original}
                            />
                        );
                    })
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground bg-card/30 rounded-lg border border-white/5 h-64">
                        <p>No pending change requests.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
