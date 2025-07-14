// import { tableData, TableRow } from "@/data/tableData";
// import { useEffect, useState } from "react";
// import { EricData } from "@/data/dataType";
import IBlog from "@/types/backend";

interface Iprops {
  blogs: IBlog[];
}

const MainBoard = (props: Iprops) => {
  // const [data, setData] = useState<EricData[]>([]);

  const { blogs } = props;
  console.log("check data >>>", blogs);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-3xl font-bold mb-6">Main Board</h1>

      <table
        className="border-collapse border w-11/12
      border-gray-300 rounded-lg overflow-hidden shadow-md"
      >
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-4 py-2">ID</th>
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
          {blogs?.map((row: IBlog, index: number) => (
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
                  <button
                    className="bg-blue-500 hover:bg-blue-600 cursor-pointer
                  text-white px-3 py-1 rounded text-sm duration-200"
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer
                  text-white px-3 py-1 rounded text-sm duration-200"
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 cursor-pointer
                  text-white px-3 py-1 rounded text-sm duration-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-lg mt-6 text-gray-600">Welcome to the main board!</p>
    </div>
  );
};

export default MainBoard;
