// DoctorOnly.jsx

interface props {
  userRole: string | null;
  children: React.ReactNode;
}

const DoctorOnly = ({ userRole, children }: props) => {
  // Nếu vai trò không phải là "doctor", component sẽ không render ra gì cả (null)
  if (userRole !== "doctor") {
    return null;
  }

  // Nếu vai trò là "doctor", component sẽ render ra bất cứ thứ gì bạn đặt bên trong nó
  return <>{children}</>;
};

export default DoctorOnly;
