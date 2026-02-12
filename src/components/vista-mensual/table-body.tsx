import { flexRender, Table } from "@tanstack/react-table"
import { categoryColumnTitle } from "./dashboard"
import { CategoryRow } from "@/src/types/dashboard-types"
import { cn } from "@/src/lib/utils"
import { Button } from "../ui/button"
import { Edit2, Eye } from "lucide-react"
import { columnWidths, getCellColor } from "@/src/helpers/dashboard-helpers"

type Props = {
    table: Table<CategoryRow>
    onView: (category: CategoryRow) => void
    onEdit: (category: CategoryRow) => void
}

export function TableBody({ table, onView, onEdit }: Props) {

    return (
        <table className="w-full table-fixed border-collapse text-sm">
            {/* 
              CRÍTICO: Este colgroup DEBE coincidir exactamente con el de TableHeader
              Si no, los anchos de columnas no alinearán y se romperá el layout table-fixed
              table.getAllLeafColumns() garantiza el mismo orden que en TableHeader
            */}
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
                                    // Alineación: categorías a izquierda, números centrados
                                    cell.column.id === categoryColumnTitle ? 'text-left' : 'text-center',
                                    // CRÍTICO: Solo aplica bg-muted/30 a celdas de MESES (no categoría ni presupuesto)
                                    cell.column.id !== categoryColumnTitle && cell.column.id !== 'budget' && 'bg-muted/30',
                                    // ⚠️ LÓGICA IMPORTANTE: getCellColor solo para celdas de MESES
                                    // Si se aplicara a 'budget', usaría el valor de budget como presupuesto para sí mismo
                                    cell.column.id !== categoryColumnTitle && cell.column.id !== 'budget' && getCellColor(cell.getValue<number>(), row.getValue('budget'), true)
                                )}
                            >
                                {/* 
                                  LÓGICA CRÍTICA: Renderizado condicional basado en tipo de columna
                                  - Para columnas de MESES y PRESUPUESTO: solo muestra el valor
                                  - Para columna de CATEGORÍA: muestra valor + botones de acción
                                  
                                  Esto evita que botones aparezcan en celdas numéricas
                                */}
                                {cell.column.id !== categoryColumnTitle ? (
                                    // Celdas numéricas (meses y presupuesto)
                                    flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )
                                ) : (
                                    // Celda de categoría - con botones de acción hover
                                    <div className="flex items-center group">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}

                                        {/* 
                                          CRÍTICO: Botones solo visibles al hacer hover SOBRE ESTA FILA
                                          ml-auto empuja los botones a la derecha dentro del espacio disponible
                                          opacity-0 group-hover:opacity-100 muestra botones solo al hover
                                          
                                          ⚠️ group referencia al div padre, no a toda la fila
                                          Los botones solo aparecen al hover sobre la celda de categoría
                                        */}
                                        <div className="flex ml-auto gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => onView(row.original)}>
                                                {/* icono de ojo */}
                                                <Eye className="h-4 w-4 text-primary" /> 
                                            </Button>

                                            <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
                                                {/* icono de lápiz */}
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