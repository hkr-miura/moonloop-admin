'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { updateReservationStatusAction } from '@/app/actions';
import { Reservation } from '@/lib/google/sheets';
import { ChevronDown, Loader2 } from 'lucide-react';

interface ReservationDetailModalProps {
    reservation: Reservation | null;
    open: boolean;
    onClose: () => void;
}

const STATUS_OPTIONS = ['Active', 'Completed', 'Cancelled', 'No Show'];

export function ReservationDetailModal({ reservation, open, onClose }: ReservationDetailModalProps) {
    const [loading, setLoading] = useState(false);

    if (!reservation) return null;

    const [status, setStatus] = useState(reservation.status || 'Active');

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await updateReservationStatusAction(reservation.rowId, status);
            if (result.success) {
                onClose();
            } else {
                alert('Failed to update status');
            }
        } catch (e) {
            console.error(e);
            alert('Error updating status');
        } finally {
            setLoading(false);
        }
    };

    const statusColors: { [key: string]: string } = {
        'Active': 'text-green-400',
        'Completed': 'text-blue-400',
        'Cancelled': 'text-red-400',
        'No Show': 'text-gray-400',
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-light tracking-wide">Reservation Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground text-right">Name</span>
                        <span className="col-span-3 font-medium text-lg">{reservation.name}</span>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground text-right">Contact</span>
                        <div className="col-span-3 flex flex-col">
                            <span>{reservation.email}</span>
                            <span className="text-sm text-muted-foreground">{reservation.phone}</span>
                        </div>
                    </div>

                    {/* Reservation Info */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground text-right">Date/Time</span>
                        <div className="col-span-3 flex flex-col">
                            <span className="font-mono">{reservation.date}</span>
                            <span className="text-sm text-muted-foreground">{reservation.time}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground text-right">Guests</span>
                        <span className="col-span-3">{reservation.count} People</span>
                    </div>

                    {/* Status Selector */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground text-right">Status</span>
                        <div className="col-span-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                                        <span className={statusColors[status] || 'text-white'}>{status}</span>
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
                                    {STATUS_OPTIONS.map((opt) => (
                                        <DropdownMenuItem
                                            key={opt}
                                            onClick={() => setStatus(opt)}
                                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                                        >
                                            {opt}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Remarks */}
                    {reservation.remarks && (
                        <div className="border-t border-white/10 pt-4 mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                            <p className="text-sm italic text-white/80">{reservation.remarks}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} className="hover:bg-white/10 hover:text-white">
                        Close
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-white text-black hover:bg-white/90">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
