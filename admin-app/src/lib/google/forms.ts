import { google } from 'googleapis';
import { getAuthClient } from './auth';

export async function createEventForm(title: string, eventDate: string) {
    const auth = getAuthClient();
    const forms = google.forms({ version: 'v1', auth });

    try {
        const res = await forms.forms.create({
            requestBody: {
                info: {
                    title: title,
                    documentTitle: title,
                },
            },
        });

        const formId = res.data.formId;
        if (!formId) throw new Error("Failed to create form");

        // Add items (questions)
        await forms.forms.batchUpdate({
            formId,
            requestBody: {
                requests: [
                    {
                        createItem: {
                            item: {
                                title: "お名前",
                                questionItem: {
                                    question: {
                                        required: true,
                                        textQuestion: {},
                                    },
                                },
                            },
                            location: { index: 0 },
                        },
                    },
                    {
                        createItem: {
                            item: {
                                title: "ご来店時間",
                                questionItem: {
                                    question: {
                                        required: true,
                                        choiceQuestion: {
                                            type: 'DROP_DOWN',
                                            options: [
                                                { value: '17:30' },
                                                { value: '19:00' },
                                                { value: '20:30' },
                                            ],
                                        },
                                    },
                                },
                            },
                            location: { index: 1 },
                        },
                    },
                ],
            },
        });

        return { formId, responderUri: res.data.responderUri, formUrl: `https://docs.google.com/forms/d/${formId}/viewform` };

    } catch (error) {
        console.error("Error creating form:", error);
        throw error;
    }
}

export async function getForm(formId: string) {
    const auth = getAuthClient();
    const forms = google.forms({ version: 'v1', auth });

    try {
        const res = await forms.forms.get({ formId });
        return res.data;
    } catch (error) {
        console.error("Error fetching form:", error);
        throw error;
    }
}

export async function updateFormChoices(formId: string, questionTitle: string, choices: string[]) {
    const auth = getAuthClient();
    const forms = google.forms({ version: 'v1', auth });

    try {
        // 1. Get the form to find the item index/ID
        const form = await getForm(formId);
        if (!form.items) throw new Error("Form has no items");

        // 2. Find the item
        const item = form.items.find(i => i.title === questionTitle);
        if (!item || !item.itemId || !item.questionItem) {
            throw new Error(`Question "${questionTitle}" not found or is not a question`);
        }

        console.log(`Found item ${item.itemId} for title "${questionTitle}"`);

        // 3. Update the choices
        // We need to construct the update request
        await forms.forms.batchUpdate({
            formId,
            requestBody: {
                requests: [
                    {
                        updateFormInfo: {
                            info: {
                                description: `Last updated: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                            },
                            updateMask: 'description'
                        }
                    },
                    {
                        updateItem: {
                            item: {
                                itemId: item.itemId,
                                questionItem: {
                                    question: {
                                        required: true, // Maintain required status
                                        choiceQuestion: {
                                            type: 'DROP_DOWN',
                                            options: choices.map(c => ({ value: c }))
                                        }
                                    }
                                }
                            },
                            location: { index: item.itemId ? undefined : undefined }, // Index not needed if itemId is present, but let's be careful. Actually updateItem uses itemId.
                            updateMask: 'questionItem'
                        }
                    }
                ]
            }
        });

        return true;

    } catch (error) {
        console.error("Error updating form choices:", error);
        return false;
    }
}
