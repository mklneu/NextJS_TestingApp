"use client";

import Link from "next/link";
import {
  FaChartBar,
  FaUserMd,
  FaUsers,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { scrollToTop } from "./ScrollToTopButton";

const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <FaChartBar />,
  },
  {
    href: "/admin/doctors",
    label: "Bác sĩ",
    icon: <FaUserMd />,
  },
  {
    href: "/admin/patients",
    label: "Bệnh nhân",
    icon: <FaUsers />,
  },
];

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  return (
    <div
      className="min-h-screen bg-gradient-to-b shadow-lg 
        from-blue-700 to-blue-900"
    >
      <aside
        className={`sticky top-15 h-fit text-white 
        flex flex-col gap-2 duration-300 z-30 ${
          open ? "w-64 px-6 py-8" : "w-16 px-2 py-8"
        }`}
        style={{ minWidth: open ? 256 : 64 }}
      >
        <button
          className="absolute top-4 right-4 bg-blue-800 cursor-pointer
        hover:bg-blue-900 rounded-full p-2 transition-colors z-40"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {open ? <FaChevronLeft /> : <FaBars />}
        </button>
        <h2
          className={`absolute top-4 text-2xl px-4 font-bold text-center
             tracking-wide duration-300 ${
               open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
             }`}
        >
          Quản trị
        </h2>
        <nav className="flex flex-col gap-2 mt-8">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center rounded-lg duration-300
                font-medium text-md hover:bg-blue-800 h-12 ${
                  open ? "justify-start px-4 py-3" : "justify-center p-3"
                }`}
              title={link.label}
              onClick={(e) => {
                if (pathname === link.href) {
                  e.preventDefault();
                  scrollToTop();
                }
              }}
            >
              {link.icon}
              <span
                className={`ml-2 duration-200 ${
                  open ? "inline" : "hidden h-[208px]"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default AdminSidebar;
