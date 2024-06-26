import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOauthTokens } from '@/service/oauthService';
import { setCookie } from 'cookies-next';


export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }


    const { id_token, access_token } = await getGoogleOauthTokens({ code });

    console.log({ id_token, access_token });

    const response = NextResponse.redirect(new URL('/dashboard', req.url).toString());
    setCookie('accessToken', access_token, { req, res: response, httpOnly: true });
    setCookie('idToken', id_token, { req, res: response, httpOnly: true });

    return response;
  } catch (error) {
    console.error('Error in Google OAuth handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
