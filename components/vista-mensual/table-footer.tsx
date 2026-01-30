import { columnWidths, formatCurrency, months } from "./dashboard"
import { CategoryRow, Month } from "@/src/types/dashboard-types"
import { Table } from "@tanstack/react-table"

function sumMonth(data: CategoryRow[], month: Month) {
  return data.reduce((acc, row) => acc + (row.months[month] || 0), 0)
}

function sumBudgets(data: CategoryRow[]) {
  return data.reduce((acc, row) => acc + row.budget, 0)
}

type Props = {
  table: Table<CategoryRow>
  data: CategoryRow[]
}

export function TableFooter({ table, data }: Props) {
  return (
    <table className="w-full table-fixed border-collapse text-sm font-semibold border-t border-border">
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
            <td key={m} className="px-4 py-3 text-right bg-secondary/30">
              {formatCurrency(sumMonth(data, m))}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  )
}
