// /pages/api/emails.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { classifyEmail } from '@/utils/classifier'; // Function to classify emails
import { generateResponse } from '@/utils/chatgpt'; // Function to generate responses using ChatGPT
import { sendEmail } from '@/service/sendEmail';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const accessTokenCookie = cookieStore.get('accessToken');
        if (!accessTokenCookie) {
            console.error('Access token not found in cookies');
            return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
        }

        const accessToken = accessTokenCookie.value;
        const userId = 'me';
        const listUrl = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages?q=is:unread`;

        // Fetch list of unread messages
        const listResponse = await axios.get(listUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const messages = listResponse.data.messages || [];
        // console.log('Fetched message IDs:', messages);

        // Limit to top 10 messages
        const topMessages = messages.slice(0, 10);

        // Fetch details for each message (limited to 10)
        const messageDetails = await Promise.all(topMessages.map(async (message: any) => {
            const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${message.id}`;
            const detailResponse = await axios.get(detailUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const { snippet } = detailResponse.data;
            const subject = detailResponse.data.payload.headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject';
            const labelIds = detailResponse.data.labelIds || [];
            const content = detailResponse.data.payload.parts?.map((part: any) => {
                if (part.mimeType === 'text/plain' && part.body.data) {
                    return Buffer.from(part.body.data, 'base64').toString();
                }
                return '';
            }).join('');

            // Extract recipient email from the message
            const recipientHeader = detailResponse.data.payload.headers.find((header: any) => header.name === 'To');
            const recipientEmail = recipientHeader?.value;
            // Classify email
            const classification = classifyEmail(subject, content, labelIds);

            // Generate response for interested or more information emails
            let response = '';
            if (classification === 'interested' || classification === 'more information') {
                response = await generateResponse(classification);
                await sendEmail(recipientEmail, `Automatic Response for: ${subject}`, response);
            }

            return { id: message.id, snippet, subject, labelIds, content, classification, response };
        }));

        console.log('Fetched message details:', messageDetails);

        return NextResponse.json({ messages: messageDetails });
    } catch (error: any) {
        console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
