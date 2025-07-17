"use client";
import MainBoard from "@/components/MainBoard";
import { getAllBlogs } from "@/services/BlogServices";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<IBlog[]>([]);
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await getAllBlogs();
      setData(blogs);
    };
    fetchBlogs();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <MainBoard blogs={data} setBlogs={setData}/>
    </>
  );
}
