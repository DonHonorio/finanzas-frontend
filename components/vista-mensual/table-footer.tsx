import { columnWidths, formatCurrency, months } from "./dashboard";
import { data } from "@/src/mock-data";
import { CategoryRow, Month } from "@/src/types/dashboard-types";
import { Table } from "@tanstack/react-table";

function sumMonth(data: CategoryRow[], month: Month) {
    return data.reduce((acc, row) => acc + row.months[month], 0)
}

function sumBudgets(data: CategoryRow[]) {
    return data.reduce((acc, row) => acc + row.budget, 0)
}

export function TableFooter({ table }: { table: Table<CategoryRow> }) {
    return (
        <table className="w-full table-fixed border-collapse text-sm bg-gray-100 font-semibold border-t">
            <colgroup>
                {table.getAllLeafColumns().map(col => (
                    <col
                        key={col.id}
                        style={{ width: columnWidths[col.id] }}
                    />
                ))}
            </colgroup>

            <tfoot>
                <tr>
                    <td className="px-4 py-3 text-left">TOTAL</td>
                    <td className="px-4 py-3 text-right">
                        {formatCurrency(sumBudgets(data))}
                    </td>
                    {months.map(m => (
                        <td key={m} className="px-4 py-3 text-right">
                            {formatCurrency(sumMonth(data, m))}
                        </td>
                    ))}
                </tr>
            </tfoot>
        </table>

    )
}