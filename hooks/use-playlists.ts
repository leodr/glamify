import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useSpotifyAuth } from "../components/SpotifyAuthProvider";
import { SpotifyPlaylistsResponse } from "../types/playlist-response";

export function usePlaylists() {
  const { accessToken } = useSpotifyAuth();

  const obj = useQuery([accessToken, "playlists"], fetchPlaylists, {
    enabled: accessToken !== null,
  });

  return obj;
}

async function fetchPlaylists({ queryKey: [authToken] }: QueryFunctionContext) {
  const url = `https://api.spotify.com/v1/me/playlists?limit=50`;

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

  throw Error("Request to get playlists failed.");
}
