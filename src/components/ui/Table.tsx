import type { ReactNode } from "react";

interface Column<T> {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
}

export function Table<T>({
    columns,
    data,
    emptyMessage = "No records found.",
}: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#242424]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-[#242424] bg-[#151515]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666666]"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-[#666666]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#1f1f1f] last:border-b-0 hover:bg-[#151515]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 text-sm text-[#b0b0b0]"
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}