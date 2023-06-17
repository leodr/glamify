import { NextResponse } from "next/server";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

const TOKEN_URL = "https://accounts.spotify.com/api/token";

const basicAuth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

export async function POST(request: Request) {
  const jsonBody = await request.json();
  const { authCode } = jsonBody;

  if (!authCode) {
    return new Response(null, { status: 400 });
  }

  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("code", authCode);
  body.append("redirect_uri", redirectUri);
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body,
  });

  if (response.ok) {
    const data = await response.json();

    return NextResponse.json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
  } else {
    const data = await response.json();

    console.log({ data, response });

    return new Response(null, { status: 500 });
  }
}
