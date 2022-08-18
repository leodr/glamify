/* This example requires Tailwind CSS v2.0+ */
import Head from "next/head";
import { ReactNode } from "react";
import { AppLayout } from "../../layouts/AppLayout";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

export default function AppHome() {
  return (
    <>
      <Head>
        <title>glamify</title>
      </Head>
      <div className="text-center h-screen flex flex-col items-center justify-center">
        <svg
          className="mx-auto h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 512 512"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 01416 154v22"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <path
            d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0123-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 00-12.6-9.61L204 102a16.48 16.48 0 00-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
        </svg>
        <h3 className="mt-4 text-sm font-medium text-gray-900">
          No playlist selected
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Select a playlist on the left to get started.
        </p>
      </div>
    </>
  );
}

AppHome.getLayout = (page: ReactNode) => {
  return <AppLayout>{page}</AppLayout>;
};
