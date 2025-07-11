"use client";

import { useRouter } from "next/navigation";

const Facebook = () => {
  const router = useRouter();
  const backButton = () => {
    router.push("/");
  };
  return (
    <div>
      <div
        className="flex justify-center items-center
      flex-col h-130"
      >
        <p className="text-6xl">
          Hello Facebook
          <br />
          <span className="text-blue-600">Welcome to the platform!</span>
        </p>
        <button
          className="text-2xl bg-blue-500 rounded-md px-2
          cursor-pointer"
          onClick={() => backButton()}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Facebook;
