import axios from 'axios';
import { cookies } from 'next/headers';


export const fetchVacationSettings = async () => {
    try {

        const accessToken = await fetchAccessToken(); 

        const userId = 'me'; 
        const url = `https://gmail.googleapis.com/gmail/v1/users/${userId}/settings/vacation`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // console.log('Vacation responder settings:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching vacation responder settings:', error);

        throw error;
    }
};


const fetchAccessToken = async (): Promise<string> => {
    const cookieStore = cookies();
    const accessTokenCookie = cookieStore.get('accessToken');

    if (!accessTokenCookie) {
        throw new Error('Access token not found');
    }

    return accessTokenCookie.value; 
};
