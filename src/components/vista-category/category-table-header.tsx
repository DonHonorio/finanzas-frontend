const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
] as const

// Mapeo de meses en español a su abreviatura en inglés (API externa requiere inglés)
const monthAbbreviations: Record<string, string> = {
    'enero': 'JANUARY',
    'febrero': 'FEBRUARY',
    'marzo': 'MARCH',
    'abril': 'APRIL',
    'mayo': 'MAY',
    'junio': 'JUNE',
    'julio': 'JULY',
    'agosto': 'AUGUST',
    'septiembre': 'SEPTEMBER',
    'octubre': 'OCTOBER',
    'noviembre': 'NOVEMBER',
    'diciembre': 'DECEMBER'
}

type CategoryTableHeaderProps = {
    gridStyle: React.CSSProperties  // Estilos dinámicos para layout de grid (anchos de columna)
    sortOrder: 'asc' | 'desc'      // Orden de la columna fecha
    onToggleSort: () => void
    onStartResize: (index: number, e: React.MouseEvent) => void  // Inicia redimensionado de columna manual por el usuario
}

export function CategoryTableHeader({
    gridStyle,
    sortOrder,
    onToggleSort,
    onStartResize
}: CategoryTableHeaderProps) {
    return (
        <div
            className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b grid gap-2 text-sm text-gray-400 font-medium"
            style={gridStyle}  // Define grid-template-columns dinámicamente
        >
            {/* Cabecera Fecha - con ordenación asc/desc */}
            <div className="flex items-center justify-center relative group">
                <button onClick={onToggleSort} className="hover:text-gray-600 flex items-center gap-1">
                    FECHA
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                </button>
                {/* Handler para redimensionar columna - visible solo en hover */}
                <div onMouseDown={(e) => onStartResize(0, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                    <div className="w-1 h-full bg-blue-200"/>
                </div>
            </div>

            {/* Cabecera Nombre */}
            <div className="relative group flex items-center justify-start">
                NOMBRE
                <div onMouseDown={(e) => onStartResize(1, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                    <div className="w-1 h-full bg-blue-200"/>
                </div>
            </div>

            {/* Cabecera Presupuesto */}
            <div className="text-center relative group flex items-center justify-center">
                PRESUPUESTO
                <div onMouseDown={(e) => onStartResize(2, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                    <div className="w-1 h-full bg-blue-200"/>
                </div>
            </div>

            {/* Columnas de meses (12) - índices 3 al 14 */}
            {monthNames.map((month, idx) => (
                <div key={month} className="text-center bg-gray-50 rounded-md py-1 text-xs relative group">
                    {/* Abreviatura en inglés de 3 letras (JAN, FEB, etc) */}
                    {monthAbbreviations[month].slice(0, 3)}
                    <div onMouseDown={(e) => onStartResize(3 + idx, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                        <div className="w-1 h-full bg-blue-200"/>
                    </div>
                </div>
            ))}

            {/* Cabecera Total - índice 15 */}
            <div className="text-center relative group flex items-center justify-center">
                TOTAL
                <div onMouseDown={(e) => onStartResize(15, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                    <div className="w-1 h-full bg-blue-200"/>
                </div>
            </div>
        </div>
    )
}