import qs from 'qs';
import axios from 'axios';

interface GoogleTokenResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOauthTokens({ code }: { code: string }): Promise<GoogleTokenResult> {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
    scope:'openid'
  };

  try {
    const res = await axios.post<GoogleTokenResult>(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Failed to fetch Google OAuth tokens:', error);
    throw new Error(error.message);
  }
}
