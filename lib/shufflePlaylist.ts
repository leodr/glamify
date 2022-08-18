import { addTracks, getTracks, removeTracks } from "./api/spotify/tracks";

export async function shufflePlaylist({
  playlistId,
  authToken,
}: {
  playlistId: string;
  authToken: string;
}) {
  const tracksResponse = await getTracks(authToken, { playlistId });

  const trackUris = tracksResponse.map((item) => item.track.uri);
  const shuffledTrackUris = shuffleArray(trackUris);

  try {
    await removeTracks(authToken, { playlistId, items: trackUris });
    await addTracks(authToken, { playlistId, items: shuffledTrackUris });
  } finally {
    return shuffledTrackUris;
  }
}

export function shuffleArray<T>(inputArray: T[]) {
  const array = Array.from(inputArray);

  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
