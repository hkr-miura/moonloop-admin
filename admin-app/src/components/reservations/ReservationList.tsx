'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Reservation } from '@/lib/google/sheets';
import { ReservationDetailModal } from './ReservationDetailModal';

interface ReservationListProps {
    reservations: Reservation[];
}

export function ReservationList({ reservations }: ReservationListProps) {
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (res: Reservation) => {
        setSelectedReservation(res);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedReservation(null), 200); // Clear after animation
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-blue-500/10 text-blue-400';
            case 'cancelled': return 'bg-red-500/10 text-red-400';
            case 'active': return 'bg-green-500/10 text-green-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <>
            <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3">Date & Time</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length > 0 ? (
                                reservations.map((res) => (
                                    <tr
                                        key={res.rowId}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer focus:bg-white/10 outline-none"
                                        onClick={() => handleRowClick(res)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleRowClick(res);
                                            }
                                        }}
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            <div className="text-foreground">{res.name}</div>
                                            <div className="text-xs text-muted-foreground">{res.count} Guests</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{res.date}</div>
                                            <div className="text-xs text-muted-foreground">{res.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-foreground">{res.email}</div>
                                            <div className="text-xs text-muted-foreground">{res.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                        No reservations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ReservationDetailModal
                reservation={selectedReservation}
                open={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
