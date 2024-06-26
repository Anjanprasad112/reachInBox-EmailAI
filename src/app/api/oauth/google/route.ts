import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOauthTokens } from '@/service/oauthService';
import { setCookie } from 'cookies-next';
// import { fetchVacationSettings } from '@/app/api/emails/route';

export async function GET(req: NextRequest) {
  try {
    // Parse the query parameters from the URL
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get the tokens using the authorization code
    const { id_token, access_token } = await getGoogleOauthTokens({ code });

    console.log({ id_token, access_token });

    // (Optional) Get user info with tokens if needed
    // const userInfo = await getUserInfo({ id_token, access_token });

    // (Optional) Upsert the user to the database if needed

    // (Optional) Create a session for the user if needed
    // fetchVacationSettings(access_token);

    // Set cookies (example with a placeholder token)
    const response = NextResponse.redirect(new URL('/dashboard', req.url).toString());
    setCookie('accessToken', access_token, { req, res: response, httpOnly: true });
    setCookie('idToken', id_token, { req, res: response, httpOnly: true });
    // Redirect or respond with a success message
    return response;
  } catch (error) {
    console.error('Error in Google OAuth handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
