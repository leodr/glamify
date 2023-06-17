import { ReactNode } from "react";
import { AppLayout } from "../../layouts/AppLayout";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return <AppLayout>{children}</AppLayout>;
}
