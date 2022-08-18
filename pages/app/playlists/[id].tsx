import {
  ClockIcon,
  PencilIcon,
  RefreshIcon,
  UsersIcon,
  ViewListIcon,
} from "@heroicons/react/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useSpotifyAuth } from "../../../components/SpotifyAuthProvider";
import TrackRow from "../../../components/TrackRow";
import { usePlaylists } from "../../../hooks/use-playlists";
import { useTracksFromPlaylist } from "../../../hooks/use-tracks";
import { AppLayout } from "../../../layouts/AppLayout";
import { updatePlaylist } from "../../../lib/api/spotify/playlists";
import { removeTrackMutationFn } from "../../../lib/api/spotify/tracks";
import { classNames } from "../../../lib/classNames";
import { msToDuration } from "../../../lib/format-durations";
import { generateDescription } from "../../../lib/generateDescription";
import { shufflePlaylist } from "../../../lib/shufflePlaylist";
import { PlaylistInfo } from "../../../types/playlist-response";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

export default function PlaylistPage() {
  const {
    query: { id },
  } = useRouter();

  const { data: playlists } = usePlaylists();

  const playlist = useMemo(
    () => playlists?.find((playlist) => playlist.id === id),
    [playlists, id]
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function listener() {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", listener, { passive: true });

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  const playlistId = id as string;

  const { data: tracks } = useTracksFromPlaylist(playlistId);

  const playlistDuration = useMemo(
    () => tracks?.reduce((sum, { track }) => sum + track.duration_ms, 0),
    [tracks]
  );

  const { accessToken } = useSpotifyAuth();

  const queryClient = useQueryClient();
  const shuffleMutation = useMutation(shufflePlaylist, {
    onSuccess: () => {
      queryClient.invalidateQueries([accessToken, "playlists", playlistId]);
    },
  });

  function handleShuffleClick() {
    if (accessToken === null) return;

    shuffleMutation.mutate({ authToken: accessToken, playlistId });
  }

  const descriptionMutation = useMutation(updatePlaylist, {
    onSuccess: (_, { playlistId, description }) => {
      queryClient.setQueryData<PlaylistInfo[] | undefined>(
        [accessToken, "playlists"],
        (oldData) =>
          oldData?.map((playlistEntry) =>
            playlistEntry.id === playlistId
              ? { ...playlistEntry, description: description || "" }
              : playlistEntry
          )
      );
    },
  });

  function handleGenerateDescription() {
    if (!tracks || accessToken === null) return;

    const description = generateDescription(tracks);

    descriptionMutation.mutate({
      authToken: accessToken,
      playlistId,
      description,
    });
  }

  const removeTrackMutation = useMutation(removeTrackMutationFn, {
    onSuccess: () => {
      queryClient.invalidateQueries([accessToken, "playlists", playlistId]);
    },
  });

  function handleRemove(trackUri: string) {
    if (!accessToken) return;

    removeTrackMutation.mutate({
      authToken: accessToken,
      playlistId,
      items: [trackUri],
    });
  }

  return (
    <div className=" mb-8">
      <div
        className={classNames(
          "lg:flex lg:items-center lg:justify-between pt-8 pb-4 px-4 sm:px-6 lg:px-8",
          "sticky -top-4 z-10 transition duration-150",
          !scrolled ? "bg-gray-50" : "bg-white",
          !scrolled ? "shadow-none" : "shadow-xl"
        )}
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight sm:truncate">
            <a
              href={playlist?.external_urls.spotify}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {playlist?.name}
            </a>
          </h2>
          {playlist?.description ? (
            <div className="pt-1 pb-2 text-sm text-gray-500">
              {playlist?.description}
            </div>
          ) : null}
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <UsersIcon
                className="flex-shrink-0 mr-1.5 mt-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {playlist?.public ? "Public playlist" : "Private playlist"}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ViewListIcon
                className="flex-shrink-0 mr-1.5 mt-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {playlist?.tracks.total} tracks
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ClockIcon
                className="flex-shrink-0 mr-1.5 mt-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {playlistDuration && msToDuration(playlistDuration)}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 lg:mt-0 lg:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
            onClick={handleGenerateDescription}
          >
            <PencilIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            Generate Description
          </button>

          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
            onClick={handleShuffleClick}
          >
            <RefreshIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Shuffle Tracks
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border-t border-b md:border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    ></th>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Album
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Duration
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tracks?.map(({ track }, index) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PlaylistPage.getLayout = (page: ReactNode) => {
  return <AppLayout>{page}</AppLayout>;
};
