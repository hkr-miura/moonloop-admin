'use server';

import { updateReservationStatus } from '@/lib/google/sheets';
import { revalidatePath } from 'next/cache';

export async function updateReservationStatusAction(rowId: number, status: string) {
    try {
        const success = await updateReservationStatus(rowId, status);
        if (success) {
            revalidatePath('/');
            return { success: true };
        } else {
            return { success: false, error: 'Failed to update status' };
        }
    } catch (error) {
        console.error('Action Error:', error);
        return { success: false, error: 'Server error' };
    }
}
