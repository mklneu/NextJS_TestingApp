// Danh sách các API và role được phép truy cập

export type Role = "ADMIN" | "DOCTOR" | "USER";

interface ApiRoleConfig {
  [api: string]: Role[];
}

export const apiRoles: ApiRoleConfig = {
  "/api/users": ["ADMIN"],
  "/api/users/:id": ["ADMIN", "DOCTOR"],
  "/api/appointments": ["ADMIN", "DOCTOR"],
  "/api/appointments/:id": ["ADMIN", "DOCTOR"],
  "/api/profile": ["ADMIN", "DOCTOR", "USER"],
  // Thêm các API và role khác tại đây
};

// Hàm kiểm tra quyền truy cập API
export function canAccessApi(api: string, role: Role): boolean {
  // Tìm API khớp (có thể cần xử lý động với :id)
  const matchedApi = Object.keys(apiRoles).find((key) => {
    if (key.includes(":")) {
      // So khớp động, ví dụ: /api/users/:id
      const regex = new RegExp("^" + key.replace(/:\w+/g, "\\w+") + "$");
      return regex.test(api);
    }
    return key === api;
  });
  if (!matchedApi) return false;
  return apiRoles[matchedApi].includes(role);
}
