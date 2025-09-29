// import { useEffect, useState } from "react";
// import Button from "../Button";
// import { toast } from "react-toastify";
// import InputBar from "../Input";
// import { getUserById } from "@/services/UserServices";

// interface IViewModalProps {
//   show: boolean;
//   setShow: (value: boolean) => void;
//   userId: number;
//   setUserId: (value: number | null) => void;
// }

// const ViewUserModal = (props: IViewModalProps) => {
//   const { show, setShow, userId, setUserId } = props;

//   const [currentUser, setCurrentUser] = useState<User>({
//     username: "",
//     email: "",
//     age: 0,
//     address: "",
//     gender: "",
//     role: { id: 0, name: "" },
//     company: { id: 0, name: "" },
//   });

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (userId) {
//         try {
//           const user = await getUserById(userId);
//           setCurrentUser(user);
//         } catch (error) {
//           console.error("Error fetching user details:", error);
//           toast.error("Failed to fetch user details.");
//         }
//       }
//     };
//     fetchUserDetails();
//   }, [userId]);

//   const handleClose = () => {
//     setUserId(null);
//     setShow(false);
//   };

//   return (
//     <>
//       {show && (
//         <form
//           onSubmit={(e) => e.preventDefault()}
//           className="flex justify-center items-center bg-[rgba(0,0,0,0.4)] fixed w-full min-h-screen top-0 right-0 p-4 z-50"
//         >
//           <div className="mx-auto bg-white text-black rounded-lg shadow-2xl border border-gray-400 w-[700px]">
//             <h1 className="px-5 py-4 text-2xl">
//               Thông tin người dùng{" "}
//               <span className="text-gray-600 font-bold text-sm">
//                 no.{userId}
//               </span>
//             </h1>
//             <hr className="mb-6 text-gray-200" />
//             <div className="flex gap-8 px-8">
//               {/* Cột 1: Thông tin cá nhân */}
//               <div className="flex-1 space-y-4">
//                 <InputBar
//                   label="Tên tài khoản"
//                   value={currentUser.username}
//                   placeholder="Tên tài khoản"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//                 <InputBar
//                   label="Email"
//                   value={currentUser.email}
//                   placeholder="Email"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//                 <InputBar
//                   label="Tuổi"
//                   value={currentUser.age}
//                   placeholder="Tuổi"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//                 <InputBar
//                   label="Địa chỉ"
//                   value={currentUser.address}
//                   placeholder="Địa chỉ"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//                 <InputBar
//                   label="Giới tính"
//                   value={
//                     currentUser.gender === "MALE"
//                       ? "Nam"
//                       : currentUser.gender === "FEMALE"
//                       ? "Nữ"
//                       : currentUser.gender === "OTHER"
//                       ? "Khác"
//                       : ""
//                   }
//                   placeholder="Giới tính"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//               </div>
//               {/* Cột 2: Thông tin hệ thống */}
//               <div className="flex-1 space-y-4">
//                 <InputBar
//                   label="Vai trò"
//                   value={currentUser.role?.name || ""}
//                   placeholder="Vai trò"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//                 <InputBar
//                   label="Bệnh viện"
//                   value={currentUser.company?.name || ""}
//                   placeholder="Công ty"
//                   disabled={true}
//                   onChange={() => {}}
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end mx-auto gap-2 mt-8 mb-8 w-11/12">
//               <Button variant="secondary" size="md" onClick={handleClose}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </form>
//       )}
//     </>
//   );
// };

// export default ViewUserModal;
