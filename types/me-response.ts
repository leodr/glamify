export interface SpotifyMeResponse {
  display_name: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: any[];
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: null;
  total: number;
}
