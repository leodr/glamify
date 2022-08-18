const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const scopes = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
];

const BASE_AUTH_URL = "https://accounts.spotify.com/authorize";

export function getAuthUrl() {
  if (!clientId)
    throw Error("Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID environment variable.");
  if (!redirectUri)
    throw Error(
      "Missing NEXT_PUBLIC_SPOTIFY_REDIRECT_URI environment variable."
    );

  let params = new URLSearchParams();
  params.set("client_id", clientId);
  params.set("response_type", "code");
  params.set("redirect_uri", encodeURI(redirectUri));
  params.set("show_dialog", "true");
  params.set("scope", scopes.join(" "));

  let url = BASE_AUTH_URL + "?" + params.toString();

  return url;
}
