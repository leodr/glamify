import { Figtree } from "next/font/google";
import { ReactNode } from "react";
import "../styles/globals.css";
import Providers from "./providers";

type Props = {
  children: ReactNode;
};

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export default function RootLayout({ children }: Props) {
  return (
    <Providers>
      <html lang="en" className={figtree.variable}>
        <body>{children}</body>
      </html>
    </Providers>
  );
}
