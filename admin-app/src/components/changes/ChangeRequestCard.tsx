'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { processChangeRequestAction } from '@/app/actions/changes';
import { ChangeRequest, Reservation } from '@/lib/google/sheets';
import { Loader2, Check, X, ArrowRight } from 'lucide-react';

interface ChangeRequestCardProps {
    request: ChangeRequest;
    originalReservation?: Reservation; // If we can match it
}

export function ChangeRequestCard({ request, originalReservation }: ChangeRequestCardProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(request.status);

    const handleProcess = async (action: 'Approve' | 'Reject') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        setLoading(true);
        try {
            // If mocking, originalRowId might need logic to find match. 
            // In real app, we pass originalReservation?.rowId
            const result = await processChangeRequestAction(request.rowId, action, originalReservation?.rowId);
            if (result.success) {
                setStatus(action === 'Approve' ? 'Approved' : 'Rejected');
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (e) {
            console.error(e);
            alert('Error processing request');
        } finally {
            setLoading(false);
        }
    };

    if (status !== 'Pending') return null; // Hide handled requests

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex justify-between items-center">
                    <span>Change Request</span>
                    <span className="text-xs font-normal text-muted-foreground">{request.timestamp}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Guest</span>
                    <span className="font-semibold">{request.originalName}</span>
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-white/5 p-4 rounded-lg">
                    {/* Before */}
                    <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Current</p>
                        <div className="font-mono text-sm">{request.originalDate}</div>
                        {originalReservation && (
                            <div className="text-xs text-muted-foreground">
                                {originalReservation.time} ({originalReservation.count}p)
                            </div>
                        )}
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />

                    {/* After */}
                    <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider text-primary">Requested</p>
                        <div className="font-mono text-sm font-bold text-primary">{request.newDate}</div>
                        <div className="text-xs font-medium text-primary/80">
                            {request.newTime} ({request.newCount}p)
                        </div>
                    </div>
                </div>

                {request.reason && (
                    <div className="text-sm bg-red-500/10 text-red-200 p-3 rounded border border-red-500/20">
                        <span className="font-semibold block text-xs mb-1 opacity-70">Reason</span>
                        "{request.reason}"
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
                <Button
                    variant="outline"
                    className="border-red-500/30 hover:bg-red-500/20 hover:text-red-200 text-red-300"
                    onClick={() => handleProcess('Reject')}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                    Reject
                </Button>
                <Button
                    className="bg-green-600 hover:bg-green-500 text-white"
                    onClick={() => handleProcess('Approve')}
                    disabled={loading || !originalReservation}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                    Approve Change
                </Button>
            </CardFooter>
        </Card>
    );
}
