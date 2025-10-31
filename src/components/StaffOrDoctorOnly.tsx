// DoctorOnly.jsx

interface props {
  userRole: string | null;
  children: React.ReactNode;
}

const StaffOrDoctorOnly = ({ userRole, children }: props) => {
  // Nếu vai trò không phải là "staff", component sẽ không render ra gì cả (null)
  if (userRole === "staff" || userRole === "doctor") {
    return <>{children}</>;
  }

  // Nếu vai trò là "doctor", component sẽ render ra bất cứ thứ gì bạn đặt bên trong nó
};

export default StaffOrDoctorOnly;
