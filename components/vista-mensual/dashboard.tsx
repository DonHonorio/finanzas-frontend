'use client'

import { useMemo } from 'react'
import {
    CellContext,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { CategoryRow, Month } from '@/src/types/dashboard-types'
import { data } from '@/src/mock-data'

const months: Month[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

function sumMonth(data: CategoryRow[], month: Month) {
    return data.reduce((acc, row) => acc + row.months[month], 0)
}

function sumBudgets(data: CategoryRow[]) {
    return data.reduce((acc, row) => acc + row.budget, 0)
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(value)
}


export function Dashboard() {
    const columns = useMemo<ColumnDef<CategoryRow>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Categoría',
        },
        {
            accessorKey: 'budget',
            header: 'Presupuesto',
            cell: info => formatCurrency(info.getValue<number>()),
        },
        ...months.map(month => ({
            id: month,
            header: month.toUpperCase(),
            accessorFn: row => row.months[month],
            cell: info => formatCurrency(info.getValue<number>()),
        } as ColumnDef<CategoryRow>)),
    ], [])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 border-b">
                {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                        {hg.headers.map(header => (
                            <th
                                key={header.id}
                                className="px-4 py-3 text-left font-semibold text-gray-600"
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr
                        key={row.id}
                        className="border-b hover:bg-gray-50 transition"
                    >
                        {row.getVisibleCells().map(cell => (
                            <td
                                key={cell.id}
                                className="px-4 py-2 text-right whitespace-nowrap"
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>

            <tfoot className="bg-gray-100 font-semibold">
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
