// import Button from "./Button";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { deleteUserById, getAllUsers } from "@/services/UserServices";
// import AddNewUserModal from "./Users/AddUser.Modal";
// import ViewUserModal from "./Users/ViewUser.Modal";
// import UpdateUserModal from "./Users/UpdateUser.Modal";

// // interface Iprops {
// //   blogs: IBlog[];
// //   setBlogs?: (value: IBlog[]) => void;
// // }
// interface Iprops {
//   users: IUser[];
//   setUsers?: (value: IUser[]) => void;
// }

// const MainBoard = (props: Iprops) => {
//   // const [data, setData] = useState<EricData[]>([]);
//   const [showAddModal, setShowAddModal] = useState<boolean>(false);
//   const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
//   const [showViewModal, setShowViewModal] = useState<boolean>(false);

//   // const [viewBlogId, setViewBlogId] = useState<number | null>(null);
//   // const [updateBlogId, setUpdateBlogId] = useState<number | null>(null);
//   const [viewUserId, setViewUserId] = useState<number | null>(null);
//   const [updateUserId, setUpdateUserId] = useState<number | null>(null);

//   // const { blogs, setBlogs } = props;
//   const { users, setUsers } = props;

//   const handleSubmit = async () => {
//     try {
//       const response = await getAllUsers();
//       setUsers?.(response);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to fetch users after submission.");
//     }
//   };

//   const handleUpdate = () => {
//     const onUpdate = async () => {
//       try {
//         const response = await getAllUsers();
//         setUsers?.(response);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Failed to fetch users after submission.");
//       }
//     };
//     // Refresh data sau khi update thành công
//     onUpdate();

//     // Đóng modal và reset blogId
//     setShowUpdateModal(false);
//     // setUpdateBlogId(null);
//   };

//   const handleDelete = async () => {
//     // Refresh data sau khi delete
//     const response = await getAllUsers();
//     setUsers?.(response);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center  p-8">
//       <div className="flex justify-between items-center w-11/12 mb-6">
//         <h1 className=" text-3xl font-bold ">Main Board</h1>
//         <Button
//           size="md"
//           className="bg-gray-500 hover:bg-gray-600"
//           onClick={() => setShowAddModal(true)}
//         >
//           Add New User
//         </Button>
//       </div>

//       <table
//         className="border-collapse border w-11/12
//       border-gray-300 rounded-lg overflow-hidden shadow-md"
//       >
//         <thead>
//           <tr className="bg-[#1579cb] text-white">
//             <th className="border border-gray-300 px-4 py-2">Id</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">
//               Tên tài khoản
//             </th>
//             <th className="border border-gray-300 px-4 py-2 text-left">
//               Email
//             </th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Tuổi</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">
//               Địa chỉ
//             </th>
//             <th className="border border-gray-300 px-4 py-2 text-left">
//               Giới tính
//             </th>
//             <th className="border border-gray-300 px-4 py-2 text-left">
//               Content
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {users?.slice().map((row: IUser, index: number) => (
//             <tr
//               key={row.id}
//               className={`${
//                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//               } hover:bg-gray-100 text-black`}
//             >
//               <td className="border border-gray-300 px-4 py-2 text-center">
//                 {row.id}
//               </td>
//               <td className="border border-gray-300 px-4 py-2 ">
//                 {row.username}
//               </td>
//               <td className="border border-gray-300 px-4 py-2 ">
//                 <span className={` py-1 rounded `}>{row.email}</span>
//               </td>
//               <td className="border border-gray-300 px-4 py-2 ">
//                 <span className={` py-1 rounded `}>{row.age}</span>
//               </td>
//               <td className="border border-gray-300 px-4 py-2 ">
//                 <span className={` py-1 rounded `}>{row.address}</span>
//               </td>
//               <td className="border border-gray-300 px-4 py-2 ">
//                 <span className={` py-1 rounded `}>
//                   {row.gender === "MALE"
//                     ? "Nam"
//                     : row.gender === "FEMALE"
//                     ? "Nữ"
//                     : row.gender === "OTHER"
//                     ? "Khác"
//                     : ""}
//                 </span>
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <div className="flex gap-2">
//                   <Button
//                     onClick={() => {
//                       setShowViewModal(true);
//                       setViewUserId(row.id);
//                     }}
//                     variant="primary"
//                     size="sm"
//                     className="px-3"
//                   >
//                     View
//                   </Button>
//                   <Button
//                     onClick={() => {
//                       setShowUpdateModal(true);
//                       setUpdateUserId(row.id);
//                     }}
//                     variant="alarm"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     onClick={() => deleteUserById(row.id, handleDelete)}
//                     variant="danger"
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <AddNewUserModal
//         show={showAddModal}
//         setShow={setShowAddModal}
//         onSubmit={handleSubmit}
//       ></AddNewUserModal>
//       {/* {viewUserId && (
//         <ViewUserModal
//           show={showViewModal}
//           setShow={setShowViewModal}
//           userId={viewUserId}
//           setUserId={setViewUserId}
//         ></ViewUserModal>
//       )} */}
//       {updateUserId && (
//         <UpdateUserModal
//           show={showUpdateModal}
//           setShow={setShowUpdateModal}
//           onUpdate={handleUpdate}
//           userId={updateUserId}
//           setUserId={setUpdateUserId}
//           roleOptions={[
//             { label: "Admin", value: "1" },
//             { label: "Doctor", value: "2" },
//             { label: "User", value: "3" },
//           ]}
//           companyOptions={[
//             { label: "Company A", value: "1" },
//             { label: "Company B", value: "2" },
//           ]}
//         ></UpdateUserModal>
//       )}
//       <p className="text-lg mt-6 text-gray-600">Welcome to the main board!</p>
//     </div>
//   );
// };

// export default MainBoard;
