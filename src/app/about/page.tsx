"use client";
import { useState } from "react";
import Image from "next/image";
import {
  FaLaptopMedical,
  FaHeartbeat,
  FaHandHoldingMedical,
  FaChartLine,
} from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("vision");

  // Variants cho các hiệu ứng animation
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/health-pattern.jpg"
            alt="Medical pattern background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Về SmartHealth
            </h1>
            <p className="text-xl text-blue-100">
              Đổi mới quy trình khám chữa bệnh và quản lý y tế bằng công nghệ
              hiện đại
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute -right-16 -bottom-16 h-64 w-64 bg-blue-500 rounded-full opacity-20"></div>
        <div className="hidden md:block absolute left-10 top-10 h-20 w-20 bg-blue-300 rounded-full opacity-20"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-gray-600 mb-4">
                SmartHealth được thành lập vào năm 2022 bởi một nhóm các chuyên
                gia y tế và công nghệ với sứ mệnh cách mạng hóa cách quản lý và
                cung cấp dịch vụ chăm sóc sức khỏe tại Việt Nam.
              </p>
              <p className="text-gray-600 mb-4">
                Xuất phát từ những thách thức trong ngành y tế như quá tải bệnh
                viện, thời gian chờ đợi kéo dài và hồ sơ bệnh án giấy tờ phức
                tạp, chúng tôi đã phát triển một giải pháp toàn diện nhằm số hóa
                và tối ưu hóa toàn bộ quy trình khám chữa bệnh.
              </p>
              <p className="text-gray-600">
                Ngày nay, SmartHealth đã trở thành đối tác tin cậy của nhiều
                bệnh viện, phòng khám và cơ sở y tế trên cả nước, giúp cải thiện
                chất lượng dịch vụ và trải nghiệm của cả nhân viên y tế lẫn bệnh
                nhân.
              </p>
            </motion.div>
            <motion.div
              className="md:w-1/2 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/medical-team.jpg"
                  alt="Đội ngũ SmartHealth"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-blue-600 font-bold">Hơn 200+</p>
                <p className="text-gray-600 text-sm">Đối tác y tế tin dùng</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tầm nhìn & Sứ mệnh
            </h2>
            <p className="text-gray-600">
              Chúng tôi tin rằng công nghệ có thể cải thiện đáng kể cách thức
              cung cấp và quản lý dịch vụ chăm sóc sức khỏe
            </p>
          </div>

          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === "vision"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("vision")}
            >
              Tầm nhìn
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === "mission"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("mission")}
            >
              Sứ mệnh
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === "values"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("values")}
            >
              Giá trị cốt lõi
            </button>
          </div>

          <div className="bg-blue-50 p-8 rounded-xl">
            {activeTab === "vision" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/3">
                  <div className="bg-blue-600 rounded-full h-48 w-48 flex items-center justify-center mx-auto">
                    <FaLaptopMedical className="text-white text-6xl" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Tầm nhìn của chúng tôi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Trở thành nền tảng y tế điện tử hàng đầu Việt Nam, nơi công
                    nghệ và chăm sóc sức khỏe hội tụ để mang lại trải nghiệm
                    vượt trội cho cả bệnh nhân và nhân viên y tế.
                  </p>
                  <p className="text-gray-600">
                    Chúng tôi hướng tới một tương lai nơi mọi người đều có thể
                    tiếp cận dịch vụ y tế chất lượng cao một cách dễ dàng, nhanh
                    chóng và hiệu quả thông qua các giải pháp công nghệ tiên
                    tiến.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "mission" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/3">
                  <div className="bg-green-600 rounded-full h-48 w-48 flex items-center justify-center mx-auto">
                    <FaHandHoldingMedical className="text-white text-6xl" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Sứ mệnh của chúng tôi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Phát triển và cung cấp các giải pháp công nghệ y tế toàn
                    diện, giúp tối ưu hóa quy trình khám chữa bệnh, giảm tải áp
                    lực cho đội ngũ y tế, và nâng cao trải nghiệm của bệnh nhân.
                  </p>
                  <p className="text-gray-600">
                    Chúng tôi cam kết không ngừng đổi mới để giải quyết những
                    thách thức trong ngành y tế thông qua việc kết hợp chuyên
                    môn y khoa với công nghệ tiên tiến.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "values" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/3">
                  <div className="bg-purple-600 rounded-full h-48 w-48 flex items-center justify-center mx-auto">
                    <FaHeartbeat className="text-white text-6xl" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Giá trị cốt lõi
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <BsCheckCircleFill className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-600">
                        <strong>Đổi mới:</strong> Luôn tìm kiếm giải pháp sáng
                        tạo cho các thách thức y tế
                      </span>
                    </li>
                    <li className="flex items-start">
                      <BsCheckCircleFill className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-600">
                        <strong>Con người là trọng tâm:</strong> Đặt nhu cầu của
                        bệnh nhân và nhân viên y tế lên hàng đầu
                      </span>
                    </li>
                    <li className="flex items-start">
                      <BsCheckCircleFill className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-600">
                        <strong>Chất lượng:</strong> Cam kết cung cấp các giải
                        pháp đáng tin cậy và hiệu quả
                      </span>
                    </li>
                    <li className="flex items-start">
                      <BsCheckCircleFill className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-600">
                        <strong>Hợp tác:</strong> Xây dựng mối quan hệ đối tác
                        bền vững với các tổ chức y tế
                      </span>
                    </li>
                    <li className="flex items-start">
                      <BsCheckCircleFill className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-600">
                        <strong>Bảo mật:</strong> Bảo vệ thông tin sức khỏe nhạy
                        cảm với các tiêu chuẩn cao nhất
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Our Solutions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giải pháp của chúng tôi
            </h2>
            <p className="text-gray-600">
              SmartHealth cung cấp hệ sinh thái giải pháp toàn diện cho mọi nhu
              cầu quản lý y tế
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
            >
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <FaLaptopMedical className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quản lý bệnh nhân
              </h3>
              <p className="text-gray-600">
                Hệ thống quản lý hồ sơ bệnh nhân toàn diện, từ thông tin cá
                nhân, lịch sử y tế, đến kết quả xét nghiệm và điều trị.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
            >
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <FaHandHoldingMedical className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Đặt lịch thông minh
              </h3>
              <p className="text-gray-600">
                Hệ thống đặt lịch khám tự động, giúp tối ưu thời gian cho cả
                bệnh nhân và nhân viên y tế, giảm thời gian chờ đợi.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={2}
            >
              <div className="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <FaHeartbeat className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Hồ sơ y tế điện tử
              </h3>
              <p className="text-gray-600">
                Lưu trữ an toàn và truy cập dễ dàng thông tin y tế quan trọng,
                đảm bảo tính liên tục trong chăm sóc sức khỏe.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={3}
            >
              <div className="bg-amber-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <FaChartLine className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Phân tích dữ liệu
              </h3>
              <p className="text-gray-600">
                Công cụ phân tích dữ liệu y tế tiên tiến, giúp các cơ sở y tế
                đưa ra quyết định dựa trên dữ liệu thực tế.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-gray-600">
              Những người đứng sau sự thành công của SmartHealth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
            >
              <div className="aspect-square relative">
                <Image
                  src="/images/team-1.jpg"
                  alt="CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800">
                  Nguyễn Văn A
                </h3>
                <p className="text-blue-600">Giám đốc điều hành</p>
                <p className="text-gray-600 mt-2 text-sm">
                  Với hơn 15 năm kinh nghiệm trong lĩnh vực y tế và công nghệ
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
            >
              <div className="aspect-square relative">
                <Image
                  src="/images/team-2.jpg"
                  alt="CTO"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800">Trần Thị B</h3>
                <p className="text-blue-600">Giám đốc công nghệ</p>
                <p className="text-gray-600 mt-2 text-sm">
                  Chuyên gia về AI và hệ thống phần mềm y tế
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={2}
            >
              <div className="aspect-square relative">
                <Image
                  src="/images/team-3.jpg"
                  alt="Medical Director"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800">Lê Văn C</h3>
                <p className="text-blue-600">Giám đốc y tế</p>
                <p className="text-gray-600 mt-2 text-sm">
                  Bác sĩ với chuyên môn sâu về quản lý y tế
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={3}
            >
              <div className="aspect-square relative">
                <Image
                  src="/images/team-4.jpg"
                  alt="Design Lead"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800">Phạm Thị D</h3>
                <p className="text-blue-600">Trưởng nhóm thiết kế</p>
                <p className="text-gray-600 mt-2 text-sm">
                  Chuyên gia UX/UI với kinh nghiệm về ứng dụng y tế
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng nâng cấp hệ thống y tế của bạn?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Hãy liên hệ với chúng tôi ngay hôm nay để khám phá cách
              SmartHealth có thể giúp cơ sở y tế của bạn hoạt động hiệu quả hơn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 cursor-pointer
              hover:bg-blue-50 px-8 py-3 rounded-lg font-medium 
              shadow-lg hover:shadow-xl duration-300">
                Liên hệ tư vấn
              </button>
              <button className="bg-transparent border cursor-pointer
              border-white text-white hover:bg-white/10 
              px-8 py-3 rounded-lg font-medium duration-300">
                Xem demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
