"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import InfoSidebar from "./InfoSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  let activeTab: "info" | "appointments" | "medical" = "info";
  if (pathname.startsWith("/profile/appointments")) activeTab = "appointments";
  else if (pathname.startsWith("/profile/medical")) activeTab = "medical";

  return (
    <AuthProvider>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
      >
        <div className="min-h-screen bg-gray-50 ">
          <div className="flex flex-1 !h-fit bg-gray-50 justify-center px-2 md:px-0">
            <div className="flex flex-col md:flex-row w-full mt-15
            max-w-5xl gap-4 md:gap-6 items-stretch">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <InfoSidebar activeTab={activeTab} />
              </div>
              <main
                className="flex-1 flex items-center justify-center min-w-[700px]
                border border-blue-200 rounded-2xl bg-white shadow-xl"
              >
                <div
                  className=" p-3 md:p-10 h-fit "
                >
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
