import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { classifyEmail } from '@/utils/classifier'; 
import { generateResponse } from '@/utils/chatgpt'; 
import { sendEmail } from '@/service/sendEmail';


const processedEmails: Record<string, boolean> = {};

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


        const listResponse = await axios.get(listUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const messages = listResponse.data.messages || [];


        const topMessages = messages.slice(0, 10);


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


            const recipientHeader = detailResponse.data.payload.headers.find((header: any) => header.name === 'To');
            const recipientEmail = recipientHeader?.value;
            // console.log("this is the recipient email : ",recipientEmail);


            const classification = classifyEmail(subject, content, labelIds);


            if (!processedEmails[message.id] && (classification === 'interested' || classification === 'more information')) {
  
                const response = await generateResponse(classification);
                

                await sendEmail(recipientEmail, `Automatic Response for: ${subject}`, response);
                
     
                processedEmails[message.id] = true;
            }

            return { id: message.id, snippet, subject, labelIds, content, classification };
        }));

        console.log('Fetched message details:', messageDetails);

        return NextResponse.json({ messages: messageDetails });
    } catch (error: any) {
        console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
