'use server';

import { createEventForm } from '@/lib/google/forms';
import { addEvent } from '@/lib/google/sheets';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createNewEventAction(data: { title: string; date: string; time: string }) {
    try {
        // 1. Create Form
        const formResult = await createEventForm(data.title, data.date);

        // 2. Add to Sheets
        const newEvent = {
            id: uuidv4(),
            title: data.title,
            date: data.date,
            time: data.time,
            formUrl: formResult.formUrl,
            formId: formResult.formId,
            status: 'Active'
        };

        const success = await addEvent(newEvent);

        if (success) {
            revalidatePath('/events');
            return { success: true };
        } else {
            return { success: false, error: 'Failed to save event to sheet' };
        }

    } catch (error) {
        console.error('Create Event Error:', error);
        return { success: false, error: 'Failed to create event' };
    }
}
