import { flexRender, Table } from "@tanstack/react-table";
import { columnWidths, getCellColor } from "./dashboard";
import { CategoryRow } from "@/src/types/dashboard-types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Edit2, Eye } from "lucide-react";

type Props = {
    table: Table<CategoryRow>
    onView: (category: CategoryRow) => void
    onEdit: (category: CategoryRow) => void
}

export function TableBody({ table, onView, onEdit }: Props) {

    console.log('RENDERIZANDO TABLE-BODY')

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
                    <tr key={row.id}
                        className="border-b border-border hover:bg-gray-50">
                        {row.getVisibleCells().map(cell => (
                            <td
                                key={cell.id}
                                className={cn('p-3 text-[16px] font-normal whitespace-nowrap overflow-hidden text-ellipsis ',
                                    cell.column.id === 'category' ? 'text-left' : 'text-center',
                                    cell.column.id != 'category' && cell.column.id != 'budget' && 'bg-muted/30',
                                    cell.column.id != 'category' && cell.column.id != 'budget' && getCellColor(cell.getValue<number>(), row.getValue('budget'), true)
                                )}
                            >
                                {cell.column.id !== 'category' ? (
                                    flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )
                                ) : (
                                    <div className="flex items-center group">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}

                                        <div className="flex ml-auto gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => onView(row.original)}>
                                                <Eye className="h-4 w-4 text-primary" />
                                            </Button>

                                            <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
                                                <Edit2 className="h-4 w-4 text-primary" />
                                            </Button>
                                        </div>
                                    </div>
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