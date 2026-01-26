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
import { TableBody } from './table-body'
import { TableFooter } from './table-footer'
import { TableHeader } from './table-header'

export const months: Month[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(value)
}

export const columnWidths: Record<string, string> = {
    name: '20%',
    budget: '10%',
    enero: '5%',
    febrero: '5%',
    marzo: '5%',
    abril: '5%',
    mayo: '5%',
    junio: '5%',
    julio: '5%',
    agosto: '5%',
    septiembre: '5%',
    octubre: '5%',
    noviembre: '5%',
    diciembre: '5%',
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
        <div className="h-full flex flex-col border rounded-lg overflow-hidden">

            {/* HEADER */}
            <div className="shrink-0">
                <TableHeader table={table} />
            </div>

            {/* BODY (scrollable) */}
            <div className="flex-1 overflow-auto">
                <TableBody table={table} />
            </div>

            {/* FOOTER (fixed abajo) */}
            <div className="shrink-0 sticky bottom-0 z-10">
                <TableFooter table={table} />
            </div>

        </div>
    )
}

