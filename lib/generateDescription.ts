import { AddedBy, TrackInPlaylist } from "../types/tracks-response";

export function generateDescription(tracks: TrackInPlaylist[]) {
  console.time("generateDescription");

  const artistMap = new Map<string, number>();
  const artistIdMap = new Map<string, AddedBy>();

  for (const track of tracks) {
    for (const artist of track.track.artists) {
      artistIdMap.set(artist.id, artist);
      const artistCount = artistMap.get(artist.id) ?? 0;

      artistMap.set(artist.id, artistCount + 1);
    }
  }

  const artistMapArray = Array.from(artistMap.entries());

  artistMapArray.sort(([, countA], [, countB]) => countB - countA);

  const topArtists = artistMapArray
    .slice(0, 3)
    .map(([id]) => artistIdMap.get(id)!);

  let description: string;

  switch (artistMapArray.length) {
    case 0:
      description = "";
      break;
    case 1:
      description = `With tracks by ${topArtists[0]!.name}.`;
      break;
    case 2:
      description =
        "With tracks by " +
        topArtists[0].name +
        " and " +
        topArtists[1].name +
        ".";
      break;
    case 3:
      description =
        "With tracks by " +
        topArtists[0].name +
        ", " +
        topArtists[1].name +
        " and " +
        topArtists[2].name +
        ".";
      break;
    default:
      description = `With tracks by ${topArtists
        .map(({ name }) => name)
        .join(", ")} and more.`;
      break;
  }

  console.timeEnd("generateDescription");

  return description;
}
