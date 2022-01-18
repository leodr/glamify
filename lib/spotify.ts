import { SpotifyMeResponse } from "../types/me-response";
import {
  PlaylistInfo,
  SpotifyPlaylistsResponse,
} from "../types/playlist-response";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const scopes = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
];

const BASE_AUTH_URL = "https://accounts.spotify.com/authorize";
const ME_URL = "https://api.spotify.com/v1/me";

export function getAuthUrl() {
  let params = new URLSearchParams();
  params.set("client_id", clientId);
  params.set("response_type", "code");
  params.set("redirect_uri", encodeURI(redirectUri));
  params.set("show_dialog", "true");
  params.set("scope", scopes.join(" "));

  let url = BASE_AUTH_URL + "?" + params.toString();

  return url;
}

export async function getPlaylists(
  authToken,
  { userId }
): Promise<PlaylistInfo[]> {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: SpotifyPlaylistsResponse = await response.json();

    return data.items;
  }
}

export async function getMe(authToken): Promise<SpotifyMeResponse> {
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
}
