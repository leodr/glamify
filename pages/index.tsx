import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAuthUrl, getMe, getPlaylists } from "../lib/spotify";
import { SpotifyMeResponse } from "../types/me-response";
import { PlaylistInfo } from "../types/playlist-response";

export default function Home() {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>();
  const [me, setMe] = useState<SpotifyMeResponse>();

  const { query } = useRouter();

  const { code: authCode } = query;

  useEffect(() => {
    if (authCode) {
      fetch("/api/refresh-token", {
        method: "POST",
        body: JSON.stringify({ authCode }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        if (response.ok) {
          response.json().then(({ accessToken, refreshToken }) => {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
          });
        }
      });
    }
  }, [authCode]);

  useEffect(() => {
    if (accessToken) {
      getMe(accessToken).then((data) => setMe(data));
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && me) {
      getPlaylists(accessToken, { userId: me.id }).then((playlists) =>
        setPlaylists(
          playlists.filter((playlist) => playlist.owner.id === me.id)
        )
      );
    }
  }, [accessToken, me]);

  return (
    <div>
      <button
        onClick={() => {
          window.location.href = getAuthUrl();
        }}
      >
        Authorize with spotify
      </button>
      <main>{JSON.stringify(query, null, 2)}</main>
      <main>{JSON.stringify({ accessToken, refreshToken }, null, 2)}</main>
      <ul>
        {playlists?.map((list) => (
          <li key={list.id}>{list.name}</li>
        ))}
      </ul>
    </div>
  );
}
