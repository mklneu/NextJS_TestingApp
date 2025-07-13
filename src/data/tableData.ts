interface TableRow {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  class: string;
}

const tableData: TableRow[] = [
  {
    id: 1,
    name: "Khanh",
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
    class: "it64",
  },
  {
    id: 2,
    name: "Admin",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800",
    class: "it64",
  },
  {
    id: 3,
    name: "User",
    status: "Inactive",
    statusColor: "bg-red-100 text-red-800",
    class: "it64",
  },
  {
    id: 4,
    name: "Guest",
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
    class: "it64",
  },
  {
    id: 5,
    name: "Developer",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800",
    class: "it64",
  },
];

export { tableData };
export type { TableRow };
