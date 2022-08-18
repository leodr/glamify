import { SpotifyMeResponse } from "../../../types/me-response";

const ME_URL = "https://api.spotify.com/v1/me";

export async function getMe(authToken: string) {
  const response = await fetch(ME_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: SpotifyMeResponse = await response.json();

    return data;
  }

  throw Error("Request to get user data failed.");
}
