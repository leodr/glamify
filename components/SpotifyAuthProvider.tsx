import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMe } from "../lib/api/spotify/me";
import { getAuthUrl } from "../lib/spotify-auth";
import { SpotifyMeResponse } from "../types/me-response";

type Props = {
  children: ReactNode;
};

type SpotifyAuthReturn = {
  accessToken: string | null;
  isLoggedIn: boolean;
  me?: SpotifyMeResponse;
  login: () => void;
};

const SpotifyAuthContext = createContext<SpotifyAuthReturn | null>(null);

const LOCAL_STORAGE_KEY = "spotify-refresh-token";

export function SpotifyAuthProvider({ children }: Props) {
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [me, setMe] = useState<SpotifyMeResponse>();

  const { query } = useRouter();
  const { code: authCode } = query;

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem(LOCAL_STORAGE_KEY);

    setRefreshToken(storedRefreshToken);
  }, []);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem(LOCAL_STORAGE_KEY, refreshToken);
    }
  }, [refreshToken]);

  useEffect(() => {
    if (!refreshToken && authCode) {
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
  }, [authCode, refreshToken]);

  useEffect(() => {
    if (refreshToken && !accessToken) {
      fetch("/api/access-token", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        if (response.ok) {
          response.json().then(({ accessToken }) => {
            setAccessToken(accessToken);
          });
        }
      });
    }
  }, [accessToken, authCode, refreshToken]);

  useEffect(() => {
    if (accessToken) {
      getMe(accessToken).then((data) => setMe(data));
    }
  }, [accessToken]);

  const login = useCallback(() => {
    window.location.href = getAuthUrl();
  }, []);

  const contextValue: SpotifyAuthReturn = {
    accessToken,
    isLoggedIn: Boolean(refreshToken),
    me,
    login,
  };

  return (
    <SpotifyAuthContext.Provider value={contextValue}>
      {children}
    </SpotifyAuthContext.Provider>
  );
}

export function useSpotifyAuth() {
  const authObject = useContext(SpotifyAuthContext);

  if (authObject == null) {
    throw Error("SpotifyAuthContext not found.");
  }

  function login() {
    window.location.href = getAuthUrl();
  }

  function logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.href = "/";
  }

  return { ...authObject, login, logout };
}
