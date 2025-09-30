"use client";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 cursor-pointer
      bg-red-600 text-white p-3 rounded-full 
      shadow-lg hover:bg-red-700 duration-300 z-50"
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-xl" />
    </button>
  );
}

// Utility function to scroll to top smoothly
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
