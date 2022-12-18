import {
  SpotifyTracksResponse,
  TrackInPlaylist,
} from "../../../types/tracks-response";

export async function getTracks(
  authToken: string,
  { playlistId }: { playlistId: string }
) {
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  return getTracksRecursive(authToken, {
    url: playlistUrl,
    previousTracks: [],
  });
}

async function getTracksRecursive(
  authToken: string,
  { url, previousTracks }: { url: string; previousTracks: TrackInPlaylist[] }
): Promise<TrackInPlaylist[]> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: SpotifyTracksResponse = await response.json();

    if (data.next) {
      return getTracksRecursive(authToken, {
        url: data.next,
        previousTracks: [...previousTracks, ...data.items],
      });
    }

    return [...previousTracks, ...data.items];
  }

  throw Error("Request to get playlists tracks failed.");
}

export async function removeTrackMutationFn({
  authToken,
  playlistId,
  items,
}: {
  authToken: string;
  playlistId: string;
  items: string[];
}) {
  return removeTracks(authToken, { playlistId, items });
}

export async function removeTracks(
  authToken: string,
  { playlistId, items }: { playlistId: string; items: string[] }
) {
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const remainingItems = Array.from(items);

  while (remainingItems.length > 0) {
    const firstHundred = remainingItems.splice(0, 100);

    const body = {
      tracks: firstHundred.map((item) => ({ uri: item })),
    };

    const response = await fetch(playlistUrl, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw Error("Request to delete playlists tracks failed.");
    }
  }
}

export async function addTracks(
  authToken: string,
  { playlistId, items }: { playlistId: string; items: string[] }
) {
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const remainingItems = Array.from(items);

  while (remainingItems.length > 0) {
    const firstHundred = remainingItems.splice(0, 100);

    const body = { uris: firstHundred };

    const response = await fetch(playlistUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw Error("Request to add playlist tracks failed.");
    }
  }
}

export async function replaceTracks(
  authToken: string,
  { playlistId, items }: { playlistId: string; items: string[] }
) {
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const remainingItems = Array.from(items);

  for (let i = 0; i < remainingItems.length; i += 100) {
    const items = remainingItems.slice(i, i + 100);

    const body = {
      uris: items,
      // range_start: i,
      // range_length: items.length,
      // insert_before: i,
    };

    const response = await fetch(playlistUrl, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw Error("Request to add playlist tracks failed.");
    }
  }
}

export type PlaylistTracksUpdate = {
  playlistId: string;
  newTrackUris: string[];
};

export async function updatePlaylistTracks(
  authToken: string,
  { playlistId, newTrackUris }: PlaylistTracksUpdate
) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: newTrackUris }),
  });

  if (response.ok) {
    return;
  }

  throw Error("Request to update playlist tracks failed.");
}
