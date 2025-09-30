import AdminSidebar from "@/components/AdminSidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex flex-1 min-h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 bg-[#2b2b2b]">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
