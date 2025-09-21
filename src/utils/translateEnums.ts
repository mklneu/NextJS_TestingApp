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
