// import Image from "next/image";
import Link from "next/link";
import MainBoard from "@/components/Board";

export default function Home() {
  return (
    <>
      <div
        className="flex flex-col ml-22 
        justify-center text-3xl w-fit
        h-full my-10"
      >
        <li className="hover:text-red-500 duration-300 hover:scale-105">
          <Link href="/facebook">Facebook</Link>
        </li>
        <li className="hover:text-red-500 duration-300 hover:scale-105">
          <Link href="/tiktok">Tiktok</Link>
        </li>
        <li className="hover:text-red-500 duration-300 hover:scale-105">
          <Link href="instagram">Instagram</Link>
        </li>
      </div>
      <MainBoard />
    </>
  );
}
