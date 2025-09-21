"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DropDownMenu from "./DropDownMenu";
import { logout, isAuthenticated } from "@/services/AuthServices";
import {
  FaHome,
  FaChartBar,
  FaUserMd,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navLinks = [
    {
      id: 1,
      href: "/",
      label: "Trang chủ",
      icon: <FaHome className="mr-2" />,
    },
    {
      id: 2,
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaChartBar className="mr-2" />,
    },
    {
      id: 3,
      href: "/admin/doctors",
      label: "Bác sĩ",
      icon: <FaUserMd className="mr-2" />,
    },
    {
      id: 4,
      href: "/admin/users",
      label: "Bệnh nhân",
      icon: <FaUsers className="mr-2" />,
    },
    {
      id: 5,
      href: "/about",
      label: "Giới thiệu",
      icon: <FaInfoCircle className="mr-2" />,
    },
  ];

  // Determine if a navigation link is active
  const isActiveLink = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <MdHealthAndSafety className="text-3xl text-white group-hover:text-blue-200 transition-colors duration-300" />
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-200 transition-colors duration-300">
              SmartHealth
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}

            {/* Login/Logout based on authentication status */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors duration-200"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors duration-200"
              >
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 z-50 p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-blue-900/95 transition-all duration-300 backdrop-blur-sm ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col h-full justify-center items-center pt-16">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`flex items-center w-64 justify-center py-4 text-lg ${
                    active
                      ? "text-white font-medium"
                      : "text-blue-200 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}

            {/* Login/Logout for mobile */}
            <div className="mt-8">
              {isLoggedIn ? (
                <button
                  onClick={(e) => {
                    handleLogout(e as React.MouseEvent);
                    setIsMenuOpen(false);
                  }}
                  className="px-8 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
