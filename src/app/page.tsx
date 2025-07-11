// import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center 
    justify-center text-3xl
    h-130 "
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
  );
}
