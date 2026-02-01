import { columnWidths } from "@/src/helpers/dashboard-helpers"
import { formatCurrency, months } from "@/src/lib/utils"
import { CategoryRow, Month } from "@/src/types/dashboard-types"
import { Table } from "@tanstack/react-table"

// Calcula el total gastado/ingresado para un mes específico
// Suma todos los valores de ese mes en cada categoría
function sumMonth(data: CategoryRow[], month: Month) {
  return data.reduce((acc, row) => acc + (row.months[month] || 0), 0)
}

// Calcula el total de presupuestos de todas las categorías
function sumBudgets(data: CategoryRow[]) {
  return data.reduce((acc, row) => acc + row.budget, 0)
}

type Props = {
  table: Table<CategoryRow>
  data: CategoryRow[] // Datos actuales mostrados en la tabla
}

export function TableFooter({ table, data }: Props) {
  return (
    // Tabla independiente que alinea sus columnas con la tabla principal
    // table-fixed + mismo colgroup garantiza alineación perfecta
    <table className="w-full table-fixed border-collapse text-sm font-semibold border-t border-border">
      {/* 
        MISMO colgroup que TableHeader y TableBody
        Esto asegura que las columnas del footer coincidan exactamente
        en ancho con las columnas superiores
      */}
      <colgroup>
        {table.getAllLeafColumns().map(col => (
          <col
            key={col.id}
            style={{ width: columnWidths[col.id] }}
          />
        ))}
      </colgroup>

      {/* Fila de totales */}
      <tfoot>
        <tr>
          {/* Celda "TOTAL" - ocupa la columna de categorías */}
          <td className="px-4 py-3 text-left">TOTAL</td>
          
          {/* Total de presupuestos - formateado como moneda */}
          <td className="px-4 py-3 text-right">
            {formatCurrency(sumBudgets(data))}
          </td>
          
          {/* Totales por mes - cada mes calcula la suma de todas las categorías */}
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