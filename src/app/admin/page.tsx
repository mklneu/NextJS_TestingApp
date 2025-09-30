"use client";

export default function AdminPage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Trang quản trị</h1>
      <div>
        {children || <p>Chọn một mục ở sidebar để bắt đầu quản trị.</p>}
      </div>
    </main>
  );
}
