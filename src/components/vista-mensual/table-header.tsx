import { flexRender, Table } from "@tanstack/react-table"
import { categoryColumnTitle } from "./dashboard"
import { CategoryRow } from "@/src/types/dashboard-types"
import { columnWidths } from "@/src/helpers/dashboard-helpers"

/**
 * Componente TableHeader - Renderiza la cabecera de la tabla usando react-table
 * 
 * Este componente es crítico porque:
 * 1. Define la estructura de tabla HTML real (<table>, <thead>, <tr>, <th>)
 * 2. Aplica anchos de columna FIJOS mediante <colgroup> (table-fixed)
 * 3. Controla la alineación del texto (izquierda para categorías, centro para números)
 * 
 * IMPORTANTE: Este componente renderiza un <table> COMPLETO, no solo <thead>
 * Esto es necesario porque <colgroup> debe estar a nivel de <table>, no de <thead>
 */
export function TableHeader({ table }: { table: Table<CategoryRow> }) {

    return (
        // TABLA COMPLETA (no solo thead) para contener <colgroup>
        // table-fixed: Sistema de layout de tabla con anchos fijos (más predecible)
        // border-collapse: Elimina espacio entre bordes (diseño más limpio)
        // w-full: Ocupa el 100% del contenedor padre
        <table className="w-full border-collapse text-sm table-fixed">

            {/* 
              COLGROUP - DEFINE ANCHOS DE COLUMNA A NIVEL DE TABLA
              Esto es OBLIGATORIO con table-fixed y previene problemas de renderizado
              
              ¿Por qué no usar width en <th>? Porque:
              1. table-fixed requiere <colgroup> para anchos consistentes
              2. Evita que el navegador recalcule anchos dinámicamente (mejor rendimiento)
              3. Garantiza que header y body tengan los mismos anchos (alineación perfecta)
            */}
            <colgroup>
                {/*
                  Mapea TODAS las columnas hoja (leaf columns) - no columnas agrupadas
                  En tu tabla: categoría, presupuesto, enero, febrero, ..., diciembre
                  
                  columnWidths es un objeto tipo: { category: '12%', budget: '6%', enero: '6%', ... }
                  Estos porcentajes deben sumar ~100% para evitar overflow horizontal
                */}
                {table.getAllLeafColumns().map(col => (
                    <col
                        key={col.id}
                        style={{ width: columnWidths[col.id] }}
                    /*
                      IMPORTANTE: El col.id DEBE coincidir con las keys en columnWidths
                      Para columnas generadas dinámicamente (meses), el id se definió en dashboard.tsx:
                      ...months.map(month => ({ id: month, ... }))
                    */
                    />
                ))}
            </colgroup>

            {/* THEAD - CABECERA VISUAL DE LA TABLA */}
            <thead className="bg-gray-50 border-b border-border">
                {/*
                  HEADER GROUPS - react-table puede tener múltiples filas de cabecera
                  En tu caso simple: solo UN header group con una fila
                  Pero la arquitectura soporta cabeceras multi-nivel (ej: agrupación por trimestres)
                */}
                {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                        {hg.headers.map(header => {
                            // console.log('header column id: ', header.column.id)
                            return (
                                <th
                                    key={header.id}
                                    className={`px-4 py-3 font-semibold text-secondary-foreground 
                                    ${header.column.id === categoryColumnTitle ? 'text-left' : 'text-center'}
                                    bg-muted
                                    `}
                                >
                                    {/* flexRender - MAGIA DE REACT-TABLE
                                    Renderiza el contenido definido en columnDef.header */}
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            )
                        }
                        )}
                    </tr>
                ))}
            </thead>
        </table>
        /*
          ¿POR QUÉ NO CIERRA <table> CON <tbody>?
          Este componente SOLO renderiza la cabecera. El <tbody> se renderiza
          en TableBody.tsx. Ambos comparten la MISMA estructura de <table>
          gracias al <colgroup> que define anchos consistentes.
          
          Esto permite:
          1. Scroll independiente del body (overflow-auto) manteniendo header fijo
          2. Separación clara de responsabilidades
          3. Posibilidad de tener múltiples bodies (ej: grupos expandibles)
        */
    )
}