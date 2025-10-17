// Pagination component
const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  if (totalPages <= 1) return null;

  // Tính toán dải trang hiển thị tối đa 4 số, có ... nếu cần
  let pages: (number | string)[] = [];
  if (totalPages <= 4) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage <= 2) {
    pages = [1, 2, 3, 4, "...", totalPages];
  } else if (currentPage >= totalPages - 1) {
    pages = [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  } else {
    pages = [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex-1" />
      <nav className="flex space-x-1 justify-end">
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            // window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
          }`}
        >
          Trước
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => {
                setCurrentPage(Number(p));
                // window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            // window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
          }`}
        >
          Sau
        </button>
      </nav>
    </div>
  );
};

const formatDateToDMY = (dateStr: string) => {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

// Format ngày giờ lịch hẹn: HH:mm - dd/MM/yyyy
const formatAppointmentDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${pad(
    d.getDate()
  )}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getStatusButtonClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    case "CONFIRMED":
      return "bg-green-100 text-green-700 hover:bg-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 hover:bg-red-200";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};

// Hàm khởi tạo giá trị thời gian mặc định là GMT+7
const getInitialGmt7Time = () => {
  // 1. Lấy thời gian hiện tại
  const now = new Date();

  // 2. Tính toán thời gian tại GMT+7
  // now.getTime() là mili giây tại UTC, ta chỉ cần cộng thêm 7 giờ
  const gmt7Time = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  // 3. Định dạng lại thành chuỗi YYYY-MM-DDTHH:mm
  // toISOString() sẽ chuyển thời gian về định dạng chuẩn UTC.
  // Vì đối tượng `gmt7Time` đã chứa đúng giá trị thời gian của GMT+7,
  // nên khi định dạng, chuỗi kết quả sẽ chính xác.
  return gmt7Time.toISOString().slice(0, 16);
};

export {
  Pagination,
  formatDateToDMY,
  formatAppointmentDate,
  scrollToTop,
  getStatusButtonClass,
  getInitialGmt7Time,
};
