export interface SpotifyTracksResponse {
  href: string;
  items: TrackInPlaylist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface TrackInPlaylist {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color: null;
  track: Track;
  video_thumbnail: VideoThumbnail;
}

export interface AddedBy {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: AddedByType;
  uri: string;
  name?: string;
}

export interface ExternalUrls {
  spotify: string;
}

export type AddedByType = "artist" | "user";

export interface Track {
  album: Album;
  artists: AddedBy[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: AlbumType;
  artists: AddedBy[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: "day" | "year";
  total_tracks: number;
  type: AlbumType;
  uri: string;
}

export type AlbumType = "album" | "compilation";

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface ExternalIDS {
  isrc: string;
}

export interface VideoThumbnail {
  url: null;
}
