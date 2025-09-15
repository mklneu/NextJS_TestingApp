"use client";
import MainBoard from "@/components/MainBoard";
// import { getAllBlogs } from "@/services/BlogServices";
import { getAllUsers } from "@/services/UserServices";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<IUser[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setData(users);
    };
    fetchUsers();
  }, []);

  // function multiplySequence(
  //   start: number,
  //   step: number,
  //   times: number
  // ): number {
  //   let result = 1;
  //   let current = start;
  //   for (let i = 0; i < times; i++) {
  //     result *= current;
  //     current += step;
  //   }
  //   console.log(`Result after multiplying ${times} times:`, result,'last value', current - step);
  //   return result;
  // }

  // console.log(multiplySequence(1.05, 0.05, 15)); 

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <MainBoard users={data} setUsers={setData} />
    </>
  );
}
