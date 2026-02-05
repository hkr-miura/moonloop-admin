"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Reservation } from "@/lib/google/sheets";
import { startOfWeek, format, eachDayOfInterval, subDays, addDays } from "date-fns";

interface OverviewChartProps {
    reservations: Reservation[];
}

export function OverviewChart({ reservations }: OverviewChartProps) {
    // Logic: Calculate visitors for the last 7 days? Or upcoming?
    // Let's show "Upcoming 7 Days" visitor count
    const today = new Date();
    const nextWeek = eachDayOfInterval({
        start: today,
        end: addDays(today, 6)
    });

    const data = nextWeek.map(date => {
        const dateKey = format(date, 'yyyy-MM-dd');
        // Sum counts for this day
        const count = reservations
            .filter(r => r.date === dateKey && r.status === 'Active')
            .reduce((sum, r) => sum + r.count, 0);

        return {
            name: format(date, 'ccc'), // Mon, Tue...
            total: count
        };
    });

    return (
        <Card className="col-span-4 bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
                <CardTitle>Upcoming Visitors</CardTitle>
                <CardDescription>
                    Expected number of guests for the next 7 days.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
