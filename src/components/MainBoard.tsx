// import { tableData, TableRow } from "@/data/tableData";
// import { useEffect, useState } from "react";
// import { EricData } from "@/data/dataType";
import IBlog from "@/types/backend";
import Button from "./Button";
import CreateModal from "./CreateModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { getAllBlogs } from "@/services/BlogServices";

interface Iprops {
  blogs: IBlog[];
  setBlogs?: (value: IBlog[]) => void;
}

const MainBoard = (props: Iprops) => {
  // const [data, setData] = useState<EricData[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { blogs, setBlogs } = props;

  const onsubmit = async () => {
    try {
      const response = await getAllBlogs();
      setBlogs?.(response);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs after submission.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  p-8">
      <div className="flex justify-between items-center w-11/12 mb-6">
        <h1 className=" text-3xl font-bold ">Main Board</h1>
        <Button
          size="md"
          className="bg-gray-500 hover:bg-gray-600"
          onClick={() => setShowModal(true)}
        >
          Add New
        </Button>
      </div>

      <table
        className="border-collapse border w-11/12
      border-gray-300 rounded-lg overflow-hidden shadow-md"
      >
        <thead>
          <tr className="bg-[#1579cb] text-white">
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Author
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Title
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Content
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs
            ?.slice()
            .reverse()
            .map((row: IBlog, index: number) => (
              <tr
                key={row.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 text-black`}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {row.id}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  {row.author}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  <span className={` px-2 py-1 rounded text-sm`}>
                    {row.title}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowModal(true)}
                      variant="primary"
                      size="sm"
                      className="px-3"
                    >
                      View
                    </Button>
                    <Button variant="alarm">Edit</Button>
                    <Button variant="danger">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <CreateModal
        show={showModal}
        setShow={setShowModal}
        setBlogs={setBlogs}
        onSubmit={onsubmit}
      ></CreateModal>
      <p className="text-lg mt-6 text-gray-600">Welcome to the main board!</p>
    </div>
  );
};

export default MainBoard;
