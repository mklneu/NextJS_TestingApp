// import Image from "next/image";
// import Link from "next/link";
"use client";
import MainBoard from "@/components/MainBoard";
import useSWR from "swr";

export default function Home() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/blogs",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <MainBoard blogs={data} />
    </>
  );
}
