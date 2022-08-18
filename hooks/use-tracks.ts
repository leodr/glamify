import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useSpotifyAuth } from "../components/SpotifyAuthProvider";
import { getTracks } from "../lib/api/spotify/tracks";

export function useTracksFromPlaylist(playlistId: string) {
  const { accessToken } = useSpotifyAuth();

  const obj = useQuery(
    [accessToken, "playlists", playlistId],
    fetchTracksFromPlaylist,
    {
      enabled: accessToken !== null,
    }
  );

  return obj;
}

async function fetchTracksFromPlaylist({
  queryKey: [authToken, _, playlistId],
}: QueryFunctionContext) {
  if (typeof authToken === "string" && typeof playlistId === "string") {
    return getTracks(authToken, { playlistId });
  }
}
