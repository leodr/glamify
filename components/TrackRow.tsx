import { motion } from "framer-motion";
import Image from "next/future/image";
import { Fragment } from "react";
import { msToDurationShort } from "../lib/format-durations";
import { Track } from "../types/tracks-response";

type Props = {
  track: Track;
  index: number;
  onRemove: (trackUri: string) => Promise<void>;
};

export default function TrackRow({ track, index, onRemove }: Props) {
  function handleRemove() {
    onRemove(track.uri);
  }

  const artistsElements = track.artists.map(
    ({ id, name, external_urls }, index, array) => {
      const artistCount = array.length;
      const isLast = index === artistCount - 1;

      return (
        <Fragment key={id}>
          <a
            target="_blank"
            href={external_urls.spotify}
            className="hover:underline"
            rel="noreferrer"
          >
            {name}
          </a>
          {!isLast && <span>{", "}</span>}
        </Fragment>
      );
    }
  );

  return (
    <motion.tr layout key={track.id} transition={{ delay: 0.02 * index }}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-white space-y-0.5">
        <a
          href={track.album.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={track.album.images[0].url}
            alt=""
            className="w-8 h-8 rounded-sm object-cover"
            width={24}
            height={24}
          />
        </a>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-white space-y-0.5">
        <span className="block">{track.name}</span>
        <span className="block text-gray-500 text-xs">{artistsElements}</span>
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <a
          href={track.album.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {track.album.name}
        </a>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
        {msToDurationShort(track.duration_ms)}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          onClick={handleRemove}
          className="text-rose-600 hover:text-rose-900"
        >
          Remove<span className="sr-only">, {track.name}</span>
        </button>
      </td>
    </motion.tr>
  );
}
