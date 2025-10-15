export const translateAppointmentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
  };
  return statusMap[status] || status;
};
export const translateAppointmentType = (type: string): string => {
  const typeMap: Record<string, string> = {
    KHAM_TONG_QUAT: "Khám tổng quát",
    KHAM_CHUYEN_KHOA: "Khám chuyên khoa",
    TAI_KHAM: "Tái khám",
    TIEM_CHUNG: "Tiêm chủng",
    KHAM_SUC_KHOE_DINH_KY: "Khám sức khỏe định kỳ",
  };
  return typeMap[type] || type;
};
export const translateSpecialty = (specialty: string): string => {
  const specialtyMap: Record<string, string> = {
    CARDIOLOGY: "Tim mạch",
    DERMATOLOGY: "Da liễu",
    ENDOCRINOLOGY: "Nội tiết",
    GASTROENTEROLOGY: "Tiêu hóa",
    GENERAL_PRACTICE: "Đa khoa",
    HEMATOLOGY: "Huyết học",
    NEUROLOGY: "Thần kinh",
    OBSTETRICS_GYNECOLOGY: "Sản phụ khoa",
    ONCOLOGY: "Ung thư học",
    OPHTHALMOLOGY: "Nhãn khoa",
    ORTHOPEDICS: "Chỉnh hình",
    OTOLARYNGOLOGY: "Tai mũi họng",
    PEDIATRICS: "Nhi khoa",
    PSYCHIATRY: "Tâm thần học",
    PULMONOLOGY: "Phổi",
    RADIOLOGY: "X quang",
    UROLOGY: "Tiết niệu",
  };

  return specialtyMap[specialty] || specialty;
};

export const translateGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  };

  return genderMap[gender] || gender;
};

export const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Tạm ngưng",
  };

  return statusMap[status] || status;
};

export const translateTestType = (testType: string): string => {
  const translations: { [key: string]: string } = {
    HEMATOLOGY_BLOOD_CHEMISTRY: "Xét nghiệm Huyết học - Sinh hóa máu",
    URINALYSIS: "Xét nghiệm Nước tiểu",
    STOOL_TEST: "Xét nghiệm Phân",
    IMAGING_RADIOLOGY: "Chẩn đoán Hình ảnh - X-Quang",
    PATHOLOGY_BIOPSY: "Giải phẫu bệnh - Sinh thiết",
    FUNCTIONAL_TEST: "Xét nghiệm Chức năng",
    MICROBIOLOGY: "Vi sinh vật học",
  };
  return translations[testType] || testType.replace(/_/g, " ");
};
