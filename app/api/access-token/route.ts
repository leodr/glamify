import { NextResponse } from "next/server";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const TOKEN_URL = "https://accounts.spotify.com/api/token";

const basicAuth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

export async function POST(request: Request) {
  const jsonBody = await request.json();

  const { refreshToken } = jsonBody;

  if (!refreshToken) {
    return new Response(null, { status: 400 });
  }

  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refreshToken;
  body += "&client_id=" + clientId;

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
    });
  } else {
    const data = await response.json();

    console.log({ data, response });

    return new Response(null, { status: 500 });
  }
}
