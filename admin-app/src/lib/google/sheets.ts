import { google } from 'googleapis';
import { getAuthClient } from './auth';

export type Reservation = {
    rowId: number; // 0-indexed row number for updates
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    count: number;
    remarks: string;
    status: string;
};

// Spreadsheet IDs should be environmental variables
const RESERVATION_SPREADSHEET_ID = process.env.NORMAL_RESERVATION_SHEET_ID;

export async function getReservations(): Promise<Reservation[]> {
    if (!RESERVATION_SPREADSHEET_ID) {
        console.error('NORMAL_RESERVATION_SHEET_ID is not defined in environment variables');
        return [];
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // 1. Get Spreadsheet Metadata to find the correct sheet name
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: RESERVATION_SPREADSHEET_ID,
        });

        const sheetsList = meta.data.sheets;
        if (!sheetsList || sheetsList.length === 0) {
            console.error('No sheets found in the spreadsheet');
            return [];
        }

        // Try to find a sheet that looks like form responses
        let targetSheetTitle = sheetsList[0].properties?.title;
        const responseSheet = sheetsList.find(s =>
            s.properties?.title?.includes('Form Responses') ||
            s.properties?.title?.includes('フォームの回答') ||
            s.properties?.title?.includes('回答')
        );

        if (responseSheet?.properties?.title) {
            targetSheetTitle = responseSheet.properties.title;
        }

        console.log(`Using sheet: ${targetSheetTitle}`);

        // 2. Fetch Data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: RESERVATION_SPREADSHEET_ID,
            range: `${targetSheetTitle}!A2:N`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        // Map rows to Reservation object
        // Columns based on form (0-indexed in array): 
        // 0: Timestamp (A)
        // 1: Name (B)
        // 2: Email (C)
        // 3: Phone (D)
        // 4: Date (E)
        // ...
        // Let's assume we store Status in Column H (Index 7, A1 notation H) to avoid conflict with future form questions.
        // And Remarks in Column G (Index 6)
        return rows.map((row, index) => ({
            rowId: index + 2, // 1-header + 1-index
            timestamp: row[0] || '',
            name: row[1] || '',
            email: row[2] || '',
            phone: row[3] || '',
            date: row[4] || '',
            time: row[5] || '', // Placeholder if time is separate
            count: parseInt(row[6] || '0', 10), // Placeholder
            remarks: row[6] || '',
            status: row[7] || 'Active',
        }));
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}

export async function updateReservationStatus(rowId: number, status: string): Promise<boolean> {
    if (!RESERVATION_SPREADSHEET_ID) return false;

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // Find the sheet name again (or cache it - simpler to just fetch for safety in this iteration)
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: RESERVATION_SPREADSHEET_ID,
        });

        const sheetsList = meta.data.sheets;
        if (!sheetsList || sheetsList.length === 0) return false;

        let targetSheetTitle = sheetsList[0].properties?.title;
        const responseSheet = sheetsList.find(s =>
            s.properties?.title?.includes('Form Responses') ||
            s.properties?.title?.includes('フォームの回答') ||
            s.properties?.title?.includes('回答')
        );

        if (responseSheet?.properties?.title) {
            targetSheetTitle = responseSheet.properties.title;
        }

        // Update Column H (Index 7) for the specific row
        // A=0, B=1, ... H=7
        // Range: Sheet!H{rowId}
        const range = `${targetSheetTitle}!H${rowId}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: RESERVATION_SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[status]],
            },
        });

        console.log(`Updated Row ${rowId} status to ${status}`);
        return true;

    } catch (error) {
        console.error('Error updating reservation status:', error);
        return false;
    }
}

// Event Type
export type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    formUrl: string;
    formId: string;
    status: string;
};

// Event Spreadsheet ID
const EVENT_SPREADSHEET_ID = process.env.EVENT_RESERVATION_SHEET_ID || process.env.GOOGLE_SHEET_ID_EVENTS;

export async function getEvents(): Promise<Event[]> {
    if (!EVENT_SPREADSHEET_ID) {
        console.error('EVENT_RESERVATION_SHEET_ID is not defined');
        return [];
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // Assuming the first sheet is the master list. 
        // If it was created by init_resources, it might be named "Events | MOON LOOP"
        // Let's first get metadata to be safe or just try index 0.
        // For robustness, let's just grab the first sheet's name.
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: EVENT_SPREADSHEET_ID,
        });

        // If sheet is empty/new, it might not have the correct header or name yet. 
        // We assume init_resources created it.
        const sheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Sheet1';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: EVENT_SPREADSHEET_ID,
            range: `${sheetTitle}!A2:G`, // ID, Title, Date, Time, FormURL, FormID, Status
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        return rows.map((row) => ({
            id: row[0] || '',
            title: row[1] || '',
            date: row[2] || '',
            time: row[3] || '',
            formUrl: row[4] || '',
            formId: row[5] || '',
            status: row[6] || 'Active',
        }));

    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function addEvent(event: Event): Promise<boolean> {
    if (!EVENT_SPREADSHEET_ID) return false;

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: EVENT_SPREADSHEET_ID,
        });
        const sheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Sheet1';

        await sheets.spreadsheets.values.append({
            spreadsheetId: EVENT_SPREADSHEET_ID,
            range: `${sheetTitle}!A:G`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[
                    event.id,
                    event.title,
                    event.date,
                    event.time,
                    event.formUrl,
                    event.formId,
                    event.status
                ]],
            },
        });
        return true;
    } catch (error) {
        console.error('Error adding event:', error);
        return false;
    }
}

// Change Request Type
export type ChangeRequest = {
    rowId: number;
    timestamp: string;
    originalName: string;
    originalDate: string; // The user claims this is their old date
    newDate: string;
    newTime: string;
    newCount: number;
    reason: string;
    status: string; // Pending, Approved, Rejected
};

const CHANGE_REQUEST_SPREADSHEET_ID = process.env.CHANGE_RESERVATION_SHEET_ID;

export async function getChangeRequests(): Promise<ChangeRequest[]> {
    if (!CHANGE_REQUEST_SPREADSHEET_ID) {
        console.error('CHANGE_RESERVATION_SHEET_ID is not defined');
        return [];
    }

    // ... Fetch logic similar to getReservations ...
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId: CHANGE_REQUEST_SPREADSHEET_ID });
        const sheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Sheet1';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: CHANGE_REQUEST_SPREADSHEET_ID,
            range: `${sheetTitle}!A2:H`, // Adjust range
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        // Mapping based on typical form: 
        // Timestamp, Name, OriginalDate, NewDate, Time, Count, Reason, Status (if added manually)
        return rows.map((row, index) => ({
            rowId: index + 2,
            timestamp: row[0] || '',
            originalName: row[1] || '',
            originalDate: row[2] || '',
            newDate: row[3] || '',
            newTime: row[4] || '',
            newCount: parseInt(row[5] || '0', 10),
            reason: row[6] || '',
            status: row[7] || 'Pending',
        })).filter(req => req.status === 'Pending'); // Only show pending by default? Or all? Let's filter in UI.

    } catch (error) {
        console.error('Error fetching change requests:', error);
        return [];
    }
}

export async function processChangeRequest(requestId: number, action: 'Approve' | 'Reject', originalRowId?: number): Promise<boolean> {
    if (!CHANGE_REQUEST_SPREADSHEET_ID) return false;
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // 1. Update Status in Change Request Sheet
        // Assuming Status is Col H (Index 7)
        const meta = await sheets.spreadsheets.get({ spreadsheetId: CHANGE_REQUEST_SPREADSHEET_ID });
        const sheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Sheet1';

        await sheets.spreadsheets.values.update({
            spreadsheetId: CHANGE_REQUEST_SPREADSHEET_ID,
            range: `${sheetTitle}!H${requestId}`,
            valueInputOption: 'RAW',
            requestBody: { values: [[action === 'Approve' ? 'Approved' : 'Rejected']] },
        });

        // 2. If Approved, Update Original Reservation
        if (action === 'Approve' && originalRowId && RESERVATION_SPREADSHEET_ID) {
            // We need to know what to update. 
            // In a real scenario, we'd take the New Date, New Time, New Count from the request
            // And update the original row.
            // For now, let's assume the caller passes the new details or we fetch them again.
            // Simplified: The caller handles the logic of WHAT to update, or we do it here.
            // Let's do it here: fetch the request to get new details.

            // Re-fetch the specific request row to get data
            const reqResp = await sheets.spreadsheets.values.get({
                spreadsheetId: CHANGE_REQUEST_SPREADSHEET_ID,
                range: `${sheetTitle}!A${requestId}:G${requestId}`,
            });
            const reqData = reqResp.data.values?.[0];

            if (reqData) {
                // newDate=3, newTime=4, newCount=5
                const newDate = reqData[3];
                const newTime = reqData[4];
                const newCount = reqData[5];

                // Update Original Reservation
                // Date=E (Col 4), Time=F (Col 5), Count=G (Col 6)
                // We need to target the correct columns.
                // Assuming standard form: Timestamp(A), Name(B), Email(C), Phone(D), Date(E), Time(F), Count(G)

                const resMeta = await sheets.spreadsheets.get({ spreadsheetId: RESERVATION_SPREADSHEET_ID });
                const resSheetTitle = resMeta.data.sheets?.[0]?.properties?.title || 'Sheet1'; // Simplified lookup

                // Batch update or individual? Individual is fine.
                // Update Date (E)
                await sheets.spreadsheets.values.update({
                    spreadsheetId: RESERVATION_SPREADSHEET_ID,
                    range: `${resSheetTitle}!E${originalRowId}:G${originalRowId}`,
                    valueInputOption: 'RAW',
                    requestBody: { values: [[newDate, newTime, newCount]] },
                });
                console.log(`Updated Original Reservation Row ${originalRowId}`);
            }
        }

        return true;
    } catch (e) {
        console.error('Error processing change request:', e);
        return false;
    }
}

// Opinion Type
export type Opinion = {
    rowId: number;
    timestamp: string;
    content: string;
    attributes: string; // e.g. Age, Gender if collected
    status: string; // Read/Unread
};

const OPINION_BOX_SHEET_ID = process.env.OPINION_BOX_SHEET_ID;

export async function getOpinions(): Promise<Opinion[]> {
    if (!OPINION_BOX_SHEET_ID) {
        console.error('OPINION_BOX_SHEET_ID is not defined');
        return [];
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId: OPINION_BOX_SHEET_ID });
        const sheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Sheet1';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: OPINION_BOX_SHEET_ID,
            range: `${sheetTitle}!A2:E`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        return rows.map((row, index) => ({
            rowId: index + 2,
            timestamp: row[0] || '',
            content: row[1] || '',
            attributes: row[2] || '',
            status: row[3] || 'Unread',
        }));
    } catch (error) {
        console.error('Error fetching opinions:', error);
        return [];
    }
}
