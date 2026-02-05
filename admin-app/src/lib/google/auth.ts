import { google } from 'googleapis';

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/forms.body',
];

export const getAuthClient = () => {
    const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (!credentials.client_email || !credentials.private_key) {
        throw new Error('Google Service Account credentials are missing.');
    }

    return new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });
};
