import {
  PlaylistInfo,
  SpotifyPlaylistsResponse,
} from "../../../types/playlist-response";

export async function getPlaylists(authToken: string): Promise<PlaylistInfo[]> {
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

export type PlaylistUpdate = {
  authToken: string;
  playlistId: string;
  name?: string;
  isPublic?: boolean;
  description?: string;
};

export async function updatePlaylist({
  authToken,
  playlistId,
  name,
  isPublic,
  description,
}: PlaylistUpdate) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, public: isPublic, description }),
  });

  if (response.ok) {
    return;
  }

  throw Error("Request to update playlist failed.");
}
