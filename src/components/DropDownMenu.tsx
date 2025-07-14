import Link from "next/link";
import { useState } from "react";

const DropDownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const dropdownLinks = [
    { id: 1, href: "/services", label: "Services" },
    { id: 2, href: "/portfolio", label: "Portfolio" },
    { id: 3, href: "/contact", label: "Contact" },
    { id: 4, href: "/blog", label: "Blog" },
  ];

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // 200ms delay
    setHoverTimeout(timeout);
  };

  return (
    <>
      {/* Dropdown Menu */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="inline-block mr-4 hover:scale-110 duration-300 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Dropdown ▼
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-2 min-w-[150px] z-50">
            {dropdownLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors duration-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Mobile Dropdown Section
      <div className="border-t border-gray-300 mt-2 pt-2">
        <p className="px-4 py-1 text-sm font-semibold text-gray-600">More</p>
        {dropdownLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="block py-2 px-4 text-gray-800 hover:bg-blue-100 rounded transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div> */}
    </>
  );
};

export default DropDownMenu;
