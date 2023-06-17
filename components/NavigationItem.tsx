import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "../lib/classNames";
import { PlaylistInfo } from "../types/playlist-response";

type Props = { item: PlaylistInfo; onNavigate?: () => void };

export function NavigationItem({ item, onNavigate }: Props) {
  const currentPath = usePathname();

  const playlistId = item.id;

  const isActive = currentPath === `/app/playlists/${playlistId}`;

  return (
    <Link
      href={`/app/playlists/${playlistId}`}
      onClick={onNavigate}
      className={classNames(
        isActive
          ? "list-item-active bg-gradient-to-r from-teal-600 to-emerald-500 text-white hover:text-white"
          : "text-gray-600 hover:text-gray-900",
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md space-x-3 h-12"
      )}
    >
      <Image
        src={item.images[0].url}
        alt=""
        width={32}
        height={32}
        className="w-8 h-8 rounded-sm object-cover"
      />
      <div className="grid">
        <span
          className={classNames(
            "leading-snug",
            "col-1 col-start-1 col-span-1 row-start-1 row-span-1",
            "transform translate-y-0 group-hover:-translate-y-1/2 group-[.list-item-active]:-translate-y-1/2",
            "transition-transform duration-150 ease-in-out"
          )}
        >
          {item.name}
        </span>
        <span
          aria-hidden={!isActive}
          className={classNames(
            "text-xs leading-snug",
            "col-1 col-start-1 col-span-1 row-start-1 row-span-1",

            "transform translate-y-full group-hover:translate-y-1/2 group-[.list-item-active]:translate-y-1/2",
            "opacity-0 group-hover:opacity-100 group-[.list-item-active]:opacity-100",
            "scale-75 group-hover:scale-100 group-[.list-item-active]:scale-100",

            "transition duration-150 ease-in-out",
            isActive ? "text-emerald-200" : "text-gray-400"
          )}
        >
          {item.tracks.total} tracks
        </span>
      </div>
    </Link>
  );
}
