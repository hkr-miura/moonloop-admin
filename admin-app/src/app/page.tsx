import { getReservations } from "@/lib/google/sheets";
import { ReservationList } from "@/components/reservations/ReservationList";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Inbox, AlertCircle } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const reservations = await getReservations();
  const reservationCount = reservations.length;
  // Simple logic to count "active" reservations or similar could go here

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Reservation Summary */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coming Reservations</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-sans">{reservationCount}</div>
          <p className="text-xs text-muted-foreground">
            Total recorded
          </p>
        </CardContent>
      </Card>

      {/* Events Summary */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Events</CardTitle>
          <Users className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-sans">--</div>
          <p className="text-xs text-muted-foreground">
            (Coming Soon)
          </p>
        </CardContent>
      </Card>

      {/* Change Requests */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Change Requests</CardTitle>
          <Inbox className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-sans">--</div>
          <p className="text-xs text-muted-foreground">
            (Coming Soon)
          </p>
        </CardContent>
      </Card>

      {/* Opinions */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Opinions</CardTitle>
          <AlertCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-sans">--</div>
          <p className="text-xs text-muted-foreground">
            (Coming Soon)
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity / List & KPI */}
      <div className="col-span-4 mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <OverviewChart reservations={reservations} />
        </div>
        <div className="col-span-3">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground/90">Recent Reservations</h2>
          <ReservationList reservations={reservations.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
