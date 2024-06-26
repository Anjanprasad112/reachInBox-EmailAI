function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
      'openid'
    ].join(" "),
  };

//   console.log("this is options : ",options);
  const qs = new URLSearchParams(options);
//   console.log({qs})
  return `${rootUrl}?${qs.toString()}`;
}
export default getGoogleOAuthURL;
