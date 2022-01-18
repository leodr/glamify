import type { NextApiRequest, NextApiResponse } from "next";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const TOKEN_URL = "https://accounts.spotify.com/api/token";

const basicAuth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

type Data = {
  accessToken: string;
  refreshToken: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | undefined>
) {
  if (req.method === "POST") {
    const { authCode } = req.body;

    if (!authCode) {
      res.status(400).end();
    }

    let body = "grant_type=authorization_code";
    body += "&code=" + authCode;
    body += "&redirect_uri=" + encodeURI(redirectUri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;

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

      res.status(200).json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    } else {
      const data = await response.json();

      console.log({ data, response });

      res.status(500).send(undefined);
    }
  } else {
    res.status(405).send(undefined);
  }
}
