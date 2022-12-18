import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useMemo } from "react";
import { usePlaylists } from "../hooks/use-playlists";
import { Logo } from "./Logo";
import { NavigationItem } from "./NavigationItem";
import { useSpotifyAuth } from "./SpotifyAuthProvider";

type Props = {
  onNavigate?: () => void;
};

export function Navigation({ onNavigate }: Props) {
  const { data, error } = usePlaylists();

  const { me, logout } = useSpotifyAuth();

  const myId = me?.id;

  const playlists = useMemo(
    () => data?.filter((playlist) => playlist.owner.id === myId),
    [data, myId]
  );

  const myImage = me?.images[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto overscroll-y-contain">
        <div className="flex items-center flex-shrink-0 px-4">
          <Logo className="w-20 ml-1 text-slate-300" />
        </div>
        <nav className="mt-5 flex-1 px-2" aria-label="Sidebar">
          {playlists?.map((item) => (
            <NavigationItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex items-center border-t border-gray-200 p-4 space-x-2">
        <a
          href="https://spotify.com/account"
          target="_blank"
          className="flex-1 flex items-center"
          rel="noreferrer"
        >
          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-200">
            {myImage ? (
              <Image
                className="inline-block h-full w-full object-cover"
                fill
                src={myImage.url}
                alt=""
              />
            ) : null}
            <UserIcon className="h-6 w-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {me?.display_name}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              Manage account
            </p>
          </div>
        </a>
        <button
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
