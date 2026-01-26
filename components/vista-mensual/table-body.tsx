import { flexRender, Table } from "@tanstack/react-table";
import { columnWidths } from "./dashboard";
import { CategoryRow } from "@/src/types/dashboard-types";

export function TableBody({ table }: { table: Table<CategoryRow> }) {
    return (
        <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
                {table.getAllLeafColumns().map(col => (
                    <col
                        key={col.id}
                        style={{ width: columnWidths[col.id] }}
                    />
                ))}
            </colgroup>

            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                        {row.getVisibleCells().map(cell => (
                            <td
                                key={cell.id}
                                className="px-4 py-2 text-right whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}