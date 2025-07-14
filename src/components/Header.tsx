"use client";
import Link from "next/link";
import { useState } from "react";
import DropDownMenu from "./DropDownMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { id: 1, href: "/", label: "Home", scale: "hover:scale-110" },
    { id: 2, href: "/tiktok", label: "Tiktok", scale: "hover:scale-110" },
    { id: 3, href: "/facebook", label: "Facebook", scale: "hover:scale-110" },
    { id: 4, href: "/instagram", label: "Instagram", scale: "hover:scale-110" },
    { id: 5, href: "/admin", label: "Admin", scale: "hover:scale-110" },
    { id: 6, href: "/about", label: "About", scale: "hover:scale-110" },
  ];

  return (
    <header className="bg-blue-300 text-white p-4 relative">
      <div className="container mx-auto">
        <div className="flex items-center justify-between text-gray-800">
          <Link href={"/"} className="font-bold text-xl">
            Next.JS Application
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`inline-block mr-4 ${link.scale} duration-300`}
              >
                {link.label}
              </Link>
            ))}
            <DropDownMenu />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="sm:hidden flex flex-col gap-1 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-800 transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-gray-800 transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-gray-800 transition-all duration-300"></span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-blue-200 rounded-lg p-4 shadow-lg z-40">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block py-2 px-4 text-gray-800 hover:bg-blue-100 rounded transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
