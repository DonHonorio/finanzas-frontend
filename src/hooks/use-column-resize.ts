import { useState, useEffect, useRef } from 'react'
import { ColumnConfig } from '@/src/types/general-types'

/**
 * Hook para manejar el redimensionamiento de columnas en una tabla
 * Calcula anchos en porcentaje para mantener responsive design
 */
export function useColumnResize(columnsSetup: ColumnConfig[]) {
    // Estado que almacena el ancho actual de cada columna en porcentaje
    const [colWidths, setColWidths] = useState<number[]>(columnsSetup.map(c => c.initial))

    // Referencia para el proceso de redimensionamiento activo
    // Contiene toda la información necesaria para calcular el nuevo ancho
    const resizingRef = useRef<{
        index: number          // Índice de la columna que se está redimensionando
        startX: number        // Posición X inicial del mouse en píxeles
        startWidth: number    // Ancho inicial de la columna en porcentaje
        otherWidthsSum: number // Suma de los anchos de TODAS las otras columnas
    } | null>(null)

    // Referencia al contenedor de la tabla para calcular dimensiones
    const tableContainerRef = useRef<HTMLDivElement>(null)

    // Lógica para redimensionar columnas
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingRef.current || !tableContainerRef.current) return

            const { index, startX, startWidth, otherWidthsSum } = resizingRef.current
            const containerWidth = tableContainerRef.current.clientWidth
            const contentWidth = containerWidth - 48  // Resta padding (px-6*2 = 48px)

            // Diferencia en píxeles movidos y su equivalencia en porcentaje
            const diffPixel = e.clientX - startX
            const diffPercent = (diffPixel / contentWidth) * 100

            // Límite mínimo: no puede ser menor que min definido (default 5%)
            const minWidth = columnsSetup[index]?.min ?? 5

            // Límite máximo: 
            // 1. Los gaps entre columnas ocupan espacio (gap-2 = 8px * 2 lados)
            const gapsPx = 2 * 8
            const gapsPercent = (gapsPx / contentWidth) * 100
            // 2. El 100% total - gaps - las otras columnas = lo máximo que puede ocupar esta
            const maxAllowedTotal = 100 - gapsPercent - 0.1 // Margen para evitar overflow
            const maxWidth = Math.max(minWidth, maxAllowedTotal - otherWidthsSum)

            // Aplica límites y calcula nuevo ancho
            const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + diffPercent))

            setColWidths(prev => {
                const next = [...prev]
                next[index] = newWidth
                return next
            })
        }

        const handleMouseUp = () => {
            if (resizingRef.current) {
                resizingRef.current = null
                document.body.style.cursor = '' // Restaura cursor
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [columnsSetup])

    /**
     * Inicia el proceso de redimensionamiento de una columna
     * Se llama desde el evento onMouseDown en el borde de la columna
     */
    const startResize = (index: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Calcula suma de anchos de TODAS las otras columnas
        const otherWidthsSum = colWidths.reduce((sum, w, i) => i === index ? sum : sum + w, 0)

        resizingRef.current = {
            index,
            startX: e.clientX,
            startWidth: colWidths[index],
            otherWidthsSum
        }

        // Cambia cursor global para indicar redimensionamiento
        document.body.style.cursor = 'col-resize'
    }

    return {
        colWidths,           // Array con anchos actuales en porcentaje
        tableContainerRef,   // Ref para el contenedor de la tabla
        startResize         // Función para iniciar redimensionamiento
    }
}