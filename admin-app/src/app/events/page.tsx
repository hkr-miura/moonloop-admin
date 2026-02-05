import { getEvents } from "@/lib/google/sheets";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { Card } from "@/components/ui/card";
import { Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";

export const revalidate = 60;

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
                    <p className="text-muted-foreground mt-1">Create and manage special events.</p>
                </div>
                <CreateEventModal />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id || event.title} className="bg-card/50 backdrop-blur-sm border-white/10 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                    {event.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{event.date} {event.time}</span>
                                </div>
                                {event.formUrl && (
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4" />
                                        <a href={event.formUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                            Open Form <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-card/30 rounded-lg border border-white/5">
                        <p>No events found. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
