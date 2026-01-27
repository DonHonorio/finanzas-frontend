import { flexRender, Table } from "@tanstack/react-table";
import { columnWidths } from "./dashboard";
import { CategoryRow } from "@/src/types/dashboard-types";

export function TableHeader({ table }: { table: Table<CategoryRow> }) {

    return (
        <table className="w-full border-collapse text-sm table-fixed">
            <colgroup>
                {table.getAllLeafColumns().map(col => (
                    <col
                        key={col.id}
                        style={{ width: columnWidths[col.id] }}
                    />
                ))}
            </colgroup>

            <thead className="bg-gray-50 border-b border-border">
                {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                        {hg.headers.map(header => (
                            <th
                                key={header.id}
                                className={`px-4 py-3 text-end font-semibold text-secondary-foreground 
                                    ${header.column.id === 'name' ? 'text-left' : 'text-right'}
                                    bg-muted
                                    `}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
        </table>
    )
}