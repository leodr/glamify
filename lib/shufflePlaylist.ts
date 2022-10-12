import { addTracks, getTracks, removeTracks } from "./api/spotify/tracks";

export async function shufflePlaylist({
  playlistId,
  authToken,
}: {
  playlistId: string;
  authToken: string;
}) {
  const tracksResponse = await getTracks(authToken, { playlistId });

  console.log(`Playlist ID: ${playlistId}`);
  console.log("Track URIs");
  console.log(
    JSON.stringify({ uris: tracksResponse.map((track) => track.track.uri) })
  );
  console.log(
    "To restore your playlist go to https://developer.spotify.com/console/post-playlist-tracks/, enter the playlist id from above and paste the list of URIS into the Request Body field."
  );

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
