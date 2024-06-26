import axios from 'axios';
import { cookies } from 'next/headers';

// Define the function using arrow function syntax
export const fetchVacationSettings = async () => {
    try {
        // Retrieve the access token
        const accessToken = await fetchAccessToken(); 

        const userId = 'me'; // or use the email address of the user
        const url = `https://gmail.googleapis.com/gmail/v1/users/${userId}/settings/vacation`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Vacation responder settings:', response.data);
        // You can return the response data or process it further here
        return response.data;
    } catch (error) {
        console.error('Error fetching vacation responder settings:', error);
        // Handle errors appropriately
        throw error; // Optional: rethrow the error for upper layers to handle
    }
};

// Function to fetch access token from cookies
const fetchAccessToken = async (): Promise<string> => {
    const cookieStore = cookies();
    const accessTokenCookie = cookieStore.get('accessToken');

    if (!accessTokenCookie) {
        throw new Error('Access token not found');
    }

    return accessTokenCookie.value; 
};
