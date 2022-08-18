import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SpotifyAuthProvider } from "../components/SpotifyAuthProvider";
import "../styles/globals.css";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  // @ts-expect-error: This exists if we define it in the pages file.
  const layoutFunction = Component.getLayout;

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="icon" href="/icon.png" type="image/png" />
      </Head>
      <SpotifyAuthProvider>
        {layoutFunction ? (
          layoutFunction(<Component {...pageProps} />)
        ) : (
          <Component {...pageProps} />
        )}
      </SpotifyAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
