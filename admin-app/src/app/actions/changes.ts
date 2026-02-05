'use server';

import { processChangeRequest } from '@/lib/google/sheets';
import { revalidatePath } from 'next/cache';

export async function processChangeRequestAction(requestId: number, action: 'Approve' | 'Reject', originalRowId?: number) {
    try {
        const success = await processChangeRequest(requestId, action, originalRowId);
        if (success) {
            revalidatePath('/changes');
            revalidatePath('/reservations'); // Also update reservation list
            revalidatePath('/'); // And dashboard
            return { success: true };
        } else {
            return { success: false, error: 'Failed to process request' };
        }
    } catch (error) {
        console.error('Change Action Error:', error);
        return { success: false, error: 'Server error' };
    }
}
