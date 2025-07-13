import { tableData, TableRow } from "@/data/tableData";

const MainBoard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-3xl font-bold mb-6">Main Board</h1>

      <table className="border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Class</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row: TableRow, index: number) => (
            <tr
              key={row.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 text-black`}
            >
              <td className="border border-gray-300 px-4 py-2 text-center">
                {row.id}
              </td>
              <td className="border border-gray-300 px-4 py-2">{row.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`${row.statusColor} px-2 py-1 rounded text-sm`}
                >
                  {row.status}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span className={`px-2 py-1 rounded text-sm`}>{row.class}</span>
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
