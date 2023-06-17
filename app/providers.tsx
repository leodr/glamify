"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SpotifyAuthProvider } from "../components/SpotifyAuthProvider";

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyAuthProvider>{children}</SpotifyAuthProvider>
    </QueryClientProvider>
  );
}
