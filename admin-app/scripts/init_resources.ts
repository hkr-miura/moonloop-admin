import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!FOLDER_ID) {
    console.error('❌ GOOGLE_DRIVE_FOLDER_ID is missing in .env.local');
    process.exit(1);
}

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/forms.body',
    ],
});

const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });
const forms = google.forms({ version: 'v1', auth });

async function createSheet(title: string) {
    console.log(`Creation request (via Drive API) for: ${title}`);
    try {
        const fileMetadata = {
            name: title,
            parents: [FOLDER_ID!],
            mimeType: 'application/vnd.google-apps.spreadsheet',
        };

        const file = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        const fileId = file.data.id!;
        console.log(`✅ Created Sheet (via Drive): ${title} (${fileId})`);
        return fileId;
    } catch (e: any) {
        console.error(`Failed during sheet creation via Drive for ${title}:`, e.message);
        if (e.response) {
            console.error('API Error Details:', JSON.stringify(e.response.data, null, 2));
        }
        throw e;
    }
}

async function createForm(title: string, destinationSheetId: string) {
    // 1. Create Form
    const form = await forms.forms.create({
        requestBody: {
            info: { title, documentTitle: title },
        },
    });
    const formId = form.data.formId!;

    // 2. Move to folder
    await drive.files.update({
        fileId: formId,
        addParents: FOLDER_ID,
    });

    // 3. Add Basic Questions
    await forms.forms.batchUpdate({
        formId,
        requestBody: {
            requests: [
                {
                    createItem: {
                        item: {
                            title: "お名前",
                            questionItem: { question: { required: true, textQuestion: {} } },
                        },
                        location: { index: 0 },
                    },
                },
                {
                    createItem: {
                        item: {
                            title: "メールアドレス",
                            questionItem: { question: { required: true, textQuestion: {} } },
                        },
                        location: { index: 1 },
                    },
                },
                {
                    createItem: {
                        item: {
                            title: "電話番号",
                            questionItem: { question: { required: true, textQuestion: {} } },
                        },
                        location: { index: 2 },
                    },
                },
                {
                    createItem: {
                        item: {
                            title: "ご希望の日にち",
                            questionItem: {
                                question: {
                                    required: true,
                                    choiceQuestion: { type: 'DROP_DOWN', options: [{ value: '2026年02月09日' }] }
                                }
                            },
                        },
                        location: { index: 3 },
                    },
                },
            ],
        },
    });

    console.log(`✅ Created Form: ${title} (${formId})`);
    console.log(`⚠️ ACTION REQUIRED: Open the form and manually set the response destination to the 'Reservations' spreadsheet.`);

    // Try to generate a URL
    const formUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
    console.log(`Form URL: ${formUrl}`);

    return formId;
}

async function main() {
    console.log('🚀 Initializing Resources in Folder:', FOLDER_ID);

    try {
        // Verify Auth first
        console.log('🔍 Verifying access to folder...');
        const listRes = await drive.files.list({
            q: `'${FOLDER_ID}' in parents`,
            pageSize: 1,
        });
        console.log('✅ Access confirmed. Found files:', listRes.data.files?.length);

        const reservationsSheetId = await createSheet('Reservations | MOON LOOP');
        const eventsSheetId = await createSheet('Events | MOON LOOP');

        // Create Form
        const formId = await createForm('ご来店予約フォーム | MOON LOOP CAFE', reservationsSheetId);

        console.log('\n\n=============================================');
        console.log('🎉 Resources Created! Update your .env.local with:');
        console.log('=============================================');
        console.log(`GOOGLE_SHEET_ID_RESERVATIONS=${reservationsSheetId}`);
        console.log(`GOOGLE_SHEET_ID_EVENTS=${eventsSheetId}`);
        // console.log(`GOOGLE_FORM_ID_RESERVATIONS=${formId}`); 
        console.log('=============================================');

    } catch (error: any) {
        console.error('❌ Error initializing resources:', error.message);
        if (!error.response) {
            console.error('Full error:', error);
        }
    }
}

main();
