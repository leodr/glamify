import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { classNames } from "../lib/classNames";
import { PlaylistInfo } from "../types/playlist-response";

type Props = { item: PlaylistInfo; onNavigate?: () => void };

export function NavigationItem({ item, onNavigate }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const { asPath } = useRouter();

  const path = `/app/playlists/${item.id}`;

  const isActive = asPath === path;

  return (
    (<Link
      href={path}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onNavigate}
      className={classNames(
        isActive
          ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white hover:text-white"
          : "text-gray-600 hover:text-gray-900",
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md space-x-3 h-12"
      )}>

      <Image
        src={item.images[0].url}
        alt=""
        width={32}
        height={32}
        className="w-8 h-8 rounded-sm object-cover"
      />
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          <motion.span
            key="name"
            className="flex-1"
            layout="position"
            transition={{ duration: 0.12 }}
          >
            {item.name}
          </motion.span>
          {(isHovered || isActive) && (
            <motion.span
              key="track-count"
              className={classNames(
                "text-xs",
                isActive ? "text-emerald-200" : "text-gray-400"
              )}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              transition={{ duration: 0.12 }}
            >
              {item.tracks.total} tracks
            </motion.span>
          )}
        </AnimatePresence>
      </div>

    </Link>)
  );
}
