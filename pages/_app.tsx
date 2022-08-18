import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { SpotifyAuthProvider } from "../components/SpotifyAuthProvider";
import "../styles/globals.css";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  // @ts-expect-error: This exists if we define it in the pages file.
  const layoutFunction = Component.getLayout;

  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyAuthProvider>
        {layoutFunction ? (
          layoutFunction(<Component {...pageProps} />)
        ) : (
          <Component {...pageProps} />
        )}
      </SpotifyAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
