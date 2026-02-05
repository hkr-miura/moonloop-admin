"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reservation, Event } from "@/lib/google/sheets";

interface MonthViewProps {
    reservations: Reservation[];
    events: Event[];
}

export function MonthView({ reservations, events }: MonthViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous Month">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next Month">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="bg-zinc-900/50 p-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {day}
                    </div>
                ))}

                {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayReservations = reservations.filter(r => r.date === dateKey && r.status === 'Active');
                    const dayEvents = events.filter(e => e.date === dateKey);

                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                        <div
                            key={day.toISOString()}
                            className={`min-h-[100px] bg-zinc-950/50 p-2 hover:bg-white/5 transition-colors ${!isCurrentMonth ? 'opacity-30' : ''}`}
                        >
                            <div className="text-right text-xs text-muted-foreground mb-1">
                                <span className={isSameDay(day, new Date()) ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center ml-auto" : ""}>
                                    {format(day, "d")}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {dayEvents.map(e => (
                                    <div key={e.id || e.title} className="text-[10px] bg-purple-500/20 text-purple-200 px-1 py-0.5 rounded border border-purple-500/30 truncate">
                                        ★ {e.title}
                                    </div>
                                ))}

                                {dayReservations.length > 0 && (
                                    <div className="text-[10px] space-y-0.5">
                                        {dayReservations.slice(0, 3).map((r, i) => (
                                            <div key={i} className="flex items-center gap-1 text-zinc-300">
                                                <User className="h-2 w-2" />
                                                <span className="truncate max-w-[80%]">{r.name}</span>
                                            </div>
                                        ))}
                                        {dayReservations.length > 3 && (
                                            <div className="text-muted-foreground pl-3">
                                                + {dayReservations.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
