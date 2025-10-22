import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Dòng quan trọng nhất: Báo cho Tailwind sử dụng class 'dark' để kích hoạt chế độ tối
  darkMode: "class", 
  theme: {
    extend: {
      // Bạn có thể thêm các tùy chỉnh khác ở đây
    },
  },
  plugins: [],
};
export default config;