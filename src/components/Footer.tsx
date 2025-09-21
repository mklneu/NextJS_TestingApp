import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 mr-3 bg-white rounded-full flex items-center justify-center">
                <div className="text-blue-800 font-bold text-lg">S</div>
              </div>
              <h2 className="text-2xl font-bold">SmartHealth</h2>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Giải pháp quản lý y tế thông minh giúp tối ưu hóa quy trình khám
              chữa bệnh, quản lý hồ sơ y tế và nâng cao chất lượng chăm sóc sức
              khỏe.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-blue-700/50">
              Truy cập nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/doctors"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Quản lý bác sĩ
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Quản lý bệnh nhân
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-blue-700/50">
              Dịch vụ
            </h3>
            <ul className="space-y-3">
              {/* <li>
                <Link
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Quản lý bệnh nhân
                </Link>
              </li> */}
              <li>
                <Link
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Đặt lịch khám bệnh
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Hồ sơ y tế điện tử
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Báo cáo và thống kê
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <FaArrowRight className="mr-2 text-xs" />
                  Thanh toán trực tuyến
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-blue-700/50">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-blue-300" />
                <span className="text-blue-100">
                  123 Đường Khám Chữa Bệnh, Quận Y Tế, TP Sức Khỏe, Việt Nam
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-blue-300" />
                <span className="text-blue-100">+84 123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-300" />
                <span className="text-blue-100">contact@smarthealth.com</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">
                Đăng ký nhận bản tin
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-2 text-sm bg-white/10 border border-blue-700 rounded-l outline-none focus:ring-1 focus:ring-blue-400 text-white placeholder:text-blue-200 flex-1"
                />
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r text-sm font-medium transition-colors duration-300">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0">
            &copy; {currentYear} SmartHealth. Bản quyền thuộc về công ty cổ phần
            công nghệ y tế thông minh.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-blue-200 hover:text-white transition-colors duration-300"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-sm text-blue-200 hover:text-white transition-colors duration-300"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              href="/sitemap"
              className="text-sm text-blue-200 hover:text-white transition-colors duration-300"
            >
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
