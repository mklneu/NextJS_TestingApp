import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#004356] text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 My App. All rights reserved.</p>
        <div className="mt-2">
          <Link href="#" className="mr-4 hover:underline">
            Privacy
          </Link>
          <Link href="#" className="mr-4 hover:underline">
            Terms
          </Link>
          <Link href="#" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
