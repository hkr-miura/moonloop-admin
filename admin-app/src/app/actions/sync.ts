'use server';

import { generateAvailableDates } from '@/lib/logic/dates';
import { updateFormChoices } from '@/lib/google/forms';
import { revalidatePath } from 'next/cache';

const NORMAL_FORM_ID = process.env.NORMAL_RESERVATION_FORM_ID;

export async function syncFormOptionsAction() {
    if (!NORMAL_FORM_ID) {
        return { success: false, error: 'NORMAL_RESERVATION_FORM_ID is not defined' };
    }

    try {
        // 1. Generate Logic
        const dates = await generateAvailableDates(8); // Next 8 weeks
        if (dates.length === 0) {
            return { success: false, error: 'No available dates generated' };
        }

        // 2. Update Form
        // Assuming the question title is "ご希望の日にち" or similar. 
        // We should probably make this configurable or find by index if title changes.
        // For MVP, title is fine.
        const QUESTION_TITLE = "ご希望の日にち (Preferred Date)";
        // Need to match exact title in real form. Let's assume standard "ご希望の日にち" based on typical usage
        // Or "ご希望の日にち"
        const result = await updateFormChoices(NORMAL_FORM_ID, "ご希望の日にち", dates);

        if (result) {
            revalidatePath('/settings');
            return { success: true, syncedDates: dates };
        } else {
            return { success: false, error: 'Failed to update form via API' };
        }

    } catch (error) {
        console.error("Sync Action Error:", error);
        return { success: false, error: 'Server error during sync' };
    }
}
