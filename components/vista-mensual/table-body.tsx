import { flexRender, Table } from "@tanstack/react-table";
import { columnWidths, getCellColor } from "./dashboard";
import { CategoryRow } from "@/src/types/dashboard-types";
import { cn } from "@/lib/utils";

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
                    <tr key={row.id} className="border-b border-border hover:bg-gray-50">
                        {row.getVisibleCells().map(cell => (
                            <td
                                key={cell.id}
                                className={cn('p-3 text-[16px] font-normal whitespace-nowrap overflow-hidden text-ellipsis ',
                                    cell.column.id === 'name' ? 'text-left' : 'text-right',
                                    cell.column.id != 'name' && cell.column.id != 'budget' && 'bg-muted/30',
                                    cell.column.id != 'name' && cell.column.id != 'budget' && getCellColor(cell.getValue<number>(), row.getValue('budget'), true)
                                )}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        )
                        )}
                    </tr>
                )
                )}
            </tbody>
        </table>
    )
}